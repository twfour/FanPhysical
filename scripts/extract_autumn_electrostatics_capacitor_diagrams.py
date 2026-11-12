#!/usr/bin/env python3
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF = Path("/Users/apple/Downloads/fan/秋季课时8+9 静电平衡、电容器.pdf")
OUT = ROOT / "assets/problem-images/autumn-electrostatics-capacitor"

CROPS = {
    "course-01-cavity-shielding": (1, (900, 220, 1170, 445)),
    "course-02-grounded-plate": (1, (965, 420, 1170, 675)),
    "course-03-capacitance-definition": (1, (875, 710, 1170, 915)),
    "course-04-capacitive-sensors": (1, (175, 1125, 1170, 1410)),
    "course-07-rc-discharge": (2, (195, 495, 1120, 780)),
    "homework-02-grounded-sphere": (2, (875, 855, 1165, 1100)),
    "homework-03-induced-vectors": (2, (125, 1190, 1145, 1435)),
    "homework-04-electroscope": (2, (720, 1475, 1165, 1745)),
    "homework-05-oil-switch": (3, (845, 100, 1160, 390)),
    "homework-06-diode": (3, (825, 440, 1160, 690)),
    "homework-07-fingerprint": (3, (780, 750, 1180, 1005)),
    "homework-08-cola-straw": (3, (260, 1000, 1160, 1425)),
    "homework-09-dielectric": (3, (810, 1430, 1185, 1705)),
    "homework-10-insulated-conductor": (4, (820, 45, 1185, 245)),
    "homework-11-dust": (4, (875, 265, 1165, 490)),
    "homework-12-electrometer": (4, (845, 520, 1185, 745)),
    "homework-13-millikan": (4, (650, 790, 1185, 1090)),
    "homework-14-microphone": (4, (770, 1110, 1185, 1385)),
    "homework-15-meltblown": (4, (820, 1320, 1190, 1510)),
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="fanphysics-electrostatics-") as temp:
        prefix = Path(temp) / "page"
        subprocess.run(["pdftoppm", "-png", "-r", "150", str(PDF), str(prefix)], check=True)
        pages = {number: Image.open(Path(temp) / f"page-{number}.png") for number in range(1, 5)}
        for name, (page_number, box) in CROPS.items():
            crop = pages[page_number].crop(box)
            crop.save(OUT / f"{name}.webp", "WEBP", quality=88, method=6)
    print(f"extracted {len(CROPS)} printed diagrams")


if __name__ == "__main__":
    main()
