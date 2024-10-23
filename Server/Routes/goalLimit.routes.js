import express from "express"
import {
  addGoalLimit,
  getAllGoalLimits,
  updateGoalLimit,
  deleteGoalLimit,
} from "../Controllers/goalLimit.controller.js"
import { isAuthenticated } from "../Middlewares/auth.js" // Middleware para garantir que o usuário esteja autenticado

const router = express.Router()

// Rota para adicionar meta e limite
router.post("/goals-limits", isAuthenticated, addGoalLimit)

// Rota para listar todas as metas e limites
router.get("/goals-limits", isAuthenticated, getAllGoalLimits)

// Rota para editar meta e limite
router.put("/goals-limits/:id", isAuthenticated, updateGoalLimit)

// Rota para excluir meta e limite
router.delete("/goals-limits/:id", isAuthenticated, deleteGoalLimit)

export default router
