from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dasai_mochi.agent import MochiAgent
from dasai_mochi.stt import SpeechToTextService

app = FastAPI(title="Mochi Voice AI Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy singletons for agent and STT
mochi_agent = MochiAgent()
stt_service = SpeechToTextService(model_size="tiny")

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    prompt: str
    reply: str

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Mochi Voice AI Agent"}

@app.post("/api/chat", response_model=ChatResponse)
def text_chat(request: ChatRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    reply = mochi_agent.chat(request.prompt)
    return ChatResponse(prompt=request.prompt, reply=reply)

@app.post("/api/voice-chat", response_model=ChatResponse)
async def voice_chat(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty")

    transcribed_text = stt_service.transcribe(contents, language="id")
    if not transcribed_text:
        transcribed_text = "Halo Mochi!"

    reply = mochi_agent.chat(transcribed_text)
    return ChatResponse(prompt=transcribed_text, reply=reply)
