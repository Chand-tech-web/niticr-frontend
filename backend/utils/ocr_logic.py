import easyocr

def extract_text(file_path):
    reader = easyocr.Reader(['en', 'hi'], gpu=False)
    result = reader.readtext(file_path, detail=0)
    return '\n'.join(result)
