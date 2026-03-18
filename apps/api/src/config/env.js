const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(8080),
  MONGO_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  WEB_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  JWT_SECRET: z.string().min(12).default("flux_super_secret_liquid_key_2026"),
  JWT_EXPIRES_IN: z.string().default("7d")
});

const env = EnvSchema.parse(process.env);

module.exports = { env };

