import os
import easyocr
import pytesseract
import cv2
from pdf2image import convert_from_path
import pandas as pd
from docx import Document

# Preload OCR reader
reader = easyocr.Reader(['hi', 'en'], gpu=False)

def extract_text(filepath):
    ext = os.path.splitext(filepath)[-1].lower()

    if ext in ['.png', '.jpg', '.jpeg']:
        return image_ocr(filepath)
    elif ext == '.pdf':
        return pdf_ocr(filepath)
    elif ext == '.txt':
        return txt_reader(filepath)
    elif ext in ['.docx']:
        return docx_reader(filepath)
    elif ext in ['.xls', '.xlsx']:
        return excel_reader(filepath)
    else:
        return "Unsupported file format."

def image_ocr(path):
    img = cv2.imread(path)
    config = '--psm 6'
    text_math = pytesseract.image_to_string(img, lang='eng', config=config)
    text_lang = reader.readtext(path, detail=0)
    return "\n".join(text_lang + [text_math])

def pdf_ocr(path):
    pages = convert_from_path(path)
    full_text = ""
    for i, page in enumerate(pages):
        temp_img = f"page_{i}.png"
        page.save(temp_img, 'PNG')
        full_text += image_ocr(temp_img) + "\n"
        os.remove(temp_img)
    return full_text

def txt_reader(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def docx_reader(path):
    doc = Document(path)
    return "\n".join([para.text for para in doc.paragraphs])

def excel_reader(path):
    df = pd.read_excel(path)
    return df.to_string(index=False)
