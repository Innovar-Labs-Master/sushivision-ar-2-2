
import { GoogleGenAI, Type } from "@google/genai";
import { CustomDish, ChefAnalysis, StaffGuide, CuisineConfig } from '../types';

// Helper function to get AI client with API key
const getAIClient = (apiKey: string | undefined) => {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!key) {
    throw new Error('API key is required. Please set it in Developer Settings or as VITE_GEMINI_API_KEY environment variable.');
  }
  return new GoogleGenAI({ apiKey: key });
};

const formatIngredients = (dish: CustomDish) => {
  return [
    dish.base?.name,
    ...dish.proteins.map(p => p.name),
    ...dish.vegetables.map(v => v.name),
    ...dish.toppings.map(t => t.name),
    dish.sauce?.name
  ].filter(Boolean).join(', ');
};

export const generateDishVisualization = async (dish: CustomDish, cuisine: CuisineConfig, apiKey?: string): Promise<string | null> => {
  if (!apiKey && !import.meta.env.VITE_GEMINI_API_KEY) return null;
  
  const ai = getAIClient(apiKey);

  const prompt = `A cinematic, ultra-realistic food photography shot of a custom ${cuisine.name} dish from a high-end restaurant called "${cuisine.label}".
  The order is: ${dish.portionSize}.
  Ingredients: ${formatIngredients(dish)}. 
  
  Visual Style:
  - Plated beautifully on a ceramic plate suitable for ${cuisine.name}.
  - The angle should be approximately 45 degrees looking down, perfect for AR overlay.
  - Isolated enough to look good on a table, but with realistic lighting and shadows.
  - 4k resolution, appetizing, highly detailed texture.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Error generating image:", error);
    if (error?.message?.includes('API key') || error?.message?.includes('Unauthorized')) {
      throw new Error('Invalid or missing API key. Please check your API key in Developer Settings.');
    }
    throw error;
  }
};

export const generateDishAnalysis = async (dish: CustomDish, cuisine: CuisineConfig, apiKey?: string): Promise<ChefAnalysis | null> => {
   if (!apiKey && !import.meta.env.VITE_GEMINI_API_KEY) return null;
   
   const ai = getAIClient(apiKey);

  const prompt = `You are a world-class Executive Chef at "${cuisine.label}".
  A customer has created a custom ${cuisine.name} with: ${formatIngredients(dish)}.
  Portion: ${dish.portionSize}.
  
  1. Create a creative name for this dish.
  2. Write a short, appetizing description (max 2 sentences).
  3. Suggest a specific drink pairing.
  4. Estimate calories.
  5. Estimate a price in USD (number only).
  
  Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            pairing: { type: Type.STRING },
            caloriesEstimate: { type: Type.STRING },
            priceEstimate: { type: Type.NUMBER }
          },
          required: ['name', 'description', 'pairing', 'caloriesEstimate', 'priceEstimate']
        }
      }
    });

    if (response.text) return JSON.parse(response.text) as ChefAnalysis;
    return null;
  } catch (error: any) {
    console.error("Error generating text:", error);
    if (error?.message?.includes('API key') || error?.message?.includes('Unauthorized')) {
      throw new Error('Invalid or missing API key. Please check your API key in Developer Settings.');
    }
    throw error;
  }
};

export const generateStaffTraining = async (dish: CustomDish, cuisine: CuisineConfig, apiKey?: string): Promise<StaffGuide | null> => {
  if (!apiKey && !import.meta.env.VITE_GEMINI_API_KEY) return null;
  
  const ai = getAIClient(apiKey);

  const prompt = `Create a Staff Training Guide for a junior chef to assemble this custom ${cuisine.name}.
  Ingredients: ${formatIngredients(dish)}.
  
  Provide:
  1. Difficulty level (Easy, Medium, Hard, Expert).
  2. Estimated Prep Time.
  3. 4-6 concise, ordered assembly steps.
  4. 2 important food safety or presentation tips.
  
  Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard', 'Expert'] },
            prepTime: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['difficulty', 'prepTime', 'steps', 'safetyTips']
        }
      }
    });

    if (response.text) return JSON.parse(response.text) as StaffGuide;
    return null;
  } catch (error: any) {
    console.error("Error generating training guide:", error);
    if (error?.message?.includes('API key') || error?.message?.includes('Unauthorized')) {
      throw new Error('Invalid or missing API key. Please check your API key in Developer Settings.');
    }
    throw error;
  }
};
