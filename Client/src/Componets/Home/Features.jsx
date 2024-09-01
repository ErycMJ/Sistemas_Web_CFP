const Features = () => {
  return (
    <div className="py-20 bg-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-green-800 mb-10 text-center">
          Nossas Funcionalidades
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src="/OIG5.jpeg"
            alt="Imagem da Funcionalidade"
            className="rounded-full w-full md:w-1/3"
          />
          <div className="w-full md:w-2/3 text-left">
            <h3 className="text-3xl font-semibold text-green-800 mb-4">
              Mantenha o controle do seu dinheiro em um só lugar
            </h3>
            <p className="text-lg text-green-700">
              Conecte suas contas de mais de 17.000 instituições financeiras e
              visualize suas transações conectadas em um só lugar.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 mt-16">
          <div className="w-full md:w-2/3 text-left">
            <h3 className="text-3xl font-semibold text-green-800 mb-4">
              Defina Orçamentos e Alcance Metas
            </h3>
            <p className="text-lg text-green-700">
              Defina orçamentos mensais e acompanhe seus gastos para garantir
              que você se mantenha no caminho certo com suas metas financeiras.
            </p>
          </div>
          <img
            src="/OIG4.jpeg"
            alt="Imagem da Funcionalidade"
            className="rounded-full w-full md:w-1/3"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8 mt-16">
          <img
            src="OIG6.jpeg"
            alt="Imagem da Funcionalidade"
            className="rounded-full w-full md:w-1/3"
          />
          <div className="w-full md:w-2/3 text-left">
            <h3 className="text-3xl font-semibold text-green-800 mb-4">
              Analise Seus Gastos
            </h3>
            <p className="text-lg text-green-700">
              Obtenha insights sobre seus padrões de gastos com relatórios
              detalhados e gráficos visuais para tomar decisões financeiras
              informadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
