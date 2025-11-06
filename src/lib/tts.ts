type SynthesizeOptions = {
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
};

export async function synthesizeItalianMP3(
  text: string,
  opts: SynthesizeOptions = {}
): Promise<Buffer> {
  const key = process.env.GOOGLE_TTS_KEY;
  if (!key) {
    throw new Error("GOOGLE_TTS_KEY não configurada no ambiente");
  }

  const voiceName = opts.voiceName ?? "it-IT-Neural2-A";

  const body = {
    input: { text },
    voice: {
      languageCode: "it-IT",
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: opts.speakingRate ?? 1.0,
      pitch: opts.pitch ?? 0,
    },
  };

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Falha no TTS Google: ${res.status} - ${errText}`);
  }
  const data = (await res.json()) as { audioContent: string };
  return Buffer.from(data.audioContent, "base64");
}