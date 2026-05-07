const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function testRaw() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-pro";
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  console.log(`📡 Testing RAW fetch for ${model} on v1...`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "ping" }] }]
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log(`✅ RAW v1 WORKS!`, JSON.stringify(data).substring(0, 100));
    } else {
      console.log(`❌ RAW v1 FAILS: [${response.status}]`, JSON.stringify(data));
    }
  } catch (err) {
    console.log(`❌ RAW fetch Error:`, err.message);
  }
}

testRaw();
