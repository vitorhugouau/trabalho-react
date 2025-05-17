
import React, { useState, useEffect, useCallback } from 'react';
import './HomePage.css';
import { FaShoppingCart, FaUser, FaLaptop, FaMemory, FaMicrochip } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';


const HomePage = ({ usuario }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const usuario = localStorage.getItem('usuario');

  const listarProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/app/produtos/${usuario}`);
      setProdutos(response.data);
    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    listarProdutos();
  }, [listarProdutos]);

  return (
    <div className="homepage">
      {/* ...header e outras seções... */}

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h2>Os Melhores Produtos de Informática</h2>
          <p>Placas de vídeo, processadores, periféricos e mais com ofertas imperdíveis!</p>

         
          {loading && <p style={{ color: '#fff' }}>Carregando produtos...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && produtos.length > 0 && (
            <p style={{ color: '#fff' }}>
              {produtos.length} produto(s) encontrados para você!
            </p>
          )}
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
