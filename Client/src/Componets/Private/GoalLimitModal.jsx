import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import string from "../../String"
import { MdEdit } from "react-icons/md"
import moment from "moment" // Biblioteca para manipulação de datas (precisa ser instalada)
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const GoalLimit = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [goalsLimits, setGoalsLimits] = useState([])
  const [formData, setFormData] = useState({})
  const [transactions, setTransactions] = useState([]) // Adicionando transações para comparar
  const [showAddGoalLimitForm, setShowAddGoalLimitForm] = useState(false)
  const [showEditGoalLimitForm, setShowEditGoalLimitForm] = useState(false)
  const [editGoalLimitData, setEditGoalLimitData] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    fetchGoalsLimits()
    fetchTransactions() // Buscar transações
  }, [])


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  // Função para buscar metas e limites do servidor
  const fetchGoalsLimits = async () => {
    try {
      const { data } = await axios.get(`${string}/meta/goals-limits`, {
        withCredentials: true,
      })
      setGoalsLimits(data.goalLimits) // Garantir que o array correto está sendo atribuído
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  // Função para adicionar meta e limite
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

  // Função para editar meta e limite
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

  // Função para detectar cliques fora dos formulários
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
  // Função para buscar transações (ganho/despesa)
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

  // Função para gerar os dados para o gráfico
  const chartData = goalsLimits.map((goalLimit) => {
    // Calcular ganhos e despesas associados às metas e limites
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0)
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0)

    return {
      name: `Meta ${goalLimit.goal} / Limite ${goalLimit.limit}`,
      meta: goalLimit.goal,
      limite: goalLimit.limit,
      ganho: totalIncome,
      despesa: totalExpenses,
    }
  })

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-center mb-5">
          {/* Só mostrar o botão de adicionar meta se não houver metas */}
          {goalsLimits.length === 0 && (
            <button
              onClick={() => setShowAddGoalLimitForm(true)}
              className="bg-green-800 px-5 py-3 rounded-3xl text-white hover:bg-green-700"
            >
              Adicionar Meta e Limite
            </button>
          )}
        </div>

        {/* Formulário para adicionar Meta e Limite */}
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

        {/* Listagem de Metas e Limites */}
        {goalsLimits.length > 0 ? (
          <>
            <span className="text-xl font-bold text-green-800 mb-4">
              Metas e Limites
            </span>
            <div className="bg-green-50 p-4 rounded-lg mb-5 shadow-lg">
              <div className="flex flex-col space-y-2">
                {goalsLimits.map((goalLimit) => (
                  <div
                    key={goalLimit._id}
                    className="flex justify-between items-center p-1 border-b-2 border-r-2 rounded-lg border-green-700"
                  >
                    <span className="text-green-800 text-md font-medium">
                      Meta: {goalLimit.goal} - Limite: {goalLimit.limit}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Última modificação:{" "}
                      {moment(goalLimit.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditButtonClick(goalLimit)}
                        className="text-green-700 hover:text-green-600"
                      >
                        <MdEdit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Gráfico de Barras Comparativo */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Comparação de Metas e Transações
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ganho" stackId="a" fill="#4caf50" />
                  <Bar dataKey="despesa" stackId="a" fill="#ff4c4c" />
                  <Bar dataKey="meta" fill="#82ca9d" />
                  <Bar dataKey="limite" fill="#ffcc00" />
                </BarChart>
              </ResponsiveContainer>
            </div>

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
          </>
        ) : (
          <p className="text-center text-gray-600">
            Nenhuma meta ou limite encontrado.
          </p>
        )}
      </div>
    </>
  )
}

export default GoalLimit 
