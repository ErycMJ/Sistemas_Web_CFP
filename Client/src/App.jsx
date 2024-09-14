import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Componets/Home/Home";
import SignIn from "./Componets/Auth/SignIn";
import SignUp from "./Componets/Auth/SignUp";
import Navbar from "./Componets/Layout/Navbar";
import { Footer } from "./Componets/Layout/Footer";
import { Toaster } from "react-hot-toast";
import { PrivateRouter } from "./Componets/Private/PrivateRouter";
import { Profile } from "./Componets/Private/Profile";
import SignOut from "./Componets/Auth/SignOut";
import Faqs from "./Componets/Home/Faqs";
import Dashboard from "./Componets/Private/DashBoard";
import { useSelector } from "react-redux";
import Transaction from "./Componets/Private/Transaction";
import Category from "./Componets/Private/Category";
import Sidebar from "./Componets/Layout/Sidebar"; // Importando Sidebar

const App = () => {
  const { currentUser } = useSelector((state) => state.user);

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
                currentUser ? "ml-64" : ""
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
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
