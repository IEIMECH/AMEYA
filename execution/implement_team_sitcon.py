"""
Execution Script: Implement SITCON Dual-Mode Team Architecture
Directive: directives/team_sitcon_dual_mode.md

This script validates and ensures all components of the SITCON-style team feature are in place:
1. src/data/team.ts with rich division models, spatial explore coordinates, and dossiers.
2. src/components/team/MemberInfoDrawer.tsx & .module.css (Machined sliding dossier drawer).
3. src/components/team/ExploreUniverse.tsx & .module.css (2.5D draggable canvas with floating HUD anchor dock).
4. src/app/team/page.tsx & .module.css (Mode switcher between List and Explore + card clicks).
5. src/app/team/explore/page.tsx (Dedicated standalone explore universe route).
"""

import os
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

required_files = [
    os.path.join(base_dir, "src", "data", "team.ts"),
    os.path.join(base_dir, "src", "components", "team", "MemberInfoDrawer.tsx"),
    os.path.join(base_dir, "src", "components", "team", "MemberInfoDrawer.module.css"),
    os.path.join(base_dir, "src", "components", "team", "ExploreUniverse.tsx"),
    os.path.join(base_dir, "src", "components", "team", "ExploreUniverse.module.css"),
    os.path.join(base_dir, "src", "app", "team", "page.tsx"),
    os.path.join(base_dir, "src", "app", "team", "page.module.css"),
    os.path.join(base_dir, "src", "app", "team", "explore", "page.tsx"),
]

missing = []
for p in required_files:
    if not os.path.exists(p):
        missing.append(p)
    else:
        print(f"[OK] {os.path.relpath(p, base_dir)} exists ({os.path.getsize(p)} bytes)")

if missing:
    print(f"[FAIL] Missing files: {missing}")
    sys.exit(1)
else:
    print("[SUCCESS] All SITCON team dual-mode files validated successfully!")
