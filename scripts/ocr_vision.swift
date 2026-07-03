#!/usr/bin/env swift
import Foundation
import Vision
import AppKit

if CommandLine.arguments.count < 2 {
    fputs("Usage: ocr_vision.swift image_path [output_path]\n", stderr)
    exit(2)
}

let imagePath = CommandLine.arguments[1]
let outputPath = CommandLine.arguments.count >= 3 ? CommandLine.arguments[2] : nil
let imageURL = URL(fileURLWithPath: imagePath)

guard let image = NSImage(contentsOf: imageURL),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    fputs("Could not open image: \(imagePath)\n", stderr)
    exit(1)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = true
request.recognitionLanguages = ["zh-Hans", "zh-Hant", "en-US"]

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

do {
    try handler.perform([request])
    let lines = (request.results ?? [])
        .compactMap { $0.topCandidates(1).first?.string }
        .filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
    let text = lines.joined(separator: "\n")
    if let outputPath = outputPath {
        try text.write(toFile: outputPath, atomically: true, encoding: .utf8)
    } else {
        print(text)
    }
} catch {
    fputs("OCR failed: \(error)\n", stderr)
    exit(1)
}
