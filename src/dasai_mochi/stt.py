import tempfile
import os
from faster_whisper import WhisperModel

class SpeechToTextService:
    def __init__(self, model_size: str = "tiny", device: str = "cpu", compute_type: str = "int8"):
        self.model_size = model_size
        self.device = device
        self.compute_type = compute_type
        self.model = WhisperModel(self.model_size, device=self.device, compute_type=self.compute_type)

    def transcribe(self, audio_bytes: bytes, language: str = "id") -> str:
        # Write bytes to temporary audio file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            segments, _ = self.model.transcribe(tmp_path, language=language)
            text_parts = [segment.text for segment in segments]
            return "".join(text_parts).strip()
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
