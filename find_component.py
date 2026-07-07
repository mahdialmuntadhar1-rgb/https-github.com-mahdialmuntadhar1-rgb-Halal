import re

# Read file
with open(r'src/screens/LandingScreen.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the component declaration (search all lines)
print("=== SEARCHING FOR COMPONENT DECLARATION ===")
for i, line in enumerate(lines, 1):
    if 'LandingScreen' in line and ('=>' in line or 'function' in line):
        print(f"Line {i}: {line.rstrip()}")
        # Show context
        start = max(0, i-1)
        end = min(len(lines), i+5)
        for j in range(start, end):
            marker = ">>> " if j == i-1 else "    "
            print(f"{marker}{j+1}: {lines[j].rstrip()}")
        break

# Find where the component body starts (the opening brace)
print("\n=== FINDING OPENING BRACE ===")
for i, line in enumerate(lines, 1):
    if 'LandingScreen' in line and '{' in line:
        print(f"Line {i}: {line.rstrip()}")
        # Show next 3 lines
        for j in range(i, min(i+4, len(lines))):
            print(f"  {j+1}: {lines[j].rstrip()}")
        break
