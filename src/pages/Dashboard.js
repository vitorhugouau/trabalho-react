import { Link, useNavigate } from "react-router-dom";
import "./../styles/Dashboard.css";
import {
  FaBoxOpen,
  FaTags,
  FaCashRegister,
  FaSignOutAlt,
  FaUser,
  FaChartLine,
  FaCog,
  FaBell,
  FaSearch,
  FaRegClock,
  FaStore,
  FaShoppingCart,
  FaExclamationTriangle,
  FaFileAlt,
  FaRegBell
} from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications] = useState([
    { 
      id: 1, 
      text: "Nova venda realizada", 
      time: "Agora", 
      type: "success",
      icon: <FaShoppingCart />,
      isNew: true
    },
    { 
      id: 2, 
      text: "Estoque baixo de produtos", 
      time: "2h atrás", 
      type: "warning",
      icon: <FaExclamationTriangle />,
      isNew: true
    },
    { 
      id: 3, 
      text: "Relatório mensal disponível", 
      time: "1d atrás", 
      type: "info",
      icon: <FaFileAlt />,
      isNew: false
    },
  ]);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("USUARIO");
    if (!usuarioSalvo) {
      navigate("/");
    } else {
      setUsuario(usuarioSalvo);
    }
  }, [navigate]);

  const logout = () => {
    navigate("/");
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
  };

  const quickStats = [
    { icon: <FaStore />, label: "Total de Produtos", value: "150" },
    { icon: <FaCashRegister />, label: "Vendas Hoje", value: "12" },
    { icon: <FaChartLine />, label: "Crescimento", value: "+25%" },
  ];
  
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <FaStore className="store-icon" />
          <h1>TechStore</h1>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <h3>{usuario}</h3>
            <p>Administrador</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link className="nav-link active" to="/dashboard">
            <FaChartLine /> Dashboard
          </Link>
          <Link className="nav-link" to="/produtos">
            <FaBoxOpen /> Produtos
          </Link>
          <Link className="nav-link" to="/categorias">
            <FaTags /> Categorias
          </Link>
          <Link className="nav-link" to="/vendas">
            <FaCashRegister /> Vendas
          </Link>
          <Link className="nav-link" to="/configuracoes">
            <FaCog /> Configurações
          </Link>
        </nav>

        <button className="logout-button" onClick={logout}>
          <FaSignOutAlt /> Sair
        </button>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <h2>Visão Geral</h2>
          
          <div className="quick-stats">
            {quickStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="grid-card">
              <h3><FaBoxOpen /> Ações Rápidas</h3>
              <div className="quick-actions">
                <Link to="/produtos/novo" className="action-button">
                  <FaBoxOpen /> Novo Produto
                </Link>
                <Link to="/vendas/nova" className="action-button">
                  <FaCashRegister /> Nova Venda
                </Link>
                <Link to="/categorias/nova" className="action-button">
                  <FaTags /> Nova Categoria
                </Link>
              </div>
            </div>

            <div className="grid-card">
              <h3><FaRegBell /> Notificações Recentes</h3>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.type} ${notification.isNew ? 'new' : ''}`}
                  >
                    <div className="notification-icon">
                      {notification.icon}
                    </div>
                    <div className="notification-content">
                      <p>{notification.text}</p>
                      <div className="notification-time">
                        <FaRegClock />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
