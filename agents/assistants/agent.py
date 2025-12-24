import logging

from livekit.agents import Agent
from livekit.agents import ChatContext
from livekit.agents import ChatMessage

from assistants.memory import Memory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions="You are a voice AI assistant that tells dad jokes.")

    async def on_user_turn_completed(self, turn_ctx: ChatContext, new_message: ChatMessage) -> None:
        logger.info(f"Adding user message to Mem0: {new_message.text_content} {turn_ctx.user_id}")
        await Memory.add_user_memory(new_message.text_content)
