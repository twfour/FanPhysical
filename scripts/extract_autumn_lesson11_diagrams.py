#!/usr/bin/env python3
"""Extract only the printed figures from the autumn lesson 11 test PDF."""

from pathlib import Path

import pypdfium2 as pdfium


ROOT = Path(__file__).resolve().parents[1]
PDF = Path.home() / "Downloads" / "fan" / "秋季课时11 2026年秋季低年级物理竞赛电场和动量(高考)测试题.pdf"
OUT = ROOT / "assets" / "problem-images" / "autumn-lesson11"

# page, left, top, right, bottom as fractions of the rendered page.
CROPS = {
    1: (1, .28, .14, .64, .25), 2: (1, .69, .37, .91, .45),
    3: (1, .66, .48, .92, .58), 4: (1, .62, .65, .94, .73), 5: (1, .74, .80, .94, .93),
    6: (2, .74, .10, .94, .22), 7: (2, .68, .27, .91, .35), 8: (2, .74, .41, .91, .47),
    9: (2, .68, .59, .91, .68), 10: (2, .50, .78, .93, .91),
    11: (3, .14, .12, .90, .185), 12: (3, .72, .36, .91, .43), 13: (3, .29, .48, .74, .565),
    14: (4, .25, .16, .78, .28), 15: (4, .24, .49, .87, .89),
    16: (5, .69, .13, .90, .24), 17: (5, .70, .56, .90, .72),
    18: (6, .12, .24, .92, .42),
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(str(PDF))
    pages = {}
    for number, (page_number, left, top, right, bottom) in CROPS.items():
        if page_number not in pages:
            pages[page_number] = document[page_number - 1].render(scale=2.6).to_pil().convert("RGB")
        page = pages[page_number]
        width, height = page.size
        crop = page.crop((int(left * width), int(top * height), int(right * width), int(bottom * height)))
        crop.thumbnail((1500, 1000))
        crop.save(OUT / f"question-{number:02d}.webp", "WEBP", quality=88, method=6)
    print(f"Extracted {len(CROPS)} printed figures to {OUT}")


if __name__ == "__main__":
    main()
