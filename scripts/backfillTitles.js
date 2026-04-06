const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Load .env
require("dotenv").config({ path: path.join(__dirname, "../apps/api/.env") });

const MONGO_URI = process.env.MONGO_URI;

// 🚀 Logic to generate titles (duplicated from runs.service.js for standalone use)
function generateRunTitle(code, runtime) {
  if (!code) return "Empty Run";
  const lines = code.split("\n");
  const skipPatterns = [
    /^\s*#include/, /^\s*import/, /^\s*package/, /^\s*using namespace/,
    /^\s*\/\//, /^\s*\/\*/, /^\s*\*/, /^\s*$/, /^\s*{\s*$/, /^\s*}\s*$/,
    /\*\/\s*$/, 
    /\b(int|void|public static void)\s+main\b/,
    /\b(class|struct|module|namespace)\b/
  ];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && !skipPatterns.some(p => p.test(line))) {
      const outputMatch = line.match(/(?:cout\s*<<\s*|print\s*\(|System\.out\.println\s*\(|console\.log\s*\()(?:"|')([^"']+)(?:"|')/i);
      if (outputMatch && outputMatch[1].trim().length > 3) {
        return outputMatch[1].trim().substring(0, 47) + (outputMatch[1].length > 47 ? "..." : "");
      }
      return trimmed.length > 50 ? trimmed.substring(0, 47) + "..." : trimmed;
    }
  }
  
  for (const line of lines) {
     if (line.trim().length > 0) return line.trim().substring(0, 50);
  }
  return "Untitled Run";
}

// 🚀 Minimal Schema for migration
const RunSchema = new mongoose.Schema({
  title: String,
  files: [{ content: String, path: String }],
  entrypoint: String,
  runtime: String
}, { timestamps: true });

const RunModel = mongoose.model("Run", RunSchema);

async function migrate() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI missing (.env path issue?)");
    process.exit(1);
  }

  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected.");

  const runs = await RunModel.find({ title: { $exists: false } });
  console.log(`📂 Found ${runs.length} runs without titles.`);

  let count = 0;
  for (const run of runs) {
    const mainFile = run.files?.find(f => f.path === run.entrypoint) || run.files?.[0];
    const code = mainFile ? mainFile.content : "";
    const title = generateRunTitle(code, run.runtime);
    
    await RunModel.findByIdAndUpdate(run._id, { title });
    count++;
    if (count % 10 === 0) console.log(`🔄 Processed ${count}...`);
  }

  console.log(`\n✨ DONE! Successfully backfilled ${count} titles.`);
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
