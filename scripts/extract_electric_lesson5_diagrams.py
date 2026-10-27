#!/usr/bin/env python3
from pathlib import Path
import pypdfium2 as pdfium

ROOT=Path(__file__).resolve().parents[1]
PDF=Path.home()/"Downloads"/"fan"/"秋季课时5 电场强度与电势能.pdf"
OUT=ROOT/"assets"/"problem-images"/"electric-lesson5"
CROPS={
 "course-02-dipole-field-lines.webp":(1,(595,405,1125,620)),"course-03-ring-three-charges.webp":(1,(755,690,1125,895)),"course-04-charged-pendulum.webp":(1,(790,955,1115,1145)),"course-05-two-ball-strings.webp":(1,(315,1260,1000,1510)),
 "course-06-ring-axis.webp":(2,(775,120,1125,385)),"course-07-charged-hemisphere.webp":(2,(665,430,1125,680)),"course-08-field-line-trajectory.webp":(2,(765,735,1125,980)),"course-10-potential-energy-curve.webp":(2,(745,1160,1125,1425)),
 "homework-01-arc-cut.webp":(3,(570,220,1125,405)),"homework-02-two-charges-field.webp":(3,(850,470,1125,655)),"homework-03-smoke.webp":(3,(540,760,1135,980)),"homework-04-double-pendulum.webp":(3,(185,1060,980,1295)),"homework-05-precipitator.webp":(3,(730,1340,1140,1580)),
 "homework-06-potential-curve.webp":(4,(820,80,1130,300)),"homework-07-image-charge.webp":(4,(730,390,1125,665)),"homework-08-field-lines.webp":(4,(760,700,1140,955)),"homework-09-square-charges.webp":(4,(790,1010,1125,1265)),"homework-10-field-curve.webp":(4,(760,1320,1135,1580))}

def main():
    OUT.mkdir(parents=True,exist_ok=True); doc=pdfium.PdfDocument(str(PDF)); pages={}
    for name,(page_no,box) in CROPS.items():
        if page_no not in pages: pages[page_no]=doc[page_no-1].render(scale=2).to_pil().convert("RGB")
        pages[page_no].crop(box).save(OUT/name,"WEBP",quality=88,method=6)
    print(f"extracted {len(CROPS)} electric-field diagrams")

if __name__=="__main__": main()
