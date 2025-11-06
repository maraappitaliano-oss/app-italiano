type SynthesizeOptions = {
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
  volumeGainDb?: number;
};

export async function synthesizeItalianMP3(
  text: string,
  opts: SynthesizeOptions = {}
): Promise<ArrayBuffer> {
  const key = process.env.GOOGLE_TTS_KEY;
  if (!key) {
    throw new Error("GOOGLE_TTS_KEY não configurada no ambiente");
  }

  // Defaults focados em melhor qualidade para italiano
  const voiceName = opts.voiceName ?? "it-IT-Wavenet-C";
  const speakingRate = opts.speakingRate ?? 0.95;
  const pitch = opts.pitch ?? 2.0;
  const volumeGainDb = opts.volumeGainDb ?? 1.5;

  const body = {
    input: { text },
    voice: {
      languageCode: "it-IT",
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate,
      pitch,
      volumeGainDb,
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
  const buf = Buffer.from(data.audioContent, "base64");
  // Converter Buffer -> ArrayBuffer (slice para respeitar offset/length)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}