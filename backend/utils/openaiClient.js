import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.TourNexus_API_Key,
});

export default openai;
