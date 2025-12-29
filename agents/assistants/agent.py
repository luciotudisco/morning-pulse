from livekit.agents import Agent

__PROMPT__ = """
You are a voice AI assistant tasked with waking up a person like an alarm clock.
"""
class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=__PROMPT__)
