import shutil
from datetime import datetime
from pathlib import Path

def backup(filepath):
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    b = str(filepath) + ".backup-safe-" + ts
    shutil.copy2(filepath, b)
    return b

def main():
    project = Path(r"C:\Users\HB LAPTOP STORE\Documents\https-github.com-mahdialmuntadhar1-rgb-Halal")
    header = project / "src" / "components" / "Header.tsx"
    
    print("=" * 50)
    print("  SAFE HEADER FIX")
    print("=" * 50)
    print()
    
    if not header.exists():
        print("ERROR: Header.tsx not found")
        return 1
    
    with open(header, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    changes = []
    
    # Fix 1: Add onLoginClick to interface (after isAuthenticated)
    for i, line in enumerate(lines):
        if 'isAuthenticated?: boolean;' in line and (i+1 >= len(lines) or 'onLoginClick' not in lines[i+1]):
            indent = len(line) - len(line.lstrip())
            lines.insert(i + 1, ' ' * indent + 'onLoginClick?: () => void;\n')
            changes.append(f"Line {i+2}: Added onLoginClick to interface")
            break
    
    # Fix 2: Add onLoginClick to function params (after isAuthenticated)
    for i, line in enumerate(lines):
        if line.strip() == 'isAuthenticated,' and (i+1 >= len(lines) or 'onLoginClick' not in lines[i+1]):
            indent = len(line) - len(line.lstrip())
            lines.insert(i + 1, ' ' * indent + 'onLoginClick,\n')
            changes.append(f"Line {i+2}: Added onLoginClick to function params")
            break
    
    # Fix 3: Change userProfileName to isAuthenticated
    for i, line in enumerate(lines):
        if '{userProfileName ? (' in line:
            lines[i] = line.replace('{userProfileName ? (', '{isAuthenticated ? (')
            changes.append(f"Line {i+1}: Changed userProfileName to isAuthenticated")
            break
    
    # Fix 4: ONLY change the onboarding click in the login button (after ") : (")
    found_else = False
    for i, line in enumerate(lines):
        if ') : (' in line:
            found_else = True
            continue
        if found_else and "() => setTab('onboarding')" in line:
            lines[i] = line.replace("() => setTab('onboarding')", 'onLoginClick')
            changes.append(f"Line {i+1}: Changed login button to onLoginClick")
            break
    
    if changes:
        with open(header, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    print(f"\nChanges made ({len(changes)}):")
    for c in changes:
        print(f"  + {c}")
    
    if not changes:
        print("  No changes needed")
    
    print("\n" + "=" * 50)
    print("  DONE")
    print("=" * 50)
    return 0

if __name__ == "__main__":
    exit(main())