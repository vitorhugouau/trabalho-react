import axios from "axios";
import Voltar from "../../components/Voltar";
import "./../../styles/Admin/CategoriasAdmin.css";
import { urlApi } from "../../url";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  FolderIcon,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  ChartLine,
  Package,
  Plus,
  Tag
} from "lucide-react";

export default function CategoriasAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");
  const usuario = localStorage.getItem("USUARIO");

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalCategorias: 0,
    categoriasAtivas: 0,
    produtosPorCategoria: 0,
    categoriasMaisUsadas: 0
  });

  const getCategorias = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${urlApi}/categorias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorias(response.data);
      setFilteredCategorias(response.data);
      
      // Calcular estatísticas
      const total = response.data.length;
      const ativas = response.data.filter(cat => cat.ativa).length;
      const produtosPorCat = response.data.reduce((acc, cat) => acc + (cat.produtos?.length || 0), 0) / total;
      const maisUsadas = response.data.filter(cat => (cat.produtos?.length || 0) > 5).length;

      setEstatisticas({
        totalCategorias: total,
        categoriasAtivas: ativas,
        produtosPorCategoria: Math.round(produtosPorCat * 10) / 10,
        categoriasMaisUsadas: maisUsadas
      });

    } catch (e) {
      console.error(e);
      alert("Erro ao buscar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  useEffect(() => {
    const filtered = categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategorias(filtered);
  }, [searchTerm, categorias]);

  const removerCategoria = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${urlApi}/categorias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      });
      getCategorias();
      alert("Categoria deletada com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao deletar categoria");
    } finally {
      setLoading(false);
    }
  };

  const editarCategoria = (categoria) => {
    navigate("/categorias/alterar", { state: { categoria } });
  };

  const criarCategoria = () => {
    navigate("/categorias/alterar");
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCategorias].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredCategorias(sorted);
  };

  const exportarCategorias = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Nome,Descrição,Status,Produtos\n" +
      categorias.map(c => 
        `${c.nome},${c.descricao || ''},${c.ativa ? 'Ativa' : 'Inativa'},${c.produtos?.length || 0}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "categorias.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const estatisticasCards = [
    {
      icon: <FolderIcon />,
      label: "Total de Categorias",
      value: estatisticas.totalCategorias,
      color: "#3b82f6"
    },
    
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="categorias-admin">
      <div className="header-container">
        <div className="header-titulo">
          <div className="titulo-principal">
            <Tag className="icon-titulo" />
            <h1>Categorias</h1>
          </div>
          <div className="header-actions">
            <button className="btn-exportar" onClick={exportarCategorias}>
              <Download /> Exportar CSV
            </button>
            <button className="btn-adicionar" onClick={criarCategoria}>
              <Plus /> Nova Categoria
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
              placeholder="Pesquisar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filtros-actions">
            <button className="btn-filtrar">
              <Filter /> Filtros
            </button>
            <span className="resultados-count">
              {filteredCategorias.length} categorias encontradas
            </span>
          </div>
        </div>
      </div>

      <div className="tabela-container">
        <table className="tabela-categorias">
          <thead>
            <tr>
              <th onClick={() => handleSort('nome')} className="sortable">
                Nome {sortConfig.key === 'nome' && <ArrowUpDown />}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.map((categoria) => (
              <tr key={categoria._id} className="categoria-row">
                <td>
                  <span className="categoria-nome">
                    <FolderIcon size={16} />
                    {categoria.nome}
                  </span>
                </td>
                <td>
                  <div className="acoes-container">
                    <button
                      className="btn-acao btn-editar"
                      onClick={() => editarCategoria(categoria)}
                      title="Editar categoria"
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn-acao btn-excluir"
                      onClick={() => {
                        const confirmar = window.confirm(
                          "Tem certeza que deseja excluir esta categoria?"
                        );
                        if (confirmar) {
                          removerCategoria(categoria._id);
                        }
                      }}
                      title="Excluir categoria"
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
