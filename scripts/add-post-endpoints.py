#!/usr/bin/env python3
"""
Script to add POST endpoints to all microservice controllers
"""

import os
import re

SERVICES = [
    'health-service',
    'level-service',
    'speed-service',
    'armour-service',
    'personality-service',
    'note-service',
]

def add_post_import(content):
    """Add Post to imports if not present"""
    if 'Post,' in content or ', Post' in content:
        return content

    # Add Post to imports
    content = content.replace(
        'import {\n  Controller,\n  Get,',
        'import {\n  Controller,\n  Get,\n  Post,'
    )
    return content

def add_post_endpoint(content, service_name):
    """Add POST endpoint after @Controller decorator"""

    # Extract entity name from service (e.g., 'health' from 'health-service')
    entity = service_name.replace('-service', '').capitalize()

    post_method = f'''
  @Post()
  @ApiOperation({{ summary: "Create {entity} for character" }})
  create(
    @Request() req: any,
    @Param("characterId") characterId: string,
    @Body() dto: any
  ) {{
    return this.service.create(req.user.userId, characterId, dto);
  }}

'''

    # Find the position after constructor and insert POST method
    pattern = r'(constructor\([^)]+\) \{\})\n\n  @Get\(\)'
    replacement = r'\1\n' + post_method + '  @Get()'

    content = re.sub(pattern, replacement, content)
    return content

def add_create_method_to_service(service_path, entity_name):
    """Add create method to service file"""
    service_file = f"{service_path}/src/application/services/{entity_name}.service.ts"

    with open(service_file, 'r') as f:
        content = f.read()

    # Check if create method already exists
    if 'async create(' in content:
        print(f"  ✓ Service already has create method: {service_file}")
        return

    # Add create method after constructor
    create_method = f'''
  async create(userId: string, characterId: string, dto: any) {{
    const item = this.repository.create({{
      ...dto,
      characterId,
    }});
    return this.repository.save(item);
  }}

'''

    # Insert after constructor
    pattern = r'(constructor\([^)]+\) \{\})\n\n  async findByCharacter'
    replacement = r'\1\n' + create_method + '  async findByCharacter'

    content = re.sub(pattern, replacement, content)

    with open(service_file, 'w') as f:
        f.write(content)

    print(f"  ✓ Added create method to {service_file}")

def process_service(service_name):
    """Process a single service"""
    print(f"\nProcessing {service_name}...")

    base_path = f"/home/user/dungeonland-backend/services/{service_name}"
    entity_name = service_name.replace('-service', '')

    # Update controller
    controller_file = f"{base_path}/src/presentation/controllers/{entity_name}.controller.ts"

    if not os.path.exists(controller_file):
        print(f"  ✗ Controller not found: {controller_file}")
        return

    with open(controller_file, 'r') as f:
        content = f.read()

    # Add Post import
    content = add_post_import(content)

    # Add POST endpoint
    content = add_post_endpoint(content, service_name)

    with open(controller_file, 'w') as f:
        f.write(content)

    print(f"  ✓ Updated controller: {controller_file}")

    # Update service
    add_create_method_to_service(base_path, entity_name)

def main():
    print("Adding POST endpoints to microservices...")

    for service in SERVICES:
        process_service(service)

    print("\n✅ All services updated!")

if __name__ == "__main__":
    main()
