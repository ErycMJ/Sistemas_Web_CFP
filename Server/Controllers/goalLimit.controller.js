import { GoalLimit } from "../Models/goalLimit.model.js"
import { catchAsyncError } from "../Middlewares/catchAsyncError.js"
import ErrorHandler from "../Middlewares/error.js"

// Função para adicionar meta e limite
export const addGoalLimit = catchAsyncError(async (req, res, next) => {
  const { goal, limit } = req.body
  const createdBy = req.user.id

  // Verifica se os campos obrigatórios foram preenchidos
  if (!goal || !limit) {
    return next(new ErrorHandler("Por favor, preencha todos os campos.", 400))
  }

  // Cria a nova meta e limite no banco de dados
  const newGoalLimit = await GoalLimit.create({
    goal,
    limit,
    createdBy,
  })

  res.status(201).json({
    success: true,
    message: "Meta e Limite adicionados com sucesso",
    goalLimit: newGoalLimit,
  })
})

// Função para listar todas as metas e limites
export const getAllGoalLimits = catchAsyncError(async (req, res, next) => {
  const goalLimits = await GoalLimit.find({ createdBy: req.user.id })

  res.status(200).json({
    success: true,
    goalLimits,
  })
})

// Função para editar meta e limite
export const updateGoalLimit = catchAsyncError(async (req, res, next) => {
  const { goal, limit } = req.body
  const { id } = req.params

  // Verifica se os campos obrigatórios foram preenchidos
  if (!goal || !limit) {
    return next(new ErrorHandler("Por favor, preencha todos os campos.", 400))
  }

  // Verifica se a meta e limite existe
  let goalLimit = await GoalLimit.findById(id)
  if (!goalLimit) {
    return next(new ErrorHandler("Meta ou limite não encontrado.", 404))
  }

  // Atualiza a meta e o limite
  goalLimit = await GoalLimit.findByIdAndUpdate(
    id,
    { goal, limit },
    { new: true, runValidators: true }
  )

  res.status(200).json({
    success: true,
    message: "Meta e Limite atualizados com sucesso",
    goalLimit,
  })
})

// Função para excluir meta e limite
export const deleteGoalLimit = catchAsyncError(async (req, res, next) => {
  const { id } = req.params

  // Verifica se a meta e limite existe
  const goalLimit = await GoalLimit.findById(id)
  if (!goalLimit) {
    return next(new ErrorHandler("Meta ou limite não encontrado.", 404))
  }

  // Exclui a meta e o limite
  await goalLimit.remove()

  res.status(200).json({
    success: true,
    message: "Meta e Limite excluídos com sucesso",
  })
})
