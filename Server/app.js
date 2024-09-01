import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import userRoutes from "./Routes/user.route.js"
import categoryRoutes from "./Routes/category.route.js"
import transactionRoutes from "./Routes/transaction.route.js"
import { errorMiddleware } from "./Middlewares/error.js"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
dotenv.config()

app.use(
  cors({
    origin: ["*", "http://localhost:5173", "https://pinvent-app.vercel.app"], // Permitir solicitações de qualquer origem (em desenvolvimento)
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true, // Permitir o envio de cookies de autenticação (se aplicável)
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/user", userRoutes)
app.use("/category", categoryRoutes)
app.use("/transaction", transactionRoutes)


mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "Expense_Tracker",
  })
  .then(() => {
    console.log("Connected to Database")
  })
  .catch((err) => {
    console.log(`Some error occured while connecting to database: ${err}`)
  })
app.use(errorMiddleware)
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

export default app
