import re

# Read file
with open(r'src/screens/LandingScreen.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Show first 40 lines to understand structure
print("=== FIRST 40 LINES ===")
for i, line in enumerate(lines[:40], 1):
    print(f"{i:3d}: {line.rstrip()}")

# Find the component declaration
print("\n=== SEARCHING FOR COMPONENT DECLARATION ===")
for i, line in enumerate(lines, 1):
    if 'LandingScreen' in line and '=>' in line and '{' in line:
        print(f"Found at line {i}: {line.rstrip()}")
        # Show next 5 lines
        for j in range(i, min(i+5, len(lines))):
            print(f"  {j+1}: {lines[j].rstrip()}")
        break
else:
    print("Could not find component declaration with '=>' and '{'")

# Check for INITIAL_MATCHES usage
print("\n=== INITIAL_MATCHES USAGE ===")
for i, line in enumerate(lines, 1):
    if 'INITIAL_MATCHES' in line:
        print(f"Line {i}: {line.rstrip()}")
