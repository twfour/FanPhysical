#!/usr/bin/env python3
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path("/Users/apple/Downloads/fan/秋季课时4 电荷守恒定律与库仑定律.pdf")
OUT = ROOT / "assets/problem-images/coulomb-lesson4"
TMP = Path("/private/tmp")

# Coordinates are from 180 dpi page renders. Each crop contains only the printed diagram.
CROPS = {
    "course-02-metal-spheres.webp": (1, (855, 550, 1275, 705)),
    "course-05-cavity-sphere.webp": (1, (890, 1480, 1285, 1785)),
    "course-06-double-pendulum.webp": (2, (1130, 215, 1340, 505)),
    "course-07-three-charge-balance.webp": (2, (850, 610, 1260, 715)),
    "course-08-box-two-charges.webp": (2, (1030, 845, 1235, 1100)),
    "course-09-incline-three-balls.webp": (2, (890, 1280, 1275, 1485)),
    "course-10-wall-floor-balls.webp": (2, (995, 1650, 1250, 1915)),
    "homework-a2-hanging-charge.webp": (3, (1030, 450, 1325, 705)),
    "homework-a3-three-charge-line.webp": (3, (865, 810, 1325, 905)),
    "homework-a4-induction-foils.webp": (3, (1025, 1060, 1325, 1295)),
    "homework-a5-incline-floor.webp": (3, (820, 1435, 1250, 1645)),
    "homework-b6-induction-switches.webp": (3, (960, 1715, 1295, 1940)),
    "homework-b7-two-cavity-spheres.webp": (4, (925, 475, 1265, 675)),
    "homework-b8-pulley-charge.webp": (4, (1110, 755, 1310, 1095)),
    "homework-b9-three-stars.webp": (4, (870, 1285, 1280, 1555)),
    "homework-b10-square-strings.webp": (4, (945, 1690, 1280, 2070)),
}

def main():
    if not SOURCE.exists():
        raise SystemExit(f"source not found: {SOURCE}")
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (page, box) in CROPS.items():
        source = TMP / f"autumn4-page-{page}.png"
        if not source.exists():
            raise SystemExit(f"rendered page not found: {source}")
        with Image.open(source) as image:
            crop = image.crop(box)
            crop.save(OUT / name, "WEBP", quality=88, method=6)
    print(f"created {len(CROPS)} diagram crops")

if __name__ == "__main__":
    main()
