from livekit.agents import Agent

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions="You are a voice AI assistant task with woken up a person like an alarm clock.")
