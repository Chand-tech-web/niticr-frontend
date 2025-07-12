from fastapi import FastAPI, File, UploadFile
from fastapi.responses import PlainTextResponse
import shutil
import os

from utils.ocr_logic import extract_text
from utils.cleanup import delete_file

app = FastAPI()

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result_text = extract_text(temp_file)
    finally:
        delete_file(temp_file)

    return PlainTextResponse(result_text)
