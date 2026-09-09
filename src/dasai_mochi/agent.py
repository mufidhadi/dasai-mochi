import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEFAULT_MODEL_NAME = "deepseek-v4-flash"

SYSTEM_PROMPT = (
    "Kamu adalah Mochi, robot Tamagotchi digital virtual yang lucu, menggemaskan, dan ceria. "
    "Kamu mengobrol dengan Mas Mufid dalam Bahasa Indonesia yang santai, bersahabat, dan hangat. "
    "Jawablah selalu secara singkat (1 sampai 3 kalimat) dengan penuh keceriaan."
)

class MochiAgent:
    def __init__(
        self, 
        api_key: str | None = None, 
        base_url: str | None = None, 
        model_name: str | None = None
    ):
        key = api_key or os.getenv("DEEPSEEK_API_KEY") or "sk-placeholder-deepseek-key"
        url = base_url or os.getenv("DEEPSEEK_BASE_URL", DEFAULT_DEEPSEEK_BASE_URL)
        model = model_name or os.getenv("DEEPSEEK_MODEL", DEFAULT_MODEL_NAME)

        self.llm = ChatOpenAI(
            api_key=key,
            base_url=url,
            model=model,
            temperature=0.7,
        )

    def chat(self, prompt: str) -> str:
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=prompt),
        ]
        response = self.llm.invoke(messages)
        return str(response.content).strip()
