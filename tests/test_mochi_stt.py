import pytest
from unittest.mock import MagicMock, patch
from dasai_mochi.stt import SpeechToTextService

def test_stt_initialization():
    """Verify SpeechToTextService initializes WhisperModel with tiny/base model"""
    with patch("dasai_mochi.stt.WhisperModel") as mock_whisper:
        stt = SpeechToTextService(model_size="tiny")
        mock_whisper.assert_called_once_with("tiny", device="cpu", compute_type="int8")

def test_stt_transcribe_audio():
    """Verify transcribe method returns text transcribed from audio input"""
    with patch("dasai_mochi.stt.WhisperModel") as mock_whisper:
        mock_model = MagicMock()
        mock_segment = MagicMock()
        mock_segment.text = " Halo Mochi, opo kabare?"
        mock_model.transcribe.return_value = ([mock_segment], None)
        mock_whisper.return_value = mock_model

        stt = SpeechToTextService(model_size="tiny")
        result_text = stt.transcribe(b"fake_audio_bytes")

        assert "Halo Mochi" in result_text
