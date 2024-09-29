// controllers/chatController.js
import { model, generationConfig } from "../Middlewares/geminiConfig.js"

const sendMessageToAI = async (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: "Message is required" })
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    })

    const result = await chatSession.sendMessage(message)
    const aiResponse = result.response.text()

    res.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in AI interaction:", error)
    res.status(500).json({ error: "Error in AI interaction" })
  }
}

export default { sendMessageToAI }
