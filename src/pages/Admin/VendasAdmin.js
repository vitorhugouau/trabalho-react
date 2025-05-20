import axios from "axios";
import { useEffect, useState } from "react";
import { urlApi } from "../../url";
import Loading from "../../components/Loading";
import "./../../styles/Admin/VendasAdmin.css";
import Voltar from "../../components/Voltar";
import { ShoppingCartIcon, UserIcon, CalendarIcon, ListIcon, HashIcon, ArrowLeftCircle } from "lucide-react";

export default function VendasAdmin() {
  const token = localStorage.getItem("TOKEN");

  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarVendas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${urlApi}/venda`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendas(response.data);
    } catch (e) {
      console.log(e);
      alert("Erro ao buscar vendas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarVendas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="vendas-admin">
      <div className="header-titulo-venda">
        <h1>
          <ShoppingCartIcon className="icon-title" />
          Vendas
        </h1>
      </div>
      <div className="tabela-container">
        <table className="tabela-vendas">
          <thead>
            <tr>
              <th><HashIcon className="icon-header" />ID</th>
              <th><UserIcon className="icon-header" />Cliente</th>
              <th><UserIcon className="icon-header" />Usuário</th>
              <th><CalendarIcon className="icon-header" />Data</th>
              <th><ListIcon className="icon-header" />Produtos</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda._id}>
                <td>{venda._id}</td>
                <td>{venda.nomeCliente}</td>
                <td>{venda.usuario}</td>
                <td>{new Date(venda.data).toLocaleDateString()}</td>
                <td>
                  <ul>
                    {venda.produtos.map((prod, idx) => (
                      <li key={idx}>
                        {prod.nome} - {prod.quantidade}x R${prod.preco.toFixed(2).replace('.', ',')}
                      </li>
                    ))}
                  </ul>
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
