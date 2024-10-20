import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="bg-green-200 text-white py-8 mt-8">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0">
          <div className="flex flex-col items-center">
            <Link to="/">
              <h2 className="text-2xl font-bold text-green-800">CFP</h2>
            </Link>
            <span className="text-gray-600 text-xs mt-1">
              <a
                href="https://taylor-teixeira.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                powered by T&T
              </a>
            </span>
          </div>

          <p className="text-md font-normal text-green-800">
            © 2024 Controle Financeiro. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/faqs"
            className="hover:text-green-500 text-green-800 text-xl font-medium"
          >
            FAQs
          </Link>
        </div>
      </div>
    </footer>
  )
}
