// HomePage.jsx
import React from 'react';
import './HomePage.css';
import { FaShoppingCart, FaUser, FaLaptop, FaMemory, FaMicrochip } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {

  const navigate = useNavigate();


  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <h1 className="logo">TechStore</h1>
        <nav className="nav">
          <a href="#">Início</a>
          <a href="#">Produtos</a>
          <a href="#">Contato</a>
          <a href="#">Sobre</a>
          <span
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
          >
            Área Administrativa
          </span>
        </nav>
        <div className="icons">
          <FaShoppingCart />
          <FaUser />
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h2>Os Melhores Produtos de Informática</h2>
          <p>Placas de vídeo, processadores, periféricos e mais com ofertas imperdíveis!</p>
          <button>Ver Ofertas</button>
        </div>
      </section>

      {/* Categorias */}
      <section className="categories">
        <h3>Categorias</h3>
        <div className="category-grid">
          <div className="category-card"><FaLaptop /><span>Notebooks</span></div>
          <div className="category-card"><FaMicrochip /><span>Processadores</span></div>
          <div className="category-card"><FaMemory /><span>Memórias RAM</span></div>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="featured">
        <h3>Destaques</h3>
        <div className="product-grid">
          <div className="product-card">
            <img src="/img/placa-video.jpg" alt="Placa de Vídeo" />
            <h4>RTX 3050</h4>
            <p>R$ 2.500,00</p>
            <button>Comprar</button>
          </div>
          <div className="product-card">
            <img src="/img/ryzen.jpg" alt="Ryzen" />
            <h4>Ryzen 5 5600X</h4>
            <p>R$ 1.200,00</p>
            <button>Comprar</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 TechStore. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;
