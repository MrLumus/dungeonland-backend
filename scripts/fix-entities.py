#!/usr/bin/env python3
"""Fix entities by removing Character relations and using characterId"""

import os
import re

SERVICES_DIR = "/home/user/dungeonland-backend/services"

# Services that need entity fixes (all except auth and characters)
SERVICES_TO_FIX = [
    "health-service",
    "level-service", 
    "speed-service",
    "armour-service",
    "stats-service",
    "personality-service",
    "note-service",
]

def fix_entity_file(file_path):
    """Fix entity file by removing Character imports and relations"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove Character import
    content = re.sub(r'import.*@character/entities.*\n', '', content)
    content = re.sub(r'import.*Character.*from.*\n', '', content)
    
    # Remove OneToOne/ManyToOne decorators and Character relation
    # Pattern: @OneToOne(() => Character, ...) followed by @JoinColumn and character property
    content = re.sub(
        r'@OneToOne\(\(\) => Character.*?\)\s*@JoinColumn.*?\n\s*character:.*?;',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Remove ManyToOne if exists
    content = re.sub(
        r'@ManyToOne\(\(\) => Character.*?\)\s*@JoinColumn.*?\n\s*character:.*?;',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Remove standalone @JoinColumn and character field
    content = re.sub(
        r'@JoinColumn\(\{.*?\}\)\s*\n\s*character:.*?;',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Add characterId column if not exists
    if 'characterId' not in content and 'Character' in file_path:
        # Find insertion point before last }
        lines = content.split('\n')
        insert_idx = -1
        for i in range(len(lines)-1, -1, -1):
            if '}' in lines[i] and 'export class' not in lines[i]:
                insert_idx = i
                break
        
        if insert_idx > 0:
            lines.insert(insert_idx, '')
            lines.insert(insert_idx, "  @Column({ type: 'uuid' })")
            lines.insert(insert_idx, "  characterId: string;")
            lines.insert(insert_idx, '')
            content = '\n'.join(lines)
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Fixed: {file_path}")

def main():
    for service in SERVICES_TO_FIX:
        entity_dir = os.path.join(SERVICES_DIR, service, "src/domain/entities")
        if os.path.exists(entity_dir):
            for file in os.listdir(entity_dir):
                if file.endswith('.entity.ts'):
                    file_path = os.path.join(entity_dir, file)
                    fix_entity_file(file_path)
    
    print("\n✅ All entities fixed!")

if __name__ == "__main__":
    main()
