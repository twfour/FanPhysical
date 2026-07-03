#!/usr/bin/env python3
import argparse
import json
import mimetypes
import os
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
API_URL = os.environ.get("MATHPIX_API_URL", "https://api.mathpix.com/v3/text")
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".tif", ".tiff"}


def load_env_file(path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def encode_multipart(fields, files):
    boundary = "----FanPhysicsMathpixBoundary"
    body = bytearray()

    for name, value in fields.items():
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode("utf-8"))
        body.extend(str(value).encode("utf-8"))
        body.extend(b"\r\n")

    for name, path in files.items():
        filename = path.name
        content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(
            f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'.encode("utf-8")
        )
        body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
        body.extend(path.read_bytes())
        body.extend(b"\r\n")

    body.extend(f"--{boundary}--\r\n".encode("utf-8"))
    return bytes(body), boundary


def mathpix_image_to_text(image_path):
    app_id = os.environ.get("MATHPIX_APP_ID")
    app_key = os.environ.get("MATHPIX_APP_KEY")
    if not app_id or not app_key:
        raise RuntimeError("Missing MATHPIX_APP_ID or MATHPIX_APP_KEY")

    options = {
        "formats": ["text", "data", "html"],
        "data_options": {"include_latex": True, "include_asciimath": True},
        "math_inline_delimiters": ["\\(", "\\)"],
        "rm_spaces": True,
    }
    body, boundary = encode_multipart(
        {"options_json": json.dumps(options, ensure_ascii=False)},
        {"file": image_path},
    )
    request = urllib.request.Request(
        API_URL,
        data=body,
        headers={
            "app_id": app_id,
            "app_key": app_key,
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        result = json.loads(response.read().decode("utf-8"))
    if "error" in result:
        raise RuntimeError(result["error"])
    return result


def iter_images(path):
    if path.is_file():
        return [path]
    return sorted(item for item in path.iterdir() if item.suffix.lower() in IMAGE_EXTENSIONS)


def main():
    parser = argparse.ArgumentParser(description="Use Mathpix to OCR image files into text/LaTeX for FanPhysics.")
    parser.add_argument("input", help="Image file or directory of images")
    parser.add_argument("--out-dir", default="work/ocr", help="Directory for OCR .txt output")
    parser.add_argument("--raw-dir", help="Optional directory for raw Mathpix JSON responses")
    args = parser.parse_args()

    load_env_file(ROOT / ".env")
    input_path = Path(args.input)
    out_dir = Path(args.out_dir)
    raw_dir = Path(args.raw_dir) if args.raw_dir else None
    out_dir.mkdir(parents=True, exist_ok=True)
    if raw_dir:
        raw_dir.mkdir(parents=True, exist_ok=True)

    images = iter_images(input_path)
    if not images:
        raise RuntimeError(f"No image files found: {input_path}")

    for image_path in images:
        result = mathpix_image_to_text(image_path)
        text = result.get("text") or result.get("latex_styled") or ""
        output_path = out_dir / f"{image_path.stem}.txt"
        output_path.write_text(text.strip() + "\n", encoding="utf-8")
        if raw_dir:
            raw_path = raw_dir / f"{image_path.stem}.json"
            raw_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(output_path)


if __name__ == "__main__":
    main()
