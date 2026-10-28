#!/usr/bin/env python3
from pathlib import Path
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[1]
PDF = Path.home() / "Downloads" / "fan" / "秋季课时7+8 电势差与等势面.pdf"
OUT = ROOT / "assets" / "problem-images" / "electric-potential-lesson78"

CROPS = {
    "course-02-oil-drop.webp": (1, (780, 340, 1040, 590)),
    "course-03-dipole-points.webp": (1, (720, 560, 1040, 900)),
    "course-04-electron-vt.webp": (1, (680, 880, 1040, 1130)),
    "course-05-electron-trajectory.webp": (1, (720, 1050, 1040, 1300)),
    "course-06-point-charge-line.webp": (1, (690, 1320, 1040, 1600)),
    "course-07-orbit-equipotential.webp": (2, (760, 80, 1060, 360)),
    "course-08-curved-equipotential.webp": (2, (740, 360, 1040, 640)),
    "course-09-parallel-plates.webp": (2, (800, 600, 1040, 850)),
    "course-10-equal-potential-planes.webp": (2, (810, 800, 1040, 1080)),
    "course-11-coordinate-potential.webp": (2, (830, 1050, 1040, 1330)),
    "course-12-two-charge-potential.webp": (2, (730, 1280, 1040, 1620)),
    "homework-02-rough-plane.webp": (3, (760, 400, 1040, 650)),
    "homework-03-cell-membrane.webp": (3, (680, 680, 1040, 950)),
    "homework-04-potential-landscape.webp": (3, (680, 940, 1040, 1260)),
    "homework-05-lightning-field.webp": (3, (610, 1280, 1040, 1600)),
    "homework-06-two-charge-curve.webp": (4, (720, 80, 1040, 410)),
    "homework-07-lightning-equipotential.webp": (4, (680, 400, 1040, 700)),
    "homework-08-electric-pendulum.webp": (4, (740, 640, 1040, 980)),
    "homework-09-hydrogen-atom.webp": (4, (760, 960, 1040, 1300)),
    "homework-10-grid-field.webp": (4, (720, 1280, 1040, 1640)),
}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(str(PDF))
    pages = {}
    for name, (page_number, box) in CROPS.items():
        if page_number not in pages:
            pages[page_number] = document[page_number - 1].render(scale=2).to_pil().convert("RGB")
        pages[page_number].crop(box).save(OUT / name, "WEBP", quality=90, method=6)
    print(f"extracted {len(CROPS)} electric-potential diagrams")

if __name__ == "__main__":
    main()
