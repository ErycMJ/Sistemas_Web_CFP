const Testimonials = () => {
  return (
    <div className="bg-green-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-green-800 mb-10">
          O Que Nossos Usuários Dizem
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="bg-green-100 shadow-md rounded-lg p-6 w-full md:w-1/3">
            <p className="text-green-700">
              O Rastreador de Despesas mudou a forma como gerencio minhas
              finanças. É simples e eficaz!
            </p>
            <p className="text-green-800 mt-4 font-semibold">- John Doe</p>
            <img
              src="/review.jpg"
              alt="John Doe"
              className="text-green-800 mt-4 rounded-full mx-auto h-12 w-12"
            />
          </div>
          <div className="bg-green-100 shadow-md rounded-lg p-6 w-full md:w-1/3">
            <p className="text-green-700">
              Adoro como posso definir orçamentos e acompanhar meus gastos.
              Recomendo muito!
            </p>
            <p className="text-green-800 mt-4 font-semibold">- Jane Smith</p>
            <img
              src="/review.jpg"
              alt="Jane Smith"
              className="text-green-800 mt-4 rounded-full mx-auto h-12 w-12"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
