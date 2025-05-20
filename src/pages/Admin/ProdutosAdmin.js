import axios from "axios";
import Voltar from "../../components/Voltar";
import "./../../styles/Admin/ProdutosAdmin.css";
import { urlApi } from "../../url";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function ProdutosAdmin() {
  const navigate = useNavigate();

  const token = localStorage.getItem("TOKEN");
  const usuario = localStorage.getItem("USUARIO");

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProdutos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${urlApi}/produtos/${usuario}`);
      setProdutos(response.data);
    } catch (e) {
      console.log(e);
      alert("Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

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
      console.log(e);
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

  useEffect(() => {
    getProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="produtos-admin">
      <div className="header-titulo">
        <h1>Produtos</h1>
        <FaPlus
          title="Adicionar novo produto"
          style={{ cursor: "pointer", color: "#28a745", fontSize: "24px" }}
          onClick={criarProduto}
        />
      </div>

      <div className="tabela-container">
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Preço (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto._id}>
                <td>
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    width="80"
                    height="80"
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </td>
                <td>{produto.nome}</td>
                <td>{produto.categoria}</td>
                <td>{produto.descricao}</td>
                <td>{produto.quantidade}</td>
                <td>{produto.preco.toFixed(2)}</td>
                <td>
                  <FaEdit
                    title="Editar"
                    style={{ cursor: "pointer", color: "#ffc107", marginRight: "10px" }}
                    onClick={() => editarProduto(produto)}
                  />
                  <FaTrash
                    title="Excluir"
                    style={{ cursor: "pointer", color: "#dc3545" }}
                    onClick={() => {
                      const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
                      if (confirmar) {
                        removerProduto(produto._id);
                      }
                    }}
                  />
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
