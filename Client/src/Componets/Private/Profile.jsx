import { useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../../Redux/User/userSlice"
import toast from "react-hot-toast"
import string from "../../String"

export const Profile = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [username, setUsername] = useState(currentUser.user.username)
  const [transactionData, setTransactionData] = useState("") // Estado para dados de transações

  const handleUpdateProfileDetails = async () => {
    try {
      const { data } = await axios.put(
        `${string}/user/updateprofile`,
        { username },
        {
          withCredentials: true,
        }
      )
      dispatch(updateUser(data))
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

 const handleImportTransactions = async () => {
   // Processar os dados colados
   const lines = transactionData.trim().split("\n")
   const transactions = []

   for (const line of lines) {
     const [description, value, date] = line.split("\t") // Usando tabulação como delimitador
     const amount = parseFloat(value.replace("R$", "").replace(",", ".").trim()) // Convertendo para número
     const dateParts = date.trim().split("/") // Dividindo a data em partes (DD/MM/AAAA)
     const parsedDate = new Date(
       `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00`
     ) // Convertendo a data para formato ISO

     // Verificar se os dados estão válidos
     if (!description || isNaN(amount) || isNaN(parsedDate.getTime())) {
       toast.error("Dados inválidos na linha: " + line)
       continue // Ignorar linha inválida
     }

     transactions.push({
       type: "income", // Definido como 'desconhecido'
       category: "66dc68fbc3f858aa58b6465d", // Definido como 'desconhecido'
       note: description.trim(),
       amount,
       currency: "BRL", // Moeda padrão
       date: parsedDate.toISOString(), // Armazenar a data em formato ISO
     })
   }

   // Enviar os dados formatados para o backend
   try {
     const { data } = await axios.post(
       `${string}/transaction/import`,
       { transactions },
       {
         withCredentials: true,
       }
     )
     toast.success(data.message)
     setTransactionData("") // Limpar campo após importação
   } catch (error) {
     toast.error(
       error.response
         ? error.response.data.message
         : "Erro ao importar transações"
     )
   }
 }

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 p-5 bg-green-50 shadow-xl rounded-lg m-10">
        <h2 className="text-3xl font-semibold text-center mb-5 text-green-800">
          Perfil
        </h2>
        <div className="profile-details-update">
          <div className="mb-5">
            <label className="block text-lg font-medium mb-2 text-green-800">
              Nome de usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={handleUpdateProfileDetails}
            className="w-full bg-green-800 text-white py-2 rounded-md mb-3 hover:bg-green-700"
          >
            Atualizar perfil
          </button>
        </div>

        {/* Seção de Importação de Transações */}
        <div className="import-transactions mt-10">
          <h3 className="text-2xl font-semibold text-center mb-5 text-green-800">
            Importar Transações
          </h3>
          <textarea
            value={transactionData}
            onChange={(e) => setTransactionData(e.target.value)}
            rows={10}
            placeholder="Cole os dados aqui como no exemplo asseguir: (Descrição	Valor	Data
Comanda: 78913240	R$ 10,00	13/01/2024
Comanda: 79997072	R$ 10,00	26/01/2024
Comanda: 86102210	R$ 5,00	19/03/2024
Comanda: 89129403	R$ 5,00	15/04/2024)"

            className="w-full border border-gray-300 rounded-md p-2 mb-5"
          />
          <button
            onClick={handleImportTransactions}
            className="w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-700"
          >
            Importar Transações
          </button>
        </div>
      </div>
    </>
  )
}
