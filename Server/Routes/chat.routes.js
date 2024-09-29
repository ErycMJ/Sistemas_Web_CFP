// Routes/chatRoutes.js
import express from "express"
import chatController from "../Controllers/chat.controller.js" // Não esqueça da extensão .js no final

const router = express.Router()
router.post("/", chatController.sendMessageToAI)

export default router
