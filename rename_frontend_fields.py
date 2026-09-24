import os
from pathlib import Path

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content.replace('ai_risk', 'riskLevel').replace('ai_reason', 'riskReason')
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    src_dir = Path('/home/jesh/.gemini/antigravity/scratch/civicflow-ai-grievance-orchestrator/frontend/src')
    for filepath in src_dir.rglob('*.*'):
        if filepath.is_file() and filepath.suffix in ['.ts', '.tsx']:
            replace_in_file(filepath)

if __name__ == '__main__':
    main()
