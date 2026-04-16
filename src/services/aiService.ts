import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const aiService = {
  // Chat
  async chat(messages: { role: 'user' | 'model', text: string }[], model: string = 'gemini-3-flash-preview') {
    const response = await ai.models.generateContent({
      model,
      contents: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    });
    return response.text;
  },

  // Thinking
  async think(prompt: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });
    return response.text;
  },

  // Image Generation
  async generateImage(prompt: string, size: '1K' | '2K' | '4K', aspectRatio: string, quality: 'standard' | 'studio' = 'standard') {
    const model = quality === 'studio' ? 'gemini-3-pro-image-preview' : 'gemini-3.1-flash-image-preview';
    const response = await ai.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio,
      },
    });
    return response.generatedImages[0].image.imageBytes;
  },

  // Video Generation
  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16') {
    const response = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        aspectRatio,
      },
    });
    return (response as any).generatedVideos[0].video.videoBytes;
  },

  // Audio Transcription
  async transcribeAudio(audioBytes: Uint8Array) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: Buffer.from(audioBytes).toString('base64'),
          },
        },
        { text: 'Transcribe this audio.' },
      ],
    });
    return response.text;
  },

  // Image/Video Analysis
  async analyzeMedia(mediaBytes: Uint8Array, mimeType: string, prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        {
          inlineData: {
            mimeType,
            data: Buffer.from(mediaBytes).toString('base64'),
          },
        },
        { text: prompt },
      ],
    });
    return response.text;
  },
  
  // Search Grounding
  async search(prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text;
  },
  
  // Maps Grounding
  async mapSearch(prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    return response.text;
  }
};
