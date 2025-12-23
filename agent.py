from dotenv import load_dotenv
from livekit import agents, rtc
from livekit.agents import Agent, AgentServer, AgentSession, room_io
from livekit.plugins import deepgram, elevenlabs, noise_cancellation, openai, silero

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="You are a helpful voice AI assistant that tells funny short jokes."
        )


server = AgentServer()


@server.rtc_session(agent_name="morning-pulse-agent")
async def my_agent(ctx: agents.JobContext):
    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=openai.LLM(model="gpt-4.1-mini"),
        tts=elevenlabs.TTS(model="eleven_turbo_v2_5", voice_id="CwhRBWXzGAHq8TQ4Fs17"),
        vad=silero.VAD.load(),
        min_endpointing_delay=0,
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: noise_cancellation.BVCTelephony()
                if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                else noise_cancellation.BVC(),
            ),
        ),
    )

    await session.generate_reply(instructions="Greet the user and offer your assistance.")


if __name__ == "__main__":
    agents.cli.run_app(server)
