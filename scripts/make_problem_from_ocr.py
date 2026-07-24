#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path


def slugify(value):
    value = re.sub(r"[^0-9A-Za-z\u4e00-\u9fff]+", "_", value.strip())
    value = value.strip("_")
    return value or "problem_draft"


def main():
    parser = argparse.ArgumentParser(description="Create a FanPhysics problem JSON draft from OCR text.")
    parser.add_argument("ocr_text", help="Path to OCR text file")
    parser.add_argument("--id", dest="problem_id", help="Problem id, e.g. motion_001")
    parser.add_argument("--chapter", default="待分类", help="Chapter name")
    parser.add_argument("--title", default="待校对题目", help="Problem title")
    parser.add_argument("--out", help="Output JSON path")
    args = parser.parse_args()

    text_path = Path(args.ocr_text)
    raw_text = text_path.read_text(encoding="utf-8").strip()
    problem_id = args.problem_id or slugify(args.title)
    output_path = Path(args.out) if args.out else Path("data/problems") / f"{problem_id}.json"

    draft = {
        "id": problem_id,
        "chapter": args.chapter,
        "title": args.title,
        "question": raw_text,
        "options": [],
        "answer": "",
        "knowledge": [],
        "steps": [
            {
                "stepId": 1,
                "title": "待补充步骤",
                "content": "请人工校对 OCR 文本后补充分步解析。",
                "knowledge": [],
                "commonMistakes": []
            }
        ],
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(draft, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(output_path)


if __name__ == "__main__":
    main()
