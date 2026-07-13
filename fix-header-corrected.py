#!/usr/bin/env python3
"""
ZAWAJ HALAL - CORRECTED HEADER FIX
Handles line-wrapped content in Header.tsx
"""

import shutil
from datetime import datetime
from pathlib import Path

def main():
    header = Path(r"C:\Users\HB LAPTOP STORE\Documents\https-github.com-mahdialmuntadhar1-rgb-Halal\src\components\Header.tsx")
    
    # Backup
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup = str(header) + ".backup-corrected-" + ts
    shutil.copy2(header, backup)
    print(f"Backup: {Path(backup).name}")
    
    with open(header, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    changes = []
    
    # Fix 1: Add isAuthenticated and onLoginClick to interface
    # Find "onLogout?:" line, then "void;" line, insert after
    for i in range(len(lines) - 1):
        if 'onLogout?:' in lines[i] and 'void;' in lines[i+1]:
            # Check if already added
            if i+2 < len(lines) and 'isAuthenticated' in lines[i+2]:
                break
            indent = len(lines[i+1]) - len(lines[i+1].lstrip())
            lines.insert(i+2, ' ' * indent + 'isAuthenticated?: boolean;\n')
            lines.insert(i+3, ' ' * indent + 'onLoginClick?: () => void;\n')
            changes.append(f"Lines {i+3}-{i+4}: Added isAuthenticated + onLoginClick to interface")
            break
    
    # Fix 2: Add isAuthenticated and onLoginClick to function params
    # Find "onLogout" (as param, not "onLogout?:"), then "}: HeaderProps)" line, insert before
    for i in range(len(lines) - 1):
        stripped = lines[i].strip()
        if stripped == 'onLogout' or stripped == 'onLogout,':
            if i+1 < len(lines) and '}: HeaderProps)' in lines[i+1]:
                # Check if already added
                if i-1 >= 0 and 'isAuthenticated' in lines[i-1]:
                    break
                indent = len(lines[i]) - len(lines[i].lstrip())
                # Add comma to onLogout if not present
                if not lines[i].rstrip().endswith(','):
                    lines[i] = lines[i].rstrip() + ',\n'
                lines.insert(i+1, ' ' * indent + 'isAuthenticated,\n')
                lines.insert(i+2, ' ' * indent + 'onLoginClick,\n')
                changes.append(f"Lines {i+2}-{i+3}: Added isAuthenticated + onLoginClick to function params")
                break
    
    # Fix 3: Change userProfileName to isAuthenticated
    for i, line in enumerate(lines):
        if 'userProfileName' in line and '?' in line:
            lines[i] = line.replace('userProfileName', 'isAuthenticated', 1)
            changes.append(f"Line {i+1}: Changed userProfileName to isAuthenticated")
            break
    
    # Fix 4: Verify login button uses onLoginClick
    for i, line in enumerate(lines):
        if 'onLoginClick' in line and 'onClick=' in line:
            changes.append(f"Line {i+1}: Login button already uses onLoginClick")
            break
    
    if changes:
        with open(header, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    print(f"\nChanges ({len(changes)}):")
    for c in changes:
        print(f"  + {c}")
    
    if not changes:
        print("  No changes needed")
    
    print("\n" + "=" * 40)
    print("Run: npm run build")
    print("=" * 40)

if __name__ == "__main__":
    main()