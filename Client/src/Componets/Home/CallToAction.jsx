import { Link } from "react-router-dom"

const CallToAction = () => {
  return (
    <div className="bg-green-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-green-800 mb-6">Comece Hoje</h2>
        <p className="text-lg text-green-700 mb-6">
          Junte-se a milhares de usuários que estão gerenciando melhor suas
          despesas com o Rastreador de Despesas.
        </p>
        <Link to="/signup">
          <button className="bg-green-800 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-green-700">
            Inscreva-se Agora
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CallToAction
