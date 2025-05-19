import { useState } from "react";
import Voltar from "../../components/Voltar";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import axios from "axios";
import { urlApi } from "../../url";
import './../../styles/Admin/EditarCategoria.css';
import { FaCheck, FaTimes } from "react-icons/fa";


export default function EditarCategoria() {
  const token = localStorage.getItem("TOKEN");

  const navigate = useNavigate();
  const location = useLocation();
  const categoria = location.state?.categoria;

  const [nome, setNome] = useState(categoria ? categoria.nome : "");
  const [loading, setLoading] = useState(false);

  const editaOuCriaCategoria = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (categoria) {
        await axios.put(
          `${urlApi}/categorias`,
          {
            id: categoria._id,
            nome_categoria: nome,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${urlApi}/categorias`,
          {
            nome_categoria: nome,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      navigate("/categorias");
      alert("Categoria atualizada com sucesso!");
    } catch (e) {
      console.log(e);
      alert("Erro ao atualizar categoria.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="editar-categoria">
      <h1>{categoria ? `Editar Categoria: ${categoria.nome}` : "Criar Categoria"}</h1>

      <form onSubmit={editaOuCriaCategoria} className="form-categoria">
        <div className="input-group">
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            type="text"
            value={nome ?? ""}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da categoria"
          />
        </div>

        <div className="botoes">
          <button type="submit" className="botao-salvar">
            <FaCheck style={{ marginRight: "6px" }} />
            Salvar
          </button>
          <button type="button" className="botao-cancelar" onClick={() => window.history.back()}>
            <FaTimes style={{ marginRight: "6px" }} />
            Cancelar
          </button>
        </div>
      </form>

      <Voltar />
    </div>
  );
}
