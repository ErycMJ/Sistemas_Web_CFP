import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { CgProfile } from "react-icons/cg"
import { PiUserList } from "react-icons/pi"
import { TbLogout } from "react-icons/tb"
import { FaBell } from 'react-icons/fa'; // Importando o ícone de notificação


const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false)
  const [notifications] = useState(0) // Exemplo com 3 notificações
  const dropdownRef = useRef(null)
  const [greeting, setGreeting] = useState("") // Estado para saudação

  const notificationDropdownRef = useRef(null)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen)
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false)
    }
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target)
    ) {
      setNotificationDropdownOpen(false)
    }
  }

  useEffect(() => {
    // Função para definir a saudação
    const getGreeting = () => {
      const currentHour = new Date().getHours()
      if (currentHour < 12) return "Bom dia"
      if (currentHour < 18) return "Boa tarde"
      return "Boa noite"
    }
    setGreeting(getGreeting())                                
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header
      className={`${currentUser ? "bg-white" : "bg-green-200"} shadow-md py-4`}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div></div>
        {currentUser ? null : (
          <>
            <div className="flex flex-col items-center">
              <Link to="/">
                <h2 className="text-2xl font-bold text-green-800">
                  Controle de Finanças
                </h2>
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
          </>
        )}

        {/* Center Section */}
        {currentUser ? (
          <>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className="text-green-800 text-xl font-medium"
              >
                Bem Vindo ao Controle de Finanças
              </Link>
            </div>
          </>
        ) : null}

        {/* Right Section */}
        <div className="relative flex items-center">
          {currentUser ? (
            <>
              <button
                onClick={toggleDropdown}
                className="flex items-center relative"
              >
                <span className="text-green-800 text-xl mx-3 font-medium hidden sm:block">
                  {greeting}, <i className="text-lg">@</i>
                  {currentUser.user.username}
                </span>
                <PiUserList className="text-4xl flex-grow text-green-800 " />
              </button>
              {/* Ícone de Notificação */}
              <div className="relative mx-3">
                <button
                  onClick={toggleNotificationDropdown}
                  className="relative"
                >
                  <FaBell className="text-2xl text-green-800 mt-1" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
                {notificationDropdownOpen && (
                  <div
                    ref={notificationDropdownRef}
                    className="absolute right-0 mt-8 w-64 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
                    role="menu"
                  >
                    <div className="py-1" role="none">
                      {notifications > 0 ? (
                        <>
                          <p className="px-4 py-2 text-md text-green-800">
                            Você tem {notifications} novas notificações.
                          </p>
                          <Link
                            to="/notifications"
                            className="flex rounded-lg px-4 py-2 text-md font-medium text-green-800 hover:bg-green-100 hover:text-gray-700"
                            role="menuitem"
                            onClick={() => setNotificationDropdownOpen(false)}
                          >
                            Ver todas as notificações
                          </Link>
                        </>
                      ) : (
                        <p className="px-4 py-2 text-md text-green-800">
                          Nenhuma nova notificação.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-40 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
                  role="menu"
                >
                  <div className="py-1" role="none">
                    <Link
                      to="/profile"
                      className="flex rounded-lg px-4 py-2 text-md font-medium text-green-800 hover:bg-green-100 hover:text-gray-700"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <CgProfile className="text-2xl flex-grow" />
                      <span className="mx-auto flex-none w-3/4">Perfil</span>
                    </Link>
                    <Link
                      to="/signout"
                      className="flex rounded-lg px-4 py-2 text-md font-medium text-green-800 hover:bg-green-100 hover:text-gray-700"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <TbLogout className="text-2xl flex-grow" />
                      <span className="mx-auto flex-none w-3/4">Sair</span>
                    </Link>
                    <p className="text-gray-400 text-xs text-center mt-2">
                      V1.0.3
                    </p>{" "}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/signup">
                <div className="bg-green-800 px-5 py-3 rounded-3xl text-white mx-2 hover:bg-green-700">
                  <button className="text-lg">Inscrever</button>
                </div>
              </Link>
              <Link to="/signin">
                <div className="bg-green-800 px-5 py-3 rounded-3xl text-white mx-2 hover:bg-green-700">
                  <button className="text-lg">Login</button>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
