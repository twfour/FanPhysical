#!/usr/bin/env python3
import argparse
import sys
import tempfile
from pathlib import Path


def flatten_ocr_result(result):
    lines = []

    def walk(value):
        if value is None:
            return
        if isinstance(value, dict):
            for key in ("rec_text", "text", "transcription"):
                if isinstance(value.get(key), str):
                    lines.append(value[key])
                    return
            for item in value.values():
                walk(item)
            return
        if isinstance(value, (list, tuple)):
            if len(value) >= 2 and isinstance(value[1], (list, tuple)) and value[1]:
                text = value[1][0]
                if isinstance(text, str):
                    lines.append(text)
                    return
            for item in value:
                walk(item)

    walk(result)
    return "\n".join(line.strip() for line in lines if line and line.strip())


def run_paddleocr(image_path, lang, ocr_version):
    try:
        from paddleocr import PaddleOCR
    except ImportError as error:
        raise RuntimeError(
            "PaddleOCR is not installed. Install it first, for example:\n"
            "python3 -m pip install paddleocr paddlepaddle"
        ) from error

    try:
        ocr = PaddleOCR(
            lang=lang,
            ocr_version=ocr_version,
            use_doc_orientation_classify=False,
            use_doc_unwarping=False,
            use_textline_orientation=True,
        )
    except TypeError:
        ocr = PaddleOCR(lang=lang, ocr_version=ocr_version)

    if hasattr(ocr, "ocr"):
        try:
            return ocr.ocr(str(image_path), cls=True)
        except TypeError:
            return ocr.ocr(str(image_path))
    if hasattr(ocr, "predict"):
        return ocr.predict(str(image_path))
    raise RuntimeError("Unsupported PaddleOCR API: expected .ocr() or .predict()")


def prepare_image(image_path, max_side):
    if not max_side:
        return image_path
    from PIL import Image

    image = Image.open(image_path)
    width, height = image.size
    current_max = max(width, height)
    if current_max <= max_side:
        return image_path
    scale = max_side / float(current_max)
    resized = image.resize((int(width * scale), int(height * scale)), Image.LANCZOS)
    temp_dir = Path(tempfile.mkdtemp(prefix="fanphysical_ocr_"))
    output_path = temp_dir / (image_path.stem + "_resized.jpg")
    if resized.mode not in ("RGB", "L"):
        resized = resized.convert("RGB")
    resized.save(output_path, quality=92)
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Run PaddleOCR on one image and write plain text.")
    parser.add_argument("image", help="Image path")
    parser.add_argument("output", help="Output .txt path")
    parser.add_argument("--lang", default="ch", help="PaddleOCR language, default: ch")
    parser.add_argument("--ocr-version", default="PP-OCRv5", help="PaddleOCR version, default: PP-OCRv5")
    parser.add_argument("--max-side", type=int, default=1800, help="Resize image longest side before OCR, default: 1800")
    args = parser.parse_args()

    image_path = Path(args.image)
    ocr_image_path = prepare_image(image_path, args.max_side)
    output_path = Path(args.output)
    result = run_paddleocr(ocr_image_path, args.lang, args.ocr_version)
    text = flatten_ocr_result(result)
    if not text.strip():
        raise RuntimeError(f"PaddleOCR returned empty text for {image_path}")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(text.strip() + "\n", encoding="utf-8")
    print(output_path)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(error, file=sys.stderr)
        sys.exit(1)
