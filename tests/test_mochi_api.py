import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from dasai_mochi.api import app

client = TestClient(app)

def test_api_health_check():
    """Verify API health endpoint returns ok"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "Mochi Voice AI Agent"}

@patch("dasai_mochi.api.mochi_agent.chat")
def test_api_text_chat(mock_chat):
    """Verify /api/chat endpoint accepts text prompt and returns LLM reply"""
    mock_chat.return_value = "Aku Mochi! Senang bertemu denganmu mas mufid!"
    
    response = client.post("/api/chat", json={"prompt": "Halo Mochi!"})
    assert response.status_code == 200
    data = response.json()
    assert data["reply"] == "Aku Mochi! Senang bertemu denganmu mas mufid!"
    assert data["prompt"] == "Halo Mochi!"

@patch("dasai_mochi.api.stt_service.transcribe")
@patch("dasai_mochi.api.mochi_agent.chat")
def test_api_voice_chat(mock_chat, mock_transcribe):
    """Verify /api/voice-chat accepts audio upload, transcribes STT, and returns LLM reply"""
    mock_transcribe.return_value = "Halo Mochi, kamu lagi apa?"
    mock_chat.return_value = "Aku lagi nungguin mas mufid!"

    fake_audio_content = b"RIFF....WAVEfmt ...."
    files = {"file": ("test.wav", fake_audio_content, "audio/wav")}

    response = client.post("/api/voice-chat", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["prompt"] == "Halo Mochi, kamu lagi apa?"
    assert data["reply"] == "Aku lagi nungguin mas mufid!"
