import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";
import checkAvailableModels from "../config/modelCheck";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [modelStatus, setModelStatus] = useState("Checking available models...");

  // Run model check on component mount
  useEffect(() => {
    const runModelCheck = async () => {
      try {
        const status = await checkAvailableModels();
        setModelStatus(status);
      } catch (error) {
        console.error("Model check failed:", error);
        setModelStatus("Model check failed. See console for details.");
      }
    };
    
    runModelCheck();
  }, []);

  const onSent = async () => {
    if (input.trim() === "") return;
    
    setLoading(true);
    setRecentPrompt(input);
    
    try {
      // Save the current input to previous prompts
      setPrevPrompts((prev) => [...prev, input]);
      
      // Clear input field after saving
      const currentInput = input;
      setInput("");
      
      // Call the Gemini API
      const response = await runChat(currentInput);
      
      // Update the result
      setResultData(response);
      setShowResult(true);
    } catch (error) {
      console.error("Error processing request:", error);
      setResultData(`Sorry, there was an error: ${error.message}. Please check the console for more details.`);
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    setShowResult,
    loading,
    resultData,
    input,
    setInput,
    modelStatus
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;