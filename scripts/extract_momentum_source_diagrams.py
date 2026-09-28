#!/usr/bin/env python3
"""Extract printed source diagrams for autumn momentum lessons 1 and 3."""

import subprocess
import tempfile
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path.home() / "Downloads" / "fan"

LESSONS = {
    "momentum-lesson1": {
        "pdf": SOURCE_ROOT / "秋季课时1 动量定理与动量守恒定律.pdf",
        "crops": {
            "course-01-arc-fall.webp": (1, (1060, 285, 1405, 590)),
            "course-02-steel-ball-rebound.webp": (1, (1080, 650, 1415, 825)),
            "course-04-chord-slide.webp": (1, (1060, 975, 1405, 1220)),
            "course-05-basketball-rebound.webp": (1, (1160, 1320, 1400, 1570)),
            "course-06-pendulum-impulse.webp": (1, (990, 1680, 1405, 1990)),
            "course-07-water-jet.webp": (2, (1080, 265, 1405, 520)),
            "course-08-ring-friction.webp": (2, (1040, 600, 1405, 800)),
            "course-09-charged-collision.webp": (2, (1050, 900, 1390, 1085)),
            "course-10-spring-wall.webp": (2, (1030, 1160, 1405, 1350)),
            "course-11-box-slider.webp": (2, (1080, 1450, 1405, 1680)),
            "course-12-cart-track.webp": (2, (1000, 1770, 1415, 2010)),
            "homework-01-river-bend.webp": (3, (1050, 260, 1415, 520)),
            "homework-02-spring-groove.webp": (3, (1060, 620, 1415, 840)),
            "homework-03-force-time.webp": (3, (1080, 885, 1405, 1110)),
            "homework-04-wind-tunnel.webp": (3, (1160, 1190, 1390, 1440)),
            "homework-05-collision-xt.webp": (3, (1080, 1500, 1405, 1740)),
            "homework-06-blocks-cart.webp": (3, (990, 1840, 1405, 2025)),
            "homework-07-hall-thruster.webp": (4, (1000, 230, 1405, 500)),
            "homework-08-pendulum-blocks.webp": (4, (1020, 590, 1405, 900)),
            "homework-09-plank-arc.webp": (4, (930, 1000, 1415, 1340)),
            "homework-10-game-track.webp": (4, (820, 1570, 1415, 2055)),
        },
    },
    "momentum-practice-lesson3": {
        "pdf": SOURCE_ROOT / "秋季课时3 动量守恒定律习题课.pdf",
        "crops": {
            "course-01-football-header.webp": (1, (1030, 180, 1405, 590)),
            "course-02-pressure-washer.webp": (1, (950, 650, 1405, 1000)),
            "course-03-wind-tunnel.webp": (1, (1100, 1030, 1405, 1390)),
            "course-05-moving-bowl.webp": (2, (930, 200, 1405, 540)),
            "course-06-two-planks-slider.webp": (2, (850, 620, 1405, 830)),
            "course-07-possible-pendulum-height.webp": (2, (980, 1040, 1405, 1390)),
            "course-08-wall-ball-chain.webp": (2, (260, 1840, 1120, 2050)),
            "course-09-mobile-curved-tube.webp": (3, (970, 260, 1405, 570)),
            "course-10-gravity-assist.webp": (3, (1000, 700, 1405, 970)),
            "course-11-sticky-carts-spring.webp": (3, (380, 1320, 1130, 1570)),
            "course-12-spring-velocity-graph.webp": (3, (700, 1780, 1405, 2050)),
            "course-13-pendulum-plank-step.webp": (4, (620, 560, 1405, 930)),
            "course-14-bullet-bag-cart.webp": (4, (1050, 1400, 1405, 1690)),
        },
    },
}


def render_pages(pdf_path, workdir):
    workdir.mkdir(parents=True, exist_ok=True)
    prefix = workdir / "page"
    subprocess.run(
        ["pdftoppm", "-jpeg", "-r", "180", str(pdf_path), str(prefix)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return {index: path for index, path in enumerate(sorted(workdir.glob("page-*.jpg")), 1)}


def main():
    total = 0
    with tempfile.TemporaryDirectory(prefix="fanphysics-momentum-diagrams-") as temp:
        temp_root = Path(temp)
        for folder, lesson in LESSONS.items():
            if not lesson["pdf"].exists():
                raise FileNotFoundError(lesson["pdf"])
            pages = render_pages(lesson["pdf"], temp_root / folder)
            output_dir = ROOT / "assets" / "problem-images" / folder
            output_dir.mkdir(parents=True, exist_ok=True)
            for filename, (page_number, box) in lesson["crops"].items():
                with Image.open(pages[page_number]) as page:
                    crop = page.crop(box).convert("RGB")
                    crop.save(output_dir / filename, "WEBP", quality=88, method=6)
                total += 1
    print(f"extracted {total} momentum source diagrams")


if __name__ == "__main__":
    main()
