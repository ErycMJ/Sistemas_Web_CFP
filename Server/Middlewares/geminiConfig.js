import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = 'AIzaSyCF_PiEXNeULRC9cJmy10MXFrsgjS_gwCs'

const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
}

export { model, generationConfig }
