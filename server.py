from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentServer
from livekit.agents import AgentSession
from livekit.plugins import deepgram
from livekit.plugins import elevenlabs
from livekit.plugins import openai
from livekit.plugins import silero

from agents.agent import Assistant

load_dotenv(".env.local")

server = AgentServer()


@server.rtc_session(agent_name="morning-pulse-agent")
async def my_agent(ctx: agents.JobContext):
    sst = deepgram.STT(model="nova-3")
    llm = openai.LLM(model="gpt-4.1-mini")
    tts = elevenlabs.TTS(voice_id="CwhRBWXzGAHq8TQ4Fs17")
    vad = silero.VAD.load()
    session = AgentSession(
        stt=sst,
        llm=llm,
        tts=tts,
        vad=vad,
        min_endpointing_delay=0,
        preemptive_generation=True,
    )
    await session.start(room=ctx.room, agent=Assistant())
    await session.say(text="Hello! Thanks for calling. Do you want to hear a joke?")


if __name__ == "__main__":
    agents.cli.run_app(server)
