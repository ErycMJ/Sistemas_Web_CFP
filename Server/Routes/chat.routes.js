import express from "express"
import chatController from "../Controllers/chat.controller.js"

const router = express.Router()
router.post("/send", chatController.sendMessageToAI)

export default router
