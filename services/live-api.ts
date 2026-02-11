
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

/**
 * Manual Base64 decoding as per @google/genai guidelines.
 * No external libraries used to avoid dependency issues in production.
 */
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Manual Base64 encoding as per @google/genai guidelines.
 */
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes raw PCM audio data into an AudioBuffer for browser playback.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Creates a PCM blob from Float32 microphone data.
 */
export function createBlob(data: Float32Array): any {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const setupLiveSession = (
  onTranscript: (text: string, role: 'user' | 'ai') => void,
  onAudioData: (base64: string) => void,
  onInterrupted: () => void,
  onError: (error: any) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let currentInputTranscription = '';
  let currentOutputTranscription = '';

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => {
        console.log('Live session connected.');
      },
      onmessage: async (message: LiveServerMessage) => {
        // Handle transcriptions
        if (message.serverContent?.outputTranscription) {
          currentOutputTranscription += message.serverContent.outputTranscription.text;
          onTranscript(currentOutputTranscription, 'ai');
        } else if (message.serverContent?.inputTranscription) {
          currentInputTranscription += message.serverContent.inputTranscription.text;
          onTranscript(currentInputTranscription, 'user');
        }

        if (message.serverContent?.turnComplete) {
          currentInputTranscription = '';
          currentOutputTranscription = '';
        }

        // Always process audio output
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
          onAudioData(base64Audio);
        }

        // Handle interruption signal
        if (message.serverContent?.interrupted) {
          onInterrupted();
        }
      },
      onerror: (e: any) => {
        console.error('Session Error:', e);
        onError(e);
      },
      onclose: (e: any) => {
        console.log('Session Closed:', e);
      },
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are an Eco-Consultant for EcoTrack Uganda. Provide brief, friendly, and localized advice for sustainability in Uganda. Keep answers under 2 sentences for low latency.',
      outputAudioTranscription: {},
      inputAudioTranscription: {},
    },
  });

  return sessionPromise;
};
