import axios from "axios"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import string from "../../String"

// Fetch account summary data (balance, income, expenses)
const fetchAccountSummary = async () => {
  try {
    const { data } = await axios.get(`${string}/transaction/getTransaction`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })

    let balance = 0
    let income = 0
    let expense = 0

    data.transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        balance += transaction.amount
        income += transaction.amount
      } else {
        balance -= transaction.amount
        expense += transaction.amount
      }
    })

    return { balance, income, expense }
  } catch (error) {
    console.error("Error fetching account summary:", error)
    return { balance: 0, income: 0, expense: 0 }
  }
}

const fetchCategories = async () => {
  try {
    const { data } = await axios.get(`${string}/category/getCategory`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    return data
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Fetch recent transactions
const fetchRecentTransactions = async () => {
  try {
    const { data } = await axios.get(
      `${string}/transaction/getRecentTransactions`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    return data.transactions
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    return []
  }
}

// Fetch spending trend data
const fetchSpendingTrendsData = async () => {
  try {
    const { data } = await axios.get(`${string}/transaction/getTransaction`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })

    const trendsData = data.transactions.map((transaction) => ({
      date: new Date(transaction.date).toLocaleDateString("en-US", {
        month: "short",
      }),
      income: transaction.type === "income" ? transaction.amount : 0,
      expenses: transaction.type === "expense" ? transaction.amount : 0,
    }))

    return trendsData
  } catch (error) {
    console.error("Error fetching spending trends data:", error)
    return []
  }
}

const Dashboard = () => {
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [spendingTrends, setSpendingTrends] = useState([])
  const [categoryData, setCategoryData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchAccountSummary()
      setBalance(summary.balance)
      setIncome(summary.income)
      setExpense(summary.expense)

      const transactions = await fetchRecentTransactions()
      setRecentTransactions(transactions)

      const trendsData = await fetchSpendingTrendsData()
      setSpendingTrends(trendsData)

      const categoriesData = await fetchCategories() // Fetch categories
      setCategories(categoriesData)

      // Create category data for pie chart
      const categorySummary = categoriesData.map((category) => {
        const total = transactions
          .filter((transaction) => transaction.category === category._id)
          .reduce((acc, transaction) => acc + transaction.amount, 0)
        return { name: category.categoryName, value: total }
      })
      setCategoryData(categorySummary)
    }

    fetchData()
  }, [])

  // Create a lookup object for category names
  const categoryLookup = categories.reduce((acc, category) => {
    acc[category._id] = category.categoryName
    return acc
  }, {})

  return (
    <div className="p-6 m-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-green-800 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Summary */}
        <div className="p-4 rounded-lg shadow-lg bg-green-100">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
          Resumo da conta
          </h3>
          <div className="flex justify-between mb-2">
            <p className="text-lg">Saldo total:</p>
            <p className="text-lg font-bold text-green-600">${balance}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-lg">Renda total:</p>
            <p className="text-lg font-bold text-green-600">${income}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-lg">Despesas totais:</p>
            <p className="text-lg font-bold text-red-600">${expense}</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-4 rounded-lg shadow-lg bg-green-100">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
          Transações recentes
          </h3>
          <ul>
            {recentTransactions.map((transaction, index) => (
              <li key={index} className="mb-2">
                <p>
                  {new Date(transaction.date).toDateString().slice(4)}:{" "}
                  {transaction.description} - $
                  <span
                    className={
                      transaction.type === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {transaction.amount}
                  </span>{" "}
                  ({categoryLookup[transaction.category] || "Unknown Category"})
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Spending Trends */}
        <div className="p-4 rounded-lg shadow-lg bg-green-100">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
          Tendências de gastos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingTrends}>
              <Line type="monotone" dataKey="expenses" stroke="#ff4c4c" />
              <Line type="monotone" dataKey="income" stroke="#4caf50" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Categories Pie Chart */}
        <div className="p-4 rounded-lg shadow-lg bg-green-100 col-span-1 md:col-span-2">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
          Categorias de despesas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value > 0 ? `hsl(${index * 36}, 100%, 50%)` : "#ccc"
                    }
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart for Income and Expense Comparison */}
        <div className="p-4 rounded-lg shadow-lg bg-green-100 col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
          Receita vs Despesas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#4caf50" />
              <Bar dataKey="expenses" fill="#ff4c4c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
