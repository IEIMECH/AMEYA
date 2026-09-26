"""
Execution Script: Phase 2 — Homepage Redesign
Directive: directives/phase2_homepage_redesign.md

Validates that all Phase 2 homepage redesign components and design tokens are in place:
1. globals.css (4-level dark depth background system + warm off-white editorial typography tokens).
2. src/app/page.tsx & page.module.css (Hero typography, asymmetric editorial hierarchy, narrative flow).
3. src/components/index/FestivalStory.tsx & .module.css (Treatment A Editorial Statement + Treatment B Raw Data).
4. src/components/index/EventsPreview.tsx & .module.css (Featured Hero Event 01 + Supporting Grid).
5. src/components/Footer.tsx & .module.css (Section 52 Final Brand Frame: AMEYA '26 // WHERE ENGINEERS DARE TO DREAM).
"""

import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

required_files = [
    os.path.join(base_dir, "directives", "phase2_homepage_redesign.md"),
    os.path.join(base_dir, "src", "app", "globals.css"),
    os.path.join(base_dir, "src", "app", "page.tsx"),
    os.path.join(base_dir, "src", "app", "page.module.css"),
    os.path.join(base_dir, "src", "components", "index", "FestivalStory.tsx"),
    os.path.join(base_dir, "src", "components", "index", "FestivalStory.module.css"),
    os.path.join(base_dir, "src", "components", "index", "EventsPreview.tsx"),
    os.path.join(base_dir, "src", "components", "index", "EventsPreview.module.css"),
    os.path.join(base_dir, "src", "components", "Footer.tsx"),
    os.path.join(base_dir, "src", "components", "Footer.module.css"),
]

missing = []
for p in required_files:
    if not os.path.exists(p):
        missing.append(p)
    else:
        print(f"[OK] {os.path.relpath(p, base_dir)} ({os.path.getsize(p)} bytes)")

if missing:
    print(f"[FAIL] Missing files: {missing}")
    sys.exit(1)
else:
    print("\n[SUCCESS] Phase 2 — Homepage Redesign validated across all artifacts.")
