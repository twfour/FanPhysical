#!/usr/bin/env python3
from pathlib import Path
from PIL import Image

SOURCE = Path('/private/tmp/autumn9-pages')
OUT = Path(__file__).resolve().parents[1] / 'assets/problem-images/autumn-lesson9'
OUT.mkdir(parents=True, exist_ok=True)

CROPS = {
    'course-01-plate-holes': (1, (1010, 150, 1460, 720)),
    'course-02-crt': (1, (90, 650, 1450, 1420)),
    'course-03-projectile-energy': (1, (760, 1320, 1450, 2070)),
    'homework-01-liquid-capacitor': (2, (1000, 90, 1460, 510)),
    'homework-02-crt-quadrant': (2, (110, 390, 1440, 900)),
    'homework-03-oscilloscope-waveform': (2, (100, 820, 1440, 1620)),
    'homework-04-ion-deflection': (2, (760, 1560, 1450, 2090)),
    'homework-05-linear-accelerator': (3, (120, 120, 1440, 760)),
    'homework-06-atmosphere-field': (3, (1010, 620, 1450, 1110)),
    'homework-07-effective-gravity-loop': (3, (980, 930, 1450, 1450)),
    'homework-08-electric-circle-energy': (3, (970, 1300, 1450, 1780)),
    'homework-09-crt-multiple': (3, (520, 1620, 1450, 2090)),
    'homework-10-charge-plane': (4, (920, 90, 1460, 650)),
    'homework-11-alternating-field': (4, (650, 500, 1460, 1080)),
    'homework-12-velocity-turn': (4, (940, 900, 1460, 1350)),
    'homework-13-proton-field': (4, (930, 1190, 1460, 1630)),
    'homework-14-rotating-cylinder': (4, (70, 1470, 1460, 2070)),
}

for name, (page, box) in CROPS.items():
    image = Image.open(SOURCE / f'page-{page}.png').crop(box).convert('RGB')
    image.save(OUT / f'{name}.webp', 'WEBP', quality=92, method=6)
    print(name, image.size)
