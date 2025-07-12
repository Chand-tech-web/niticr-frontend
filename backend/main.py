from fastapi import FastAPI, File, UploadFile
from fastapi.responses import PlainTextResponse
import shutil
import os

from utils.ocr_logic import extract_text

app = FastAPI()

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    # Save file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Run OCR
    result_text = extract_text(temp_file_path)

    # Delete file
    os.remove(temp_file_path)

    return PlainTextResponse(result_text)
