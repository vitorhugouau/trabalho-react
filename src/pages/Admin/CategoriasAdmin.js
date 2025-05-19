import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import { urlApi } from "../../url";
import Voltar from "../../components/Voltar";
import "./../../styles/Admin/CategoriasAdmin.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function CategoriasAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarCategorias = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${urlApi}/categorias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setCategorias(response.data);
    } catch (e) {
      console.log(e);
      alert("Erro ao buscar categorias");
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

  const removerCategoria = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${urlApi}/categorias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      });
      buscarCategorias();
      alert("Categoria deletada com sucesso!");
    } catch (e) {
      console.log(e);
      alert("Erro ao deletar categoria.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="categorias-admin">
      <div className="header-titulo-cat">
        <h1>Categorias</h1>
        <button className="botao-add" onClick={criarCategoria}>
          <FaPlus /> Nova Categoria
        </button>
      </div>

      <div className="tabela-container">
        <table className="tabela-categorias">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Usuário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat._id}>
                <td>{cat._id}</td>
                <td>{cat.nome}</td>
                <td>{cat.usuario}</td>
                <td>
                  <button
                    className="botao-acao editar"
                    onClick={() => editarCategoria(cat)}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    className="botao-acao excluir"
                    onClick={() => {
                      const confirmar = window.confirm(
                        "Tem certeza que deseja excluir esta categoria?"
                      );
                      if (confirmar) {
                        removerCategoria(cat._id);
                      }
                    }}
                  >
                    <FaTrash /> Excluir
                  </button>
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
