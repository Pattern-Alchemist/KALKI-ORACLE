import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { OracleInputData, OracleResponse } from "../types";

export const generateOracleReading = async (input: OracleInputData): Promise<OracleResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid API Key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Kalki asks: "Where must I go next?"

    Parameters:
    - Current Location: ${input.currentLocation}
    - Inner Weather: ${input.emotionalState}
    - Life Pattern: ${input.lifePattern}
    - Goal: ${input.goalOfMovement}
    - Intuition/Omens: ${input.intuitionPulse}
    - Date: ${new Date().toISOString()}

    Analyze the karmic vectors. Calculate the destiny. Provide a Karmic Weather report. Analyze the synchronicity.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cosmicReading: {
            type: Type.STRING,
            description: "A prophetic, mythic explanation of the energy field around the current moment."
          },
          karmicGrid: {
            type: Type.STRING,
            description: "What karmic patterns are active, unresolved, rising, collapsing, or demanding attention?"
          },
          destinations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "Name of the destination city (Must be one of the known Indian cities)."
                },
                score: {
                  type: Type.NUMBER,
                  description: "0 to 100 alignment score."
                },
                reasoning: {
                  type: Type.STRING,
                  description: "Short mythic reason for this score."
                }
              },
              required: ["name", "score", "reasoning"]
            },
            description: "Top 5 recommended destinations based on calculation."
          },
          universalPush: {
            type: Type.STRING,
            description: "Which city/energy is the Universe pushing Kalki towards?"
          },
          universalPull: {
            type: Type.STRING,
            description: "Which city/energy is pulling Kalki away or resisting?"
          },
          finalDecree: {
            type: Type.STRING,
            description: "One single line: 'Kalki, your next destination is: X — The Gate That Calls You Now.'"
          },
          nextDestination: {
            type: Type.STRING,
            description: "The name of the final chosen destination."
          },
          karmicWeather: {
            type: Type.OBJECT,
            properties: {
              planetaryGateStatus: { type: Type.STRING, description: "Status of cosmic gates e.g. 'Saturn Retrograde - Gate Closing'" },
              energyDensity: { type: Type.NUMBER, description: "0-100 density of spiritual pressure" },
              dominantCelestialBody: { type: Type.STRING, description: "Planet currently ruling the decision" },
              auspiciousTimeWindow: { type: Type.STRING, description: "Best time to move" }
            },
            required: ["planetaryGateStatus", "energyDensity", "dominantCelestialBody", "auspiciousTimeWindow"]
          },
          synchronicityMeaning: {
             type: Type.STRING,
             description: "Interpretation of the user's intuition/omens provided in input."
          }
        },
        required: ["cosmicReading", "karmicGrid", "destinations", "universalPush", "universalPull", "finalDecree", "nextDestination", "karmicWeather", "synchronicityMeaning"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as OracleResponse;
  }
  
  throw new Error("The Oracle remains silent. (No response generated)");
};