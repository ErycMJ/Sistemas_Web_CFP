import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Componets/Home/Home"
import SignIn from "./Componets/Auth/SignIn"
import SignUp from "./Componets/Auth/SignUp"
import Navbar from "./Componets/Layout/Navbar"
import { Footer } from "./Componets/Layout/Footer"
import { Toaster } from "react-hot-toast"
import { PrivateRouter } from "./Componets/Private/PrivateRouter"
import { Profile } from "./Componets/Private/Profile"
import SignOut from "./Componets/Auth/SignOut"
import Faqs from "./Componets/Home/Faqs"
import Dashboard from "./Componets/Private/DashBoard"
import { useSelector } from "react-redux"
import Transaction from "./Componets/Private/Transaction"
import Category from "./Componets/Private/Category"
import Sidebar from "./Componets/Layout/Sidebar" // Importando Sidebar
import { useState } from "react"
import ChatModal from "./Componets/Layout/ChatModal" // Importar o ChatModal

const App = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <>
      <BrowserRouter>
        <div className="app-container min-h-screen flex flex-col">
          <Navbar />

          <div className="flex flex-grow">
            {/* Exibe a Sidebar se o usuário estiver logado */}
            {currentUser && <Sidebar />}

            <main
              className={`flex-grow transition-all duration-300 ${
                currentUser ? "ml-16" : ""
              }`}
            >
              <Routes>
                {currentUser ? (
                  <Route path="/dashboard" element={<Dashboard />} />
                ) : (
                  <Route path="/" element={<Home />} />
                )}
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/faqs" element={<Faqs />} />
                <Route element={<PrivateRouter />}>
                  <Route path="/category" element={<Category />} />
                  <Route path="/transaction" element={<Transaction />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/Signout" element={<SignOut />} />
                </Route>
              </Routes>
            </main>
          </div>

          {/* Exibe o Footer apenas se o usuário NÃO estiver logado */}
          {!currentUser && (
            <div className="mt-auto">
              <Footer />
            </div>
          )}

          <Toaster />

          {/* Botão Flutuante de Chat */}
          <button
            className="fixed bottom-4 right-4 bg-green-800 text-white p-3 rounded-full shadow-lg"
            onClick={toggleChat}
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

          {/* Modal de Chat */}
          <ChatModal
            isOpen={isChatOpen}
            onClose={toggleChat}
            isLoggedIn={!!currentUser}
          />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
