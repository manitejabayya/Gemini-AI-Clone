import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCF_PbDn7DN4-hzZFxTL7T2oZwKJ-_RBN0"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

// Simple delay function for handling rate limits
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const runChat = async (prompt) => {
  try {
    // Try gemini-1.5-flash first since it has higher rate limits
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      return response.text();
    } catch (primaryError) {
      console.log("Primary model failed, trying fallback model...");
      
      // If we got rate limited (429), add a short delay before retry
      if (primaryError.message && primaryError.message.includes("429")) {
        console.log("Rate limit hit, waiting before retry...");
        await delay(2000); // Wait 2 seconds
      }
      
      // Use gemini-1.5-pro as fallback 
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const result = await fallbackModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      return response.text();
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw error;
  }
};

export default runChat;