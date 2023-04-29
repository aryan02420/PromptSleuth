import "dotenv/load.ts";
import { OpenAI } from "OpenAI";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not found in environment");
}

const openAI = new OpenAI(OPENAI_API_KEY);

export default openAI;
