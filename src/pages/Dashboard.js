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
  FaRegBell,
  FaBars
} from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { urlApi } from "../url";

export default function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    produtos: { value: '0', trend: '0%', trendUp: true },
    vendas: { value: 'R$ 0', trend: '0%', trendUp: true },
    pedidos: { value: '0', trend: '0%', trendUp: true },
    media: { value: 'R$ 0', trend: '0%', trendUp: true }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("USUARIO");
    const token = localStorage.getItem("TOKEN");
    
    if (!usuarioSalvo || !token) {
      navigate("/");
    } else {
      setUsuario(usuarioSalvo);
      fetchProdutos(usuarioSalvo);
    }
  }, [navigate]);

  const fetchProdutos = async (usuarioId) => {
    try {
      const response = await axios.get(`${urlApi}/produtos/${usuarioId}`);
      setProdutos(response.data);
      
      const novasNotificacoes = [];
      
      const produtosBaixoEstoque = response.data.filter(p => p.quantidade < 10);
      if (produtosBaixoEstoque.length > 0) {
        novasNotificacoes.push({
          id: 1,
          text: `${produtosBaixoEstoque.length} produtos com estoque baixo`,
          time: "Agora",
          type: "warning",
          icon: <FaExclamationTriangle />,
          isNew: true
        });
      }

      setNotifications(novasNotificacoes);

    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Erro ao carregar dados dos produtos');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      if (!token) {
        navigate("/");
        return;
      }

      const totalProdutos = produtos.length;
      const valorTotalEstoque = produtos.reduce((total, p) => total + (p.preco * p.quantidade), 0);
      const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 10).length;
      const mediaPrecos = produtos.reduce((total, p) => total + p.preco, 0) / totalProdutos;

      setStats(prevStats => {
        const calculateTrend = (newValue, oldValue) => {
          if (!oldValue) return { trend: '0%', trendUp: true };
          const difference = newValue - oldValue;
          const percentage = ((difference / oldValue) * 100).toFixed(1);
          return {
            trend: `${percentage}%`,
            trendUp: difference >= 0
          };
        };

        return {
          produtos: {
            value: totalProdutos.toString(),
            ...calculateTrend(totalProdutos, parseInt(prevStats.produtos.value))
          },
          vendas: {
            value: `R$ ${valorTotalEstoque.toFixed(2)}`,
            ...calculateTrend(valorTotalEstoque, parseFloat(prevStats.vendas.value.replace('R$ ', '')))
          },
          pedidos: {
            value: produtosBaixoEstoque.toString(),
            ...calculateTrend(produtosBaixoEstoque, parseInt(prevStats.pedidos.value))
          },
          media: {
            value: `R$ ${mediaPrecos.toFixed(2)}`,
            ...calculateTrend(mediaPrecos, parseFloat(prevStats.media.value.replace('R$ ', '')))
          }
        };
      });

      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao calcular estatísticas:', err);
      setError('Erro ao atualizar estatísticas');
      setLoading(false);
    }
  };

  useEffect(() => {
  
    fetchStats();

    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [produtos]); 

  const logout = () => {
    navigate("/");
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
  };

  const quickStats = [
    { 
      icon: <FaStore />, 
      label: "Total de Produtos", 
      value: stats.produtos.value,
      trend: stats.produtos.trend,
      trendUp: stats.produtos.trendUp,
      color: "#3b82f6"
    },
    { 
      icon: <FaCashRegister />, 
      label: "Valor em Estoque", 
      value: stats.vendas.value,
      trend: stats.vendas.trend,
      trendUp: stats.vendas.trendUp,
      color: "#10b981"
    },
    { 
      icon: <FaShoppingCart />, 
      label: "Produtos Baixo Estoque", 
      value: stats.pedidos.value,
      trend: stats.pedidos.trend,
      trendUp: !stats.pedidos.trendUp, 
      color: "#f59e0b"
    },
    { 
      icon: <FaChartLine />, 
      label: "Preço Médio", 
      value: stats.media.value,
      trend: stats.media.trend,
      trendUp: stats.media.trendUp,
      color: "#6366f1"
    }
  ];
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
        </nav>

        <button className="logout-button" onClick={logout}>
          <FaSignOutAlt /> Sair
        </button>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
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
              <div key={index} className="stat-card" style={{'--card-color': stat.color}}>
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    <h3>{loading ? '...' : stat.value}</h3>
                    {!loading && (
                      <span className={`trend ${stat.trendUp ? 'up' : 'down'}`}>
                        {stat.trendUp ? '↑' : '↓'} {stat.trend}
                      </span>
                    )}
                  </div>
                  <p>{stat.label}</p>
                  {error && <small className="error-text">{error}</small>}
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="grid-card">
              <h3><FaBoxOpen /> Ações Rápidas</h3>
              <div className="quick-actions">
                <Link to="/produtos" className="action-button">
                  <FaBoxOpen /> Novo Produto
                </Link>
                <Link to="/vendas" className="action-button">
                  <FaCashRegister /> Venda
                </Link>
                <Link to="/categorias" className="action-button">
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
