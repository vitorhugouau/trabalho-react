import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Painel.css";
import { FaShoppingCart, FaUser, FaLaptop, FaMemory, FaMicrochip, FaTimes } from 'react-icons/fa';
import axios from "axios";
import { urlApi, user } from "../url";

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
    try {
      const response = await axios.get(`${urlApi}/produtos/${user}`);
      setProdutos(response.data);
    } catch (e) {
      console.log(e);
      alert("Erro ao buscar produtos");
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

  return (
    <div className="homepage">
      <header className="header">
        <h1 className="logo"><FaLaptop /> TechStore</h1>
        <button className="cart-toggle" onClick={() => setMostrarCarrinho(!mostrarCarrinho)}>
          <FaShoppingCart />
          {mostrarCarrinho ? " Fechar Carrinho" : ` Carrinho (${carrinho.length})`}
        </button>
      </header>

      <section className="hero">
        <h2>Os Melhores Produtos de Informática</h2>
        <p>Placas de vídeo, processadores, periféricos e mais com ofertas imperdíveis!</p>

        {loading && <p className="loading">Carregando produtos...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && produtos.length > 0 && (
          <div className="products-grid">
            {produtos.map((prod) => (
              <div key={prod._id} className="product-card">
                <img src={prod.imagem || "/img/sem-imagem.jpg"} alt={prod.nome} />
                <h4>{prod.nome}</h4>
                <p className="descricao">{prod.descricao}</p>
                <p className="preco">R$ {Number(prod.preco).toLocaleString("pt-BR")}</p>
                <button onClick={() => adicionarAoCarrinho(prod)}>
                  <FaShoppingCart /> Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {mostrarCarrinho && (
        <section className="carrinho">
          <h3>Carrinho de Compras</h3>

          {carrinho.length === 0 ? (
            <p className="mensagem-vazio">Nenhum produto no carrinho.</p>
          ) : (
            <>
              <ul className="carrinho-grid">
                {carrinho.map((item) => (
                  <li key={item._id} className="carrinho-item">
                    <div className="info-produto">
                      <h4>{item.nome}</h4>
                      <p>{item.quantidade}x</p>
                      <p>R$ {(item.preco * item.quantidade).toLocaleString("pt-BR")}</p>
                    </div>
                    <button
                      className="btn-remover"
                      onClick={() => removerDoCarrinho(item._id)}
                    >
                      <FaTimes /> Remover
                    </button>
                  </li>
                ))}
              </ul>

              <p className="total">Total: <strong>R$ {total.toLocaleString("pt-BR")}</strong></p>

              <input
                type="text"
                className="input-nome"
                placeholder="Nome do Cliente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <button className="btn-finalizar" onClick={cadastrarVenda}>
                Finalizar Venda
              </button>
            </>
          )}
        </section>
      )}


      <section className="categories">
        <h3>Categorias</h3>
        <div className="category-grid">
          <div className="category-card"><FaLaptop /> <span>Notebooks</span></div>
          <div className="category-card"><FaMicrochip /> <span>Processadores</span></div>
          <div className="category-card"><FaMemory /> <span>Memórias RAM</span></div>
        </div>
      </section>

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

      <footer className="footer">
        <p>&copy; 2025 TechStore. Todos os direitos reservados.</p>
      </footer>
    </div>
  );


}
