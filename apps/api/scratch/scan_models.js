const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  console.log("📡 Fetching available models for key...");
  
  try {
    // There isn't a direct listModels in the JS SDK that works easily without auth, 
    // but we can test common ones.
    const common = [
      "gemini-2.0-flash-exp",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-pro"
    ];

    for (const m of common) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("ping");
        console.log(`✅ ${m} is AVAILABLE`);
      } catch (e) {
        console.log(`❌ ${m} is NOT available (${e.message})`);
      }
    }
  } catch (err) {
    console.error("Fatal error:", err.message);
  }
}

listModels();
