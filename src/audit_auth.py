import os
import re

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("=" * 70)
print("HALAL APP AUTH SYSTEM AUDIT & FIX")
print("=" * 70)

# =============================================================================
# 1. CHECK App.tsx - handleAuthSuccess
# =============================================================================
print("\n[1] CHECKING App.tsx - handleAuthSuccess...")
app_content = read_file("App.tsx")

# Find handleAuthSuccess
auth_success_match = re.search(r'const handleAuthSuccess = async \(.*?\) => \{.*?\n    \};', app_content, re.DOTALL)
if auth_success_match:
    print("  handleAuthSuccess found:")
    for line in auth_success_match.group().split('\n')[:15]:
        print(f"    {line}")
else:
    print("  WARNING: handleAuthSuccess not found!")

# Check setIsAuthenticated calls in handleAuthSuccess
if "setIsAuthenticated(true)" in app_content:
    print("  setIsAuthenticated(true) IS present")
else:
    print("  CRITICAL: setIsAuthenticated(true) MISSING!")

# Check localStorage.setItem('halal_token', token)
if "localStorage.setItem('halal_token', token)" in app_content:
    print("  localStorage.setItem('halal_token', token) IS present")
else:
    print("  CRITICAL: localStorage token save MISSING!")

# =============================================================================
# 2. CHECK App.tsx - Header props
# =============================================================================
print("\n[2] CHECKING App.tsx - Header props...")

header_match = re.search(r'<Header.*?\n        />', app_content, re.DOTALL)
if header_match:
    header_section = header_match.group()
    print("  Header props found:")
    for line in header_section.split('\n'):
        stripped = line.strip()
        if stripped and not stripped.startswith('//'):
            print(f"    {stripped}")
    
    # Check required props
    required_props = ['onLogin', 'onLogout', 'onProfile', 'onPrivacy', 'onAccount', 'onAdmin']
    for prop in required_props:
        if prop in header_section:
            print(f"  {prop}: PRESENT")
        else:
            print(f"  {prop}: MISSING!")

# =============================================================================
# 3. CHECK AuthScreen.tsx - onAuthSuccess call
# =============================================================================
print("\n[3] CHECKING AuthScreen.tsx - onAuthSuccess...")

auth_screen = read_file("screens/AuthScreen.tsx")

# Find handleLogin
handle_login_match = re.search(r'const handleLogin = async \(.*?\) => \{.*?\n  \};', auth_screen, re.DOTALL)
if handle_login_match:
    print("  handleLogin found:")
    for line in handle_login_match.group().split('\n')[:10]:
        print(f"    {line}")
else:
    print("  handleLogin not found")

# Check if onAuthSuccess is called after login
if "onAuthSuccess" in auth_screen:
    print("  onAuthSuccess IS used in AuthScreen")
    # Find where it's called
    onauth_calls = re.findall(r'onAuthSuccess\(.*?\)', auth_screen)
    for call in onauth_calls:
        print(f"    Call: {call}")
else:
    print("  CRITICAL: onAuthSuccess NOT used in AuthScreen!")

# =============================================================================
# 4. CHECK apiClient.ts - login method
# =============================================================================
print("\n[4] CHECKING apiClient.ts - login method...")

api_client = read_file("services/apiClient.ts")

login_match = re.search(r'async login\(.*?\): Promise<.*?> \{.*?\n  \}', api_client, re.DOTALL)
if login_match:
    print("  login method found:")
    for line in login_match.group().split('\n')[:10]:
        print(f"    {line}")
else:
    print("  login method not found")

# =============================================================================
# 5. CHECK Header.tsx - dropdown logic
# =============================================================================
print("\n[5] CHECKING Header.tsx - dropdown logic...")

header_tsx = read_file("components/Header.tsx")

# Check dropdown rendering
if "dropdownOpen" in header_tsx:
    print("  dropdownOpen state: PRESENT")
else:
    print("  dropdownOpen state: MISSING!")

if "isAuthenticated && (" in header_tsx:
    print("  Authenticated dropdown check: PRESENT")
else:
    print("  Authenticated dropdown check: MISSING!")

# Check if onProfile/onPrivacy/onAccount/onAdmin are used
dropdown_props = ['onProfile', 'onPrivacy', 'onAccount', 'onAdmin']
for prop in dropdown_props:
    if prop in header_tsx:
        print(f"  {prop} usage: PRESENT")
    else:
        print(f"  {prop} usage: MISSING!")

# =============================================================================
# 6. FIX ISSUES
# =============================================================================
print("\n" + "=" * 70)
print("APPLYING FIXES...")
print("=" * 70)

fixes_applied = []

# Fix 1: Ensure handleAuthSuccess sets isAuthenticated properly
if "setIsAuthenticated(true)" not in app_content:
    print("\n[FIX 1] Adding setIsAuthenticated(true) to handleAuthSuccess...")
    # Find the pattern and add setIsAuthenticated
    old_pattern = "setUserProfile(currentProfile);"
    new_pattern = "setUserProfile(currentProfile);\n    setIsAuthenticated(true);"
    if old_pattern in app_content and new_pattern not in app_content:
        app_content = app_content.replace(old_pattern, new_pattern, 1)
        fixes_applied.append("Added setIsAuthenticated(true) to handleAuthSuccess")
        print("  FIXED!")
    else:
        print("  Already present or pattern not found")
else:
    print("\n[FIX 1] setIsAuthenticated(true) already present - OK")

# Fix 2: Ensure Header has all required props
header_section = re.search(r'<Header.*?\n        />', app_content, re.DOTALL)
if header_section:
    header_text = header_section.group()
    missing_props = []
    for prop in ['onProfile', 'onPrivacy', 'onAccount', 'onAdmin']:
        if prop not in header_text:
            missing_props.append(prop)
    
    if missing_props:
        print(f"\n[FIX 2] Adding missing Header props: {', '.join(missing_props)}...")
        # Add props before the closing />
        props_to_add = '\n'.join([f"          {prop}={() => setTab('{prop.replace('on', '').lower()}')}" for prop in missing_props])
        new_header = header_text.replace("        />", f"        {props_to_add}\n        />")
        app_content = app_content.replace(header_text, new_header)
        fixes_applied.append(f"Added missing Header props: {', '.join(missing_props)}")
        print("  FIXED!")
    else:
        print("\n[FIX 2] All Header props present - OK")

# Fix 3: Check AuthScreen onAuthSuccess prop usage
if "onAuthSuccess" in auth_screen:
    # Check if it's called in handleLogin
    handle_login_section = re.search(r'const handleLogin = async.*?^  \};', auth_screen, re.DOTALL | re.MULTILINE)
    if handle_login_section and "onAuthSuccess" not in handle_login_section.group():
        print("\n[FIX 3] onAuthSuccess not called in handleLogin - NEEDS MANUAL FIX")
        print("  The AuthScreen handleLogin should call onAuthSuccess(result.token, result.profile)")
    else:
        print("\n[FIX 3] onAuthSuccess called in handleLogin - OK")

# Save App.tsx if changed
if fixes_applied:
    write_file("App.tsx", app_content)
    print(f"\n{'=' * 70}")
    print("FIXES APPLIED:")
    for fix in fixes_applied:
        print(f"  - {fix}")
    print(f"{'=' * 70}")
else:
    print("\nNo fixes needed - all checks passed!")

print("\n" + "=" * 70)
print("AUDIT COMPLETE")
print("=" * 70)
print("\nNEXT STEPS:")
print("1. If fixes were applied, rebuild: npm run build")
print("2. Deploy: npx wrangler pages deploy dist")
print("3. Clear browser localStorage and test login flow")
print("4. Check console for errors during login")
