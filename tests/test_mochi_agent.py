import pytest
from unittest.mock import MagicMock, patch
from dasai_mochi.agent import MochiAgent

def test_mochi_agent_initialization():
    """Verify MochiAgent initializes ChatOpenAI with DeepSeek configuration"""
    api_key = "sk-placeholder-test-key"
    base_url = "https://api.deepseek.com"
    model_name = "deepseek-v4-flash"

    with patch("dasai_mochi.agent.ChatOpenAI") as mock_chat:
        agent = MochiAgent(api_key=api_key, base_url=base_url, model_name=model_name)
        
        mock_chat.assert_called_once()
        kwargs = mock_chat.call_args.kwargs
        assert kwargs.get("api_key") == api_key or kwargs.get("openai_api_key") == api_key
        assert kwargs.get("base_url") == base_url or kwargs.get("openai_api_base") == base_url
        assert kwargs.get("model") == model_name or kwargs.get("model_name") == model_name

def test_mochi_agent_chat_response():
    """Verify MochiAgent generates response using LangChain ChatOpenAI"""
    with patch("dasai_mochi.agent.ChatOpenAI") as mock_chat:
        mock_llm_instance = MagicMock()
        mock_response = MagicMock()
        mock_response.content = "Halo! Aku Mochi, robot Tamagotchi lucumu!"
        mock_llm_instance.invoke.return_value = mock_response
        mock_chat.return_value = mock_llm_instance

        agent = MochiAgent(api_key="sk-placeholder-test-key", base_url="https://api.deepseek.com", model_name="deepseek-v4-flash")
        reply = agent.chat("Halo Mochi, kamu siapa?")

        assert reply == "Halo! Aku Mochi, robot Tamagotchi lucumu!"
