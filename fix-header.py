import shutil
from datetime import datetime
from pathlib import Path

def backup(f):
    b = str(f) + '.backup-' + datetime.now().strftime('%Y%m%d-%H%M%S')
    shutil.copy2(f, b)
    return b

def main():
    header = Path(r"C:\Users\HB LAPTOP STORE\Documents\https-github.com-mahdialmuntadhar1-rgb-Halal\src\components\Header.tsx")
    
    print("=" * 50)
    print("  HEADER AUTH FIX")
    print("=" * 50)
    print()
    
    with open(header, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changes = []
    
    # Fix 1: Add isAuthenticated and onLoginClick to interface
    old1 = "  onLogout?: () => void;\n"
    new1 = "  onLogout?: () => void;\n  isAuthenticated?: boolean;\n  onLoginClick?: () => void;\n"
    if old1 in content and new1 not in content:
        content = content.replace(old1, new1, 1)
        changes.append("Added isAuthenticated + onLoginClick to interface")
    
    # Fix 2: Add isAuthenticated and onLoginClick to function params
    # Find "  onLogout\n}:" and replace with "  onLogout,\n  isAuthenticated,\n  onLoginClick,\n}:"
    old2 = "  onLogout\n}: HeaderProps) {"
    new2 = "  onLogout,\n  isAuthenticated,\n  onLoginClick,\n}: HeaderProps) {"
    if old2 in content and new2 not in content:
        content = content.replace(old2, new2, 1)
        changes.append("Added isAuthenticated + onLoginClick to function params")
    
    # Fix 3: Change userProfileName to isAuthenticated
    old3 = "{userProfileName ? ("
    new3 = "{isAuthenticated ? ("
    if old3 in content:
        content = content.replace(old3, new3, 1)
        changes.append("Changed userProfileName to isAuthenticated")
    
    # Fix 4: Change onboarding click to onLoginClick (only first occurrence after ") : (")
    # Split by ") : (" to find the else branch
    parts = content.split(") : (", 1)
    if len(parts) == 2:
        before_else = parts[0]
        after_else = parts[1]
        if "() => setTab('onboarding')" in after_else:
            after_else = after_else.replace("() => setTab('onboarding')", "onLoginClick", 1)
            content = before_else + ") : (" + after_else
            changes.append("Changed login button to onLoginClick")
    
    if content != original:
        with open(header, 'w', encoding='utf-8') as f:
            f.write(content)
    
    print(f"Changes made ({len(changes)}):")
    for c in changes:
        print(f"  + {c}")
    
    if not changes:
        print("  No changes needed")
    
    print("\n" + "=" * 50)
    print("  DONE - Run: npm run build")
    print("=" * 50)

if __name__ == "__main__":
    main()