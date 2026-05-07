const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function listAllModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

  console.log(`📡 Listing ALL models for key...`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      console.log(`✅ Models found:`, data.models.map(m => m.name).join(", "));
    } else {
      console.log(`❌ List failed: [${response.status}]`, JSON.stringify(data));
    }
  } catch (err) {
    console.log(`❌ Error:`, err.message);
  }
}

listAllModels();
