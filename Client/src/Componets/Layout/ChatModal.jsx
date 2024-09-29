const ChatModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-80">
        <h2 className="text-lg font-bold">Chat</h2>
        <div className="mt-4">
          <p>Selecione uma opção:</p>
          <button className="block mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Chat de Suporte
          </button>
          {user && (
            <button className="block mt-2 bg-green-500 text-white px-4 py-2 rounded">
              Chat com IA
            </button>
          )}
        </div>
        <button onClick={onClose} className="mt-4 text-red-500">
          Fechar
        </button>
      </div>
    </div>
  )
}

export default ChatModal
