
import { GoogleGenAI, Type } from "@google/genai";
import { Activity, Challenge, Recommendation, AppLanguage } from "../types";
import { LANGUAGE_NAMES } from "./translations";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEcoRecommendations = async (activities: Activity[], district: string, language: AppLanguage = AppLanguage.ENGLISH): Promise<Recommendation[]> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const languageName = LANGUAGE_NAMES[language];

  const prompt = `
    As an AI Sustainability Consultant specialized in Western Uganda (District: ${district}), analyze these user carbon footprint activities:
    ${JSON.stringify(activities)}
    
    Provide 3-5 personalized, actionable sustainability tips. 
    IMPORTANT: Focus on regional solutions like using "Improved Cookstoves" to replace charcoal, solar energy in Western hills, or managing organic waste from matooke or milk production.
    
    MANDATORY: Return all text fields (title, description, category) in the ${languageName} language.
    
    Format the output as a JSON array of objects with 'title', 'description', 'category' (transport/energy/food/shopping), 'difficulty' (easy/medium/hard), and 'potentialSaving' (number in kg CO2/week).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              potentialSaving: { type: Type.NUMBER }
            },
            required: ['title', 'description', 'category', 'difficulty', 'potentialSaving']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Recommendations Error:", error);
    return [];
  }
};

export const generateAIChallenges = async (district: string, language: AppLanguage = AppLanguage.ENGLISH): Promise<Challenge[]> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const languageName = LANGUAGE_NAMES[language];

  const prompt = `
    Act as a Sustainability Gamification Expert. Generate 3 unique, weekly community challenges for users in ${district}, Western Uganda.
    
    The challenges must be:
    1. Regionally specific (e.g., Mentioning Mbarara, Kabale, hills, local markets, or farming).
    2. Actionable within a week.
    3. Include carbon reduction targets.

    MANDATORY: Return all text fields (title, description, category) in the ${languageName} language.
    
    Format the output as a JSON array of objects following this schema:
    - id: string (unique)
    - title: string (catchy, localized)
    - description: string (detailed)
    - participants: number (random realistic number 100-5000)
    - userProgress: 0
    - target: number (kg CO2e to save)
    - daysRemaining: 7
    - category: string (Transport, Energy, Food, or Waste)
    - points: number (reward points 100-1000)
    - image: string (use a descriptive placeholder URL like https://picsum.photos/400/200?random=ID)
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              participants: { type: Type.NUMBER },
              userProgress: { type: Type.NUMBER },
              target: { type: Type.NUMBER },
              daysRemaining: { type: Type.NUMBER },
              category: { type: Type.STRING },
              points: { type: Type.NUMBER },
              image: { type: Type.STRING }
            },
            required: ['id', 'title', 'description', 'target', 'points', 'category']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Challenge Generator Error:", error);
    return [];
  }
};

export const findLocalInitiatives = async (district: string, language: AppLanguage = AppLanguage.ENGLISH) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const languageName = LANGUAGE_NAMES[language];
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Find 5 active sustainability initiatives, recycling centers, or environmental NGOs currently operating in ${district}, Western Uganda. Focus on localized regional impact. Provide the summary text in the ${languageName} language.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const results = chunks.map((chunk: any) => ({
      title: chunk.web?.title || "Sustainability Source",
      uri: chunk.web?.uri || "#",
    })).filter((c: any) => c.uri !== "#");
    return { text: response.text, sources: results };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { text: "Could not find local initiatives at the moment due to a network issue.", sources: [] };
  }
};

export const askEcoExpert = async (question: string, context: string, language: AppLanguage = AppLanguage.ENGLISH): Promise<{text: string, imageUrl?: string}> => {
  const ai = getAI();
  const languageName = LANGUAGE_NAMES[language];

  // If the user asks for an image, use the image generation model
  const isImageRequest = /image|draw|picture|photo|generate|visualize|look like/i.test(question);
  
  if (isImageRequest) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `Create a highly detailed, professional, eco-friendly illustration or photo representing: ${question}. Context: Western Uganda sustainability.` }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      
      let imageUrl = "";
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return { 
        text: `I've generated a visualization for you in ${languageName}.`, 
        imageUrl 
      };
    } catch (err) {
      console.error("Image Gen Error:", err);
    }
  }

  // General text response using Pro model for deep knowledge
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: question,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `
          You are the "Eco-Expert", a world-class AI agent for EcoTrack Uganda, combining the vast knowledge of Gemini and advanced reasoning logic.
          You have deep knowledge of global environmental science and specific expertise in Uganda, especially Western districts like Mbarara, Kabale, and Fort Portal.
          
          APP KNOWLEDGE:
          - EcoTrack helps users track footprints in Transport, Energy, Food, and Shopping.
          - It offers localized challenges and an Academy (videos) for learning.
          - Users earn "Impact Points" for green actions.
          
          TONE & FORMATTING:
          - Your answers must be warm, professional, and encouraging.
          - MANDATORY: Do not use Markdown symbols like #, *, or backticks in your final output. Use plain, beautifully spaced text with clear headings in all caps.
          - Language: ${languageName}.
          - Current App State Context: ${context}.
        `
      }
    });
    return { text: response.text || "I am currently learning more to better assist you." };
  } catch (error) {
    console.error("Ask Expert Network Error:", error);
    return { text: "Sorry, I'm having trouble connecting to my eco-knowledge base right now. Please check your internet connection." };
  }
};
