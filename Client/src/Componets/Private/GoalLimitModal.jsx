import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import string from "../../String"
import { MdEdit } from "react-icons/md"
import moment from "moment"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts"

const GoalLimit = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [goalsLimits, setGoalsLimits] = useState([])
  const [formData, setFormData] = useState({})
  const [transactions, setTransactions] = useState([])
  const [showAddGoalLimitForm, setShowAddGoalLimitForm] = useState(false)
  const [showEditGoalLimitForm, setShowEditGoalLimitForm] = useState(false)
  const [editGoalLimitData, setEditGoalLimitData] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    fetchGoalsLimits()
    fetchTransactions()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const fetchGoalsLimits = async () => {
    try {
      const { data } = await axios.get(`${string}/meta/goals-limits`, {
        withCredentials: true,
      })
      setGoalsLimits(data.goalLimits)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleAddGoalLimit = async () => {
    try {
      const { data } = await axios.post(
        `${string}/meta/goals-limits`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      toast.success(data.message)
      fetchGoalsLimits()
      setFormData({})
      setShowAddGoalLimitForm(false)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleEditGoalLimit = async () => {
    try {
      const { data } = await axios.put(
        `${string}/meta/goals-limits/${editGoalLimitData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      toast.success(data.message)
      fetchGoalsLimits()
      setFormData({})
      setEditGoalLimitData(null)
      setShowEditGoalLimitForm(false)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowAddGoalLimitForm(false)
      setShowEditGoalLimitForm(false)
      setFormData({})
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleEditButtonClick = (goalLimit) => {
    setFormData({ goal: goalLimit.goal, limit: goalLimit.limit })
    setEditGoalLimitData(goalLimit)
    setShowEditGoalLimitForm(true)
  }

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(`${string}/transaction/getTransaction`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      setTransactions(data.transactions)
    } catch (error) {
      toast.error("Erro ao buscar transações.")
    }
  }

  const chartData = goalsLimits.map((goalLimit) => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0)
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0)

    return {
      name: `Meta ${goalLimit.goal} / Limite ${goalLimit.limit}`,
      ganho: totalIncome,
      despesa: totalExpenses,
      meta: goalLimit.goal,
      limite: goalLimit.limit,
    }
  })

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-center mb-5">
          {goalsLimits.length === 0 && (
            <button
              onClick={() => setShowAddGoalLimitForm(true)}
              className="bg-green-800 px-5 py-3 rounded-3xl text-white hover:bg-green-700"
            >
              Adicionar Meta e Limite
            </button>
          )}
        </div>

        {showAddGoalLimitForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
              ref={formRef}
              className="bg-white p-6 rounded-lg shadow-lg z-50 mx-auto w-96 max-w-md"
            >
              <h3 className="mb-4 text-xl font-medium text-green-800">
                Adicionar Meta e Limite
              </h3>
              <div className="flex flex-col space-y-4 mb-4">
                <input
                  type="number"
                  id="goal"
                  placeholder="Meta"
                  value={formData.goal || ""}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  id="limit"
                  placeholder="Limite"
                  value={formData.limit || ""}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleAddGoalLimit}
                  className="bg-green-800 px-5 py-3 rounded-3xl text-white hover:bg-green-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {goalsLimits.length > 0 ? (
          <>
            <span className="text-xl font-bold text-green-800 mb-4">
              Metas e Limites
            </span>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-green-800 mb-2">Metas (Ganhos)</h3>
                <div className="flex flex-col space-y-2">
                  {goalsLimits.map((goalLimit) => (
                    <div
                      key={goalLimit._id}
                      className="flex justify-between items-center p-1 border-b-2 border-green-700 rounded-lg"
                    >
                      <span className="text-green-800 text-md font-medium">
                        Meta: {goalLimit.goal}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Modificado:{" "}
                        {moment(goalLimit.updatedAt).format("DD/MM/YYYY")}
                      </span>
                      <button
                        onClick={() => handleEditButtonClick(goalLimit)}
                        className="text-green-700 hover:text-green-600"
                      >
                        <MdEdit className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  Limites (Gastos) 
                </h3>
                <div className="flex flex-col space-y-2">
                  {goalsLimits.map((goalLimit) => (
                    <div
                      key={goalLimit._id}
                      className="flex justify-between items-center p-1 border-b-2 border-green-700 rounded-lg"
                    >
                      <span className="text-green-800 text-md font-medium">
                        Limite: {goalLimit.limit}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Modificado:{" "}
                        {moment(goalLimit.updatedAt).format("DD/MM/YYYY")}
                      </span>
                      <button
                        onClick={() => handleEditButtonClick(goalLimit)}
                        className="text-green-700 hover:text-green-600"
                      >
                        <MdEdit className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Comparação de Metas e Transações
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ganho" fill="#4caf50" />
                  <Bar dataKey="despesa" fill="#f44336" />
                  <Line
                    type="monotone"
                    dataKey="meta"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    name="Meta"
                  />
                  <Line
                    type="monotone"
                    dataKey="limite"
                    stroke="#ff9800"
                    strokeWidth={3}
                    dot={false}
                    name="Limite"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">
            Nenhuma meta ou limite encontrado.
          </p>
        )}

        {/* Formulário para editar Meta e Limite */}
        {showEditGoalLimitForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
              ref={formRef}
              className="bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md"
            >
              <h3 className="mb-4 text-lg font-medium text-green-800">
                Editar Meta e Limite
              </h3>
              <div className="flex flex-col space-y-4 mb-4">
                <input
                  type="number"
                  id="goal"
                  placeholder="Meta"
                  value={formData.goal || ""}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  id="limit"
                  placeholder="Limite"
                  value={formData.limit || ""}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleEditGoalLimit}
                  className="bg-green-800 px-5 py-3 rounded-3xl text-white hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default GoalLimit
