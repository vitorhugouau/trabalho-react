import { Link, useNavigate } from "react-router-dom";
import "./../styles/Dashboard.css";
import { FaBoxOpen, FaTags, FaCashRegister, FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
  };
  
  return (
  <div className="dashboard">
    <header className="dashboard-header">
      <p>Área Administrativa</p>
      <p className="logout" onClick={logout}>
        <FaSignOutAlt /> Sair
      </p>
    </header>

    <div className="links">
      <Link className="link" to="/produtos">
        <FaBoxOpen /> Editar Produtos
      </Link>
      <Link className="link" to="/categorias">
        <FaTags /> Editar Categorias
      </Link>
      <Link className="link" to="/vendas">
        <FaCashRegister /> Editar Vendas
      </Link>
    </div>
  </div>
);
}
