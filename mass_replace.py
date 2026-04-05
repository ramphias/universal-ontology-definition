import os
import re
import glob

# Paths to search and replace text in
EXTENSIONS = ['*.md', '*.json', '*.yml', '*.yaml', '*.html']
EXCLUDE_DIRS = ['.git', '.github', '_mkdocs_site', 'site_local', 'site_test', 'site', '.venv', 'venv', 'node_modules']

def process_file_content(content):
    # 1. Specific phrases first (English)
    content = re.sub(r'Industry Addons?', 'Industry and Domain Extension', content, flags=re.IGNORECASE)
    content = re.sub(r'Industry Extensions?', 'Industry and Domain Extension', content, flags=re.IGNORECASE)
    
    # 2. Specific phrases (Chinese)
    content = content.replace("行业与业务领域 Addon", "行业与业务领域扩展")
    content = content.replace("行业与业务领域 Addons", "行业与业务领域扩展")
    content = content.replace("行业 Addon", "行业与业务领域扩展")
    content = content.replace("行业 Addons", "行业与业务领域扩展")
    content = content.replace("业务领域 Addon", "行业与业务领域扩展")

    # 3. General replacements for remaining terms
    content = content.replace("Addons", "Extensions")
    content = content.replace("addons", "extensions")
    content = content.replace("ADDONS", "EXTENSIONS")
    content = content.replace("Addon", "Extension")
    content = content.replace("addon", "extension")
    content = content.replace("ADDON", "EXTENSION")

    return content

def update_files():
    for root, dirs, files in os.walk('.'):
        # Mutating the list in-place to skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if any(file.endswith(ext.replace('*', '')) for ext in EXTENSIONS):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = process_file_content(content)
                    
                    if content != new_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated content in {filepath}")
                except Exception as e:
                    print(f"Failed to process {filepath}: {e}")

if __name__ == "__main__":
    update_files()
