from assistants.agent import Assistant
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentServer
from livekit.agents import AgentSession
from livekit.plugins import deepgram
from livekit.plugins import elevenlabs
from livekit.plugins import openai

server = AgentServer()


@server.rtc_session(agent_name="morning-pulse-agent")
async def morning_pulse_agent(ctx: agents.JobContext):
    sst = deepgram.STT(model="nova-3")
    llm = openai.LLM.with_cerebras(model="llama-3.3-70b")
    tts = elevenlabs.TTS(voice_id="CwhRBWXzGAHq8TQ4Fs17")
    session = AgentSession(
        stt=sst,
        llm=llm,
        tts=tts,
        min_endpointing_delay=0,
        preemptive_generation=True,
    )
    await session.start(room=ctx.room, agent=Assistant())
    await session.say(text="Hello. Time to wake")
    await session.aclose()


if __name__ == "__main__":
    agents.cli.run_app(server)
