import axios from "axios";
import Voltar from "../../components/Voltar";
import "./../../styles/Admin/ProdutosAdmin.css";
import { urlApi } from "../../url";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  Box,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  ChartLine,
  Package,
  DollarSign,
  Plus
} from "lucide-react";

export default function ProdutosAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");
  const usuario = localStorage.getItem("USUARIO");

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalProdutos: 0,
    valorTotal: 0,
    produtosBaixoEstoque: 0,
    mediaPrecos: 0
  });

  const getProdutos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${urlApi}/produtos/${usuario}`);
      setProdutos(response.data);
      setFilteredProdutos(response.data);
      
      // Calcular estatísticas
      const total = response.data.length;
      const valorTotal = response.data.reduce((acc, prod) => acc + (prod.preco * prod.quantidade), 0);
      const baixoEstoque = response.data.filter(prod => prod.quantidade < 10).length;
      const mediaPrecos = response.data.reduce((acc, prod) => acc + prod.preco, 0) / total;

      setEstatisticas({
        totalProdutos: total,
        valorTotal,
        produtosBaixoEstoque: baixoEstoque,
        mediaPrecos
      });

    } catch (e) {
      console.error(e);
      alert("Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProdutos();
  }, []);

  useEffect(() => {
    const filtered = produtos.filter(produto =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProdutos(filtered);
  }, [searchTerm, produtos]);

  const removerProduto = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${urlApi}/produtos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      });
      getProdutos();
      alert("Produto deletado com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao deletar produto");
    } finally {
      setLoading(false);
    }
  };

  const editarProduto = (produto) => {
    navigate("/produtos/alterar", { state: { produto } });
  };

  const criarProduto = () => {
    navigate("/produtos/alterar");
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredProdutos].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredProdutos(sorted);
  };

  const exportarProdutos = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Nome,Categoria,Descrição,Quantidade,Preço\n" +
      produtos.map(p => 
        `${p.nome},${p.categoria},${p.descricao},${p.quantidade},${p.preco}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "produtos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const estatisticasCards = [
    {
      icon: <Package />,
      label: "Total de Produtos",
      value: estatisticas.totalProdutos,
      color: "#3b82f6"
    },
    {
      icon: <DollarSign />,
      label: "Valor Total em Estoque",
      value: `R$ ${estatisticas.valorTotal.toFixed(2)}`,
      color: "#10b981"
    },
    {
      icon: <AlertTriangle />,
      label: "Produtos Baixo Estoque",
      value: estatisticas.produtosBaixoEstoque,
      color: "#f59e0b"
    },
    {
      icon: <ChartLine />,
      label: "Preço Médio",
      value: `R$ ${estatisticas.mediaPrecos.toFixed(2)}`,
      color: "#6366f1"
    }
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="produtos-admin">
      <div className="header-container">
        <div className="header-titulo">
          <div className="titulo-principal">
            <Box className="icon-titulo" />
            <h1>Produtos</h1>
          </div>
          <div className="header-actions">
            <button className="btn-exportar" onClick={exportarProdutos}>
              <Download /> Exportar CSV
            </button>
            <button className="btn-adicionar" onClick={criarProduto}>
              <Plus /> Novo Produto
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="estatisticas-grid">
          {estatisticasCards.map((card, index) => (
            <div key={index} className="estatistica-card" style={{'--card-color': card.color}}>
              <div className="estatistica-icon">
                {card.icon}
              </div>
              <div className="estatistica-info">
                <h3>{card.value}</h3>
                <p>{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="filtros-container">
          <div className="search-bar">
            <Search />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filtros-actions">
            <button className="btn-filtrar">
              <Filter /> Filtros
            </button>
            <span className="resultados-count">
              {filteredProdutos.length} produtos encontrados
            </span>
          </div>
        </div>
      </div>

      <div className="tabela-container">
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Imagem</th>
              <th onClick={() => handleSort('nome')} className="sortable">
                Nome {sortConfig.key === 'nome' && <ArrowUpDown />}
              </th>
              <th onClick={() => handleSort('categoria')} className="sortable">
                Categoria {sortConfig.key === 'categoria' && <ArrowUpDown />}
              </th>
              <th>Descrição</th>
              <th onClick={() => handleSort('quantidade')} className="sortable">
                Quantidade {sortConfig.key === 'quantidade' && <ArrowUpDown />}
              </th>
              <th onClick={() => handleSort('preco')} className="sortable">
                Preço (R$) {sortConfig.key === 'preco' && <ArrowUpDown />}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProdutos.map((produto) => (
              <tr key={produto._id} className="produto-row">
                <td className="imagem-cell">
                  <div className="imagem-container">
                    <img
                      src={produto.imagem || "/img/sem-imagem.jpg"}
                      alt={produto.nome}
                      onError={(e) => {
                        e.target.src = "/img/sem-imagem.jpg";
                      }}
                    />
                  </div>
                </td>
                <td>{produto.nome}</td>
                <td>
                  <span className="categoria-tag">{produto.categoria}</span>
                </td>
                <td className="descricao-cell">{produto.descricao}</td>
                <td>
                  <span className={`quantidade-badge ${produto.quantidade < 10 ? 'baixo' : 'normal'}`}>
                    {produto.quantidade}
                    {produto.quantidade < 10 && <AlertTriangle className="warning-icon" />}
                    {produto.quantidade >= 10 && <CheckCircle className="check-icon" />}
                  </span>
                </td>
                <td className="preco-cell">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(produto.preco)}
                </td>
                <td>
                  <div className="acoes-container">
                    <button
                      className="btn-acao btn-editar"
                      onClick={() => editarProduto(produto)}
                      title="Editar produto"
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn-acao btn-excluir"
                      onClick={() => {
                        const confirmar = window.confirm(
                          "Tem certeza que deseja excluir este produto?"
                        );
                        if (confirmar) {
                          removerProduto(produto._id);
                        }
                      }}
                      title="Excluir produto"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Voltar />
    </div>
  );
}
