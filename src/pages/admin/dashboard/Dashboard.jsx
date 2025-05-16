import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Dashboard.css'; 

const Dashboard = () => { 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  const handleCategoria = () => {
    navigate('/admin/categorias')
  }
  const handleProduto = () => {
    navigate('/admin/produtos')
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        <i className="fas fa-tachometer-alt"></i> Painel Administrativo
      </h1>

      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={handleCategoria}>
          <i className="fas fa-tags"></i> Categorias
        </button>

        <button className="dashboard-button" onClick={handleProduto}>
          <i className="fas fa-cogs"></i> Produtos
        </button>

        <button className="dashboard-button">
          <i className="fas fa-chart-line"></i> Vendas
        </button>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  );
}

export default Dashboard;