import axios from "axios";
import { useEffect, useState } from "react";
import { urlApi } from "../../url";
import Loading from "../../components/Loading";
import "./../../styles/Admin/VendasAdmin.css";
import Voltar from "../../components/Voltar";
import {
  ShoppingCart,
  User,
  Calendar,
  List,
  Search,
  Filter,
  Download,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  ArrowUpDown
} from "lucide-react";
import { api } from "../../Services/api";

export default function VendasAdmin() {
  const token = localStorage.getItem("TOKEN");
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filteredVendas, setFilteredVendas] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalVendas: 0,
    vendasHoje: 0,
    ticketMedio: 0,
    clientesUnicos: 0
  });

  const buscarVendas = async () => {
    setLoading(true);
    try {
      const response = await api.get('venda');
      setVendas(response.data);
      setFilteredVendas(response.data);

      // Calcular estatísticas
      const total = response.data.length;
      const hoje = new Date().toLocaleDateString();
      const vendasHoje = response.data.filter(v => 
        new Date(v.data).toLocaleDateString() === hoje
      ).length;

      const totalValor = response.data.reduce((acc, venda) => {
        const valorVenda = venda.produtos.reduce((sum, prod) => 
          sum + (prod.preco * prod.quantidade), 0
        );
        return acc + valorVenda;
      }, 0);

      const clientesUnicos = new Set(response.data.map(v => v.nomeCliente)).size;

      setEstatisticas({
        totalVendas: total,
        vendasHoje,
        ticketMedio: totalValor / total,
        clientesUnicos
      });

    } catch (e) {
      console.error(e);
      alert("Erro ao buscar vendas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarVendas();
  }, []);

  useEffect(() => {
    const filtered = vendas.filter(venda =>
      venda.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendas(filtered);
  }, [searchTerm, vendas]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredVendas].sort((a, b) => {
      if (key === 'data') {
        return direction === 'ascending' 
          ? new Date(a.data) - new Date(b.data)
          : new Date(b.data) - new Date(a.data);
      }
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredVendas(sorted);
  };

  const exportarVendas = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Cliente,Usuário,Data,Produtos,Valor Total\n" +
      vendas.map(v => {
        const valorTotal = v.produtos.reduce((sum, p) => sum + (p.preco * p.quantidade), 0);
        const produtos = v.produtos.map(p => 
          `${p.nome}(${p.quantidade}x R$${p.preco})`
        ).join('; ');
        return `${v._id},${v.nomeCliente},${v.usuario},${new Date(v.data).toLocaleDateString()},${produtos},R$${valorTotal.toFixed(2)}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const estatisticasCards = [
    {
      icon: <ShoppingCart />,
      label: "Total de Vendas",
      value: estatisticas.totalVendas,
      color: "#3b82f6"
    },
    {
      icon: <TrendingUp />,
      label: "Vendas Hoje",
      value: estatisticas.vendasHoje,
      color: "#10b981"
    },
    {
      icon: <DollarSign />,
      label: "Ticket Médio",
      value: `R$ ${estatisticas.ticketMedio.toFixed(2)}`,
      color: "#f59e0b"
    },
    {
      icon: <Users />,
      label: "Clientes Únicos",
      value: estatisticas.clientesUnicos,
      color: "#6366f1"
    }
  ];

  if (loading) return <Loading />;

  return (
    <div className="vendas-admin">
      <div className="header-container">
        <div className="header-titulo">
          <div className="titulo-principal">
            <ShoppingCart className="icon-titulo" />
            <h1>Vendas</h1>
          </div>
          <div className="header-actions">
            <button className="btn-exportar" onClick={exportarVendas}>
              <Download /> Exportar CSV
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
              placeholder="Pesquisar vendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filtros-actions">
            <button className="btn-filtrar">
              <Filter /> Filtros
            </button>
            <span className="resultados-count">
              {filteredVendas.length} vendas encontradas
            </span>
          </div>
        </div>
      </div>

      <div className="tabela-container">
        <table className="tabela-vendas">
          <thead>
            <tr>
              <th onClick={() => handleSort('_id')} className="sortable">
                ID {sortConfig.key === '_id' && <ArrowUpDown />}
              </th>
              <th onClick={() => handleSort('nomeCliente')} className="sortable">
                <User className="icon-header" />
                Cliente {sortConfig.key === 'nomeCliente' && <ArrowUpDown />}
              </th>
              <th onClick={() => handleSort('usuario')} className="sortable">
                <User className="icon-header" />
                Usuário {sortConfig.key === 'usuario' && <ArrowUpDown />}
              </th>
              <th onClick={() => handleSort('data')} className="sortable">
                <Calendar className="icon-header" />
                Data {sortConfig.key === 'data' && <ArrowUpDown />}
              </th>
              <th>
                <Package className="icon-header" />
                Produtos
              </th>
              <th>
                <DollarSign className="icon-header" />
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVendas.map((venda) => {
              const valorTotal = venda.produtos.reduce(
                (sum, prod) => sum + (prod.preco * prod.quantidade), 
                0
              );
              
              return (
                <tr key={venda._id} className="venda-row">
                  <td className="id-cell">{venda._id}</td>
                  <td className="cliente-cell">{venda.nomeCliente}</td>
                  <td className="usuario-cell">{venda.usuario}</td>
                  <td className="data-cell">
                    {new Date(venda.data).toLocaleDateString()}
                  </td>
                  <td className="produtos-cell">
                    <ul className="produtos-lista">
                      {venda.produtos.map((prod, idx) => (
                        <li key={idx} className="produto-item">
                          <span className="produto-nome">{prod.nome}</span>
                          <span className="produto-qtd">{prod.quantidade}x</span>
                          <span className="produto-preco">
                            R$ {prod.preco.toFixed(2).replace('.', ',')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="total-cell">
                    R$ {valorTotal.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Voltar />
    </div>
  );
}
