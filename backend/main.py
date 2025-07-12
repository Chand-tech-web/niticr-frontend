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



# 👇 ये नीचे जरूर जोड़ो!
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Render का PORT env variable
    uvicorn.run("main:app", host="0.0.0.0", port=port)