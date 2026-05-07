const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function testAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const m = "gemini-2.0-flash-exp";
  console.log(`📡 Testing ${m}...`);
  try {
    const model = genAI.getGenerativeModel({ model: m });
    const result = await model.generateContent("ping");
    console.log(`✅ ${m} WORKS: ${result.response.text()}`);
  } catch (err) {
    console.log(`❌ ${m} FAILS: ${err.message}`);
  }
}

testAI();
