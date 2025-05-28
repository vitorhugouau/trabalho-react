import axios from "axios";
import Voltar from "../../components/Voltar";
import "./../../styles/Admin/ProdutosAdmin.css";
import { urlApi } from "../../url";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaBox,
  FaFilter,
  FaDownload,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";

export default function ProdutosAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");
  const usuario = localStorage.getItem("USUARIO");

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filteredProdutos, setFilteredProdutos] = useState([]);

  const getProdutos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${urlApi}/produtos/${usuario}`);
      setProdutos(response.data);
      setFilteredProdutos(response.data);
    } catch (e) {
      console.error(e);
      alert("Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="produtos-admin">
      <div className="header-container">
        <div className="header-titulo">
          <div className="titulo-principal">
            <FaBox className="icon-titulo" />
            <h1>Produtos</h1>
          </div>
          <div className="header-actions">
            <button className="btn-exportar" onClick={exportarProdutos}>
              <FaDownload /> Exportar
            </button>
            <button className="btn-adicionar" onClick={criarProduto}>
              <FaPlus /> Novo Produto
            </button>
          </div>
        </div>

        <div className="filtros-container">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-filtrar">
            <FaFilter /> Filtros
          </button>
        </div>
      </div>

      <div className="tabela-container">
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Imagem</th>
              <th onClick={() => handleSort('nome')} className="sortable">
                Nome {sortConfig.key === 'nome' && <FaSort />}
              </th>
              <th onClick={() => handleSort('categoria')} className="sortable">
                Categoria {sortConfig.key === 'categoria' && <FaSort />}
              </th>
              <th>Descrição</th>
              <th onClick={() => handleSort('quantidade')} className="sortable">
                Quantidade {sortConfig.key === 'quantidade' && <FaSort />}
              </th>
              <th onClick={() => handleSort('preco')} className="sortable">
                Preço (R$) {sortConfig.key === 'preco' && <FaSort />}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProdutos.map((produto) => (
              <tr key={produto._id}>
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
                <td>{produto.descricao}</td>
                <td>
                  <span className={`quantidade-badge ${produto.quantidade < 10 ? 'baixo' : 'normal'}`}>
                    {produto.quantidade}
                    {produto.quantidade < 10 && <FaExclamationTriangle className="warning-icon" />}
                    {produto.quantidade >= 10 && <FaCheckCircle className="check-icon" />}
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
                      <FaEdit />
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
                      <FaTrash />
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
