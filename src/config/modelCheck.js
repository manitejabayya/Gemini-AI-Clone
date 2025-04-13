import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCF_PbDn7DN4-hzZFxTL7T2oZwKJ-_RBN0"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// This function will list available models
const checkAvailableModels = async () => {
  try {
    // Note: This functionality may not be available in the JS SDK
    // If it's not working, you'll need to make a direct API call
    
    // For now, let's try some common models
    const modelNames = [
      "gemini-pro",
      "gemini-pro-vision", 
      "gemini-1.0-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash"
    ];
    
    console.log("Checking available models...");
    
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const testPrompt = "Hello, can you respond to confirm this model is working?";
        
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: testPrompt }] }],
        });
        
        console.log(`✅ Model ${modelName} is available and working`);
      } catch (error) {
        console.log(`❌ Model ${modelName} error: ${error.message}`);
      }
    }
    
    return "Model check complete. See console for results.";
  } catch (error) {
    console.error("Error checking models:", error);
    return "Error checking models. See console for details.";
  }
};

export default checkAvailableModels;