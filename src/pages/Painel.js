import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Painel.css";
import {
  FaShoppingCart,
  FaUser,
  FaLaptop,
  FaMemory,
  FaMicrochip,
  FaTimes,
  FaSignInAlt,
  FaPlus,
  FaMinus,
  FaCheck,
  FaShoppingBag,
  FaRegSadTear
} from "react-icons/fa";
import axios from "axios";
import { urlApi, user } from "../url";
import { Link } from "react-router-dom";

export default function Painel() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [nome, setNome] = useState("");
  const [error, setError] = useState(null);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const navigate = useNavigate();

  const getProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${urlApi}/produtos/${user}`);
      setProdutos(response.data);
    } catch (e) {
      setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProdutos();
  }, []);

  const adicionarAoCarrinho = (produto) => {
    const jaExiste = carrinho.find((p) => p._id === produto._id);
    if (jaExiste) {
      setCarrinho(
        carrinho.map((p) =>
          p._id === produto._id ? { ...p, quantidade: p.quantidade + 1 } : p
        )
      );
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (id) => {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const cadastrarVenda = async () => {
    if (!nome.trim()) {
      alert("Digite o nome do cliente.");
      return;
    }

    if (carrinho.length === 0) {
      alert("Carrinho vazio.");
      return;
    }

    const payload = {
      nomeCliente: nome,
      data: new Date().toISOString().split("T")[0],
      usuario: user,
      produtos: carrinho.map((item) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
      })),
    };

    try {
      await axios.post(`${urlApi}/vendas`, payload);
      alert("Venda cadastrada com sucesso!");
      setCarrinho([]);
      setNome("");
      setMostrarCarrinho(false);
      navigate('/agradecimento', { state: nome });
    } catch (e) {
      console.error(e);
      alert("Erro ao cadastrar a venda.");
    }
  };

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <header className="header">
        <h1 className="logo">
          <FaLaptop /> TechStore
        </h1>

        <div className="header-buttons">
          <button 
            className="cart-toggle" 
            onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
          >
            <FaShoppingCart />
            <span>{carrinho.length > 0 ? `Carrinho (${carrinho.reduce((acc, item) => acc + item.quantidade, 0)})` : 'Carrinho'}</span>
          </button>

          <Link to="/" className="login-button">
            <FaSignInAlt /> Login
          </Link>
        </div>
      </header>

      <section className="hero">
        <h2>Os Melhores Produtos de Informática</h2>
        <p>Placas de vídeo, processadores, periféricos e mais com ofertas imperdíveis!</p>

        {error && (
          <div className="error">
            <FaRegSadTear />
            <p>{error}</p>
          </div>
        )}

        {!loading && produtos.length === 0 && !error && (
          <div className="error">
            <FaRegSadTear />
            <p>Nenhum produto disponível no momento.</p>
          </div>
        )}

        {produtos.length > 0 && (
          <div className="products-grid">
            {produtos.map((prod) => (
              <div key={prod._id} className="product-card">
                <img src={prod.imagem || "/img/sem-imagem.jpg"} alt={prod.nome} />
                <h4>{prod.nome}</h4>
                <p className="descricao">{prod.descricao}</p>
                <p className="preco">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(prod.preco)}
                </p>
                <button onClick={() => adicionarAoCarrinho(prod)}>
                  <FaShoppingCart /> Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {mostrarCarrinho && (
        <div className="modal-overlay" onClick={() => setMostrarCarrinho(false)}>
          <div className="modal-carrinho" onClick={(e) => e.stopPropagation()}>
            <button className="btn-fechar" onClick={() => setMostrarCarrinho(false)}>
              <FaTimes />
            </button>

            <h3 className="titulo-modal">
              <FaShoppingBag /> Carrinho de Compras
            </h3>

            {carrinho.length === 0 ? (
              <div className="mensagem-vazio">
                <FaRegSadTear />
                <p>Nenhum produto no carrinho.</p>
              </div>
            ) : (
              <>
                <ul className="carrinho-grid">
                  {carrinho.map((item) => (
                    <li key={item._id} className="carrinho-item">
                      <div className="info-produto">
                        <h4>{item.nome}</h4>
                        <div className="quantidade-controles">
                          <button onClick={() => removerDoCarrinho(item._id)}>
                            <FaMinus />
                          </button>
                          <span>{item.quantidade}</span>
                          <button onClick={() => adicionarAoCarrinho(item)}>
                            <FaPlus />
                          </button>
                        </div>
                        <p>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.preco * item.quantidade)}
                        </p>
                      </div>
                      <button
                        className="btn-remover"
                        onClick={() => setCarrinho(carrinho.filter(p => p._id !== item._id))}
                      >
                        <FaTimes /> Remover
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="total">
                  Total: {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(total)}
                </p>

                <div className="checkout-form">
                  <div className="input-group">
                    <FaUser />
                    <input
                      type="text"
                      className="input-nome"
                      placeholder="Nome do Cliente"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>

                  <button className="btn-finalizar" onClick={cadastrarVenda}>
                    <FaCheck /> Finalizar Compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <section className="categories">
        <h3>Categorias em Destaque</h3>
        <div className="category-grid">
          <div className="category-card">
            <FaLaptop />
            <span>Notebooks</span>
          </div>
          <div className="category-card">
            <FaMicrochip />
            <span>Processadores</span>
          </div>
          <div className="category-card">
            <FaMemory />
            <span>Memórias RAM</span>
          </div>
        </div>
      </section>
    </div>
  );
}
