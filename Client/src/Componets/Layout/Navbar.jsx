import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { PiUserList } from "react-icons/pi"

import { TbLogout } from "react-icons/tb";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`${currentUser ? 'bg-white' : 'bg-green-200'} shadow-md py-4`}>
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center flex-shrink-0"></div>

        {/* Center Section */}
        {currentUser ? (
          <>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className="text-green-800 text-xl font-medium"
              >
                Bem vindo ao Controle de finacias,
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
                <span className="text-green-800 text-xl mx-2 font-medium hidden sm:block">
                  {currentUser.user.username}
                </span>
                <PiUserList className="text-3xl flex-grow text-green-800" />
              </button>
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
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/signup">
                <div className="bg-green-800 px-5 py-3 rounded-3xl text-white mx-2 hover:bg-green-700">
                  <button className="text-lg">Sign Up</button>
                </div>
              </Link>
              <Link to="/signin">
                <div className="bg-green-800 px-5 py-3 rounded-3xl text-white mx-2 hover:bg-green-700">
                  <button className="text-lg">Sign In</button>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
};

export default Navbar;