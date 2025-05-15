import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Voltar from "../../components/Voltar";
import "./../../styles/Admin/EditarProduto.css";
import axios from "axios";
import { urlApi } from "../../url";
import Loading from "../../components/Loading";

export default function EditarProduto() {
  const token = localStorage.getItem("TOKEN");

  const navigate = useNavigate();

  const location = useLocation();
  const produto = location.state?.produto;

  const [nome, setNome] = useState(produto ? produto.nome : '');
  const [quantidade, setQuantidade] = useState(produto ? produto.quantidade : 0);
  const [preco, setPreco] = useState(produto ? produto.preco : 0);
  const [imagem, setImagem] = useState(produto ? produto.imagem : '');
  const [descricao, setDescricao] = useState(produto ? produto.descricao : '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dadosAtualizados = {
      nome,
      quantidade,
      preco,
      imagem,
      descricao,
    };

    try {
      if (produto) {
        await axios.put(
          `${urlApi}/produtos`,
          {
            id: produto._id,
            nome: dadosAtualizados.nome,
            quantidade: dadosAtualizados.quantidade,
            preco: dadosAtualizados.preco,
            descricao: dadosAtualizados.descricao,
            imagem: dadosAtualizados.imagem,
            categoria: "Categoria teste",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${urlApi}/produtos`,
          {
            nome: dadosAtualizados.nome,
            quantidade: dadosAtualizados.quantidade,
            preco: dadosAtualizados.preco,
            descricao: dadosAtualizados.descricao,
            imagem: dadosAtualizados.imagem,
            categoria: "Categoria teste",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      navigate("/produtos");
      alert("Produto atualizado com sucesso!");
    } catch (e) {
      console.log(e);
      alert("Erro ao atualizar produto.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="editar-produto">
      {produto ? (
        <h1>Editar produto: {produto.nome}</h1>
      ) : (
        <h1>Criar produto</h1>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-row">
          <label>
            Nome:
            <input
              type="text"
              value={nome ?? ""}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>

          <label>
            Quantidade:
            <input
              type="number"
              value={quantidade ?? 0}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </label>
        </div>

        <div className="input-row">
          <label>
            Preço:
            <input
              type="number"
              value={preco ?? 0}
              onChange={(e) => setPreco(e.target.value)}
            />
          </label>

          <label>
            Imagem (URL):
            <input
              type="text"
              value={imagem ?? ""}
              onChange={(e) => setImagem(e.target.value)}
            />
          </label>
        </div>

        <label>
          Descrição:
          <textarea
            value={descricao ?? ""}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        {imagem && (
          <img src={imagem} alt="Pré-visualização" style={{ width: "200px" }} />
        )}

        <div className="botoes">
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => window.history.back()}>
            Cancelar
          </button>
        </div>
      </form>

      <Voltar />
    </div>
  );
}