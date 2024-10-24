import { useState } from "react"
import axios from "axios"
import string from "../../String"

const ChatModal = ({ isOpen, onClose, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState("support")
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSendMessage = async () => {
    if (activeTab === "ia" && isLoggedIn) {
      setLoading(true)

      try {
        const response = await axios.post(`${string}/chat/send`, {
          message,
        })

        // Atualiza o histórico de mensagens
        setChatHistory([
          ...chatHistory,
          { user: message, ai: response.data.response },
        ])
        setMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
      } finally {
        setLoading(false)
      }
    } else {
      // Lógica para suporte
      console.log("Enviando mensagem para suporte:", message)
      setMessage("")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Modal */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-80 mb-2">
        <h2 className="text-xl font-bold mb-4">Chat</h2>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "support"
                ? "border-b-2 border-green-600 text-green-600"
                : ""
            }`}
            onClick={() => setActiveTab("support")}
          >
            Suporte
          </button>

          {isLoggedIn && (
            <button
              className={`px-4 py-2 ml-2 ${
                activeTab === "ia"
                  ? "border-b-2 border-green-600 text-green-600"
                  : ""
              }`}
              onClick={() => setActiveTab("ia")}
            >
              Insights
            </button>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === "support" && (
          <div>
            <div className="h-40 overflow-y-auto border p-2 mb-2">
              <div className="text-sm text-gray-600">
                Seja bem-vindo ao suporte! Como podemos ajudar?
              </div>
            </div>

            <input
              type="text"
              placeholder="Escreva sua mensagem..."
              className="w-full border rounded p-2 mb-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-red-600 text-sm mb-2">
              Salvaremos o histórico por 30 dias.
            </p>
            <button
              className="bg-green-600 text-white py-2 px-4 rounded w-full"
              onClick={handleSendMessage}
              disabled={!message || loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        )}

        {activeTab === "ia" && isLoggedIn && (
          <div>
            <div className="h-40 overflow-y-auto border p-2 mb-2">
              {chatHistory.map((chat, index) => (
                <div key={index} className="mb-2">
                  <div className="font-bold text-blue-600">Você:</div>
                  <div>{chat.user}</div>
                  <div className="font-bold text-green-600 mt-2">IA:</div>
                  <div>{chat.ai}</div>
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="Escreva sua pergunta para a IA..."
              className="w-full border rounded p-2 mb-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-red-600 text-sm mb-2">
              Não salvaremos o histórico de mensagens.
            </p>
            <button
              className="bg-green-600 text-white py-2 px-4 rounded w-full "
              onClick={handleSendMessage}
              disabled={!message || loading}
            >
              {loading ? "Enviando..." : "Enviar para IA"}
            </button>
          </div>
        )}
      </div>

      {/* Chat Button */}
      <button
        className="bottom-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M12 3C7.03 3 3 7.03 3 12c0 1.82.5 3.53 1.36 5.01L3 21l3.99-1.36A8.961 8.961 0 0012 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"
          />
        </svg>
      </button>
    </div>
  )
}

export default ChatModal
