import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import axios from "axios";
import "./EditarProdutos.css";
import { Save, X, Image, FileText, Package, DollarSign, Layers } from "lucide-react";

const ProdutosForm = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const produto = navigate.state?.produto;

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
        await api.put(
          `/app/produtos`,
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
        await api.post(`/app/produtos`,{
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
      navigate("/admin/produtos");
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
    <div className="editar-produto-container">
      <h1 className="titulo">
        <Package className="icon" />
        {produto ? `Editar produto: ${produto.nome}` : "Criar produto"}
      </h1>

      <form onSubmit={handleSubmit} className="formulario">
        <div className="linha">
          <label>
            <FileText className="icon" /> Nome:
            <input
              type="text"
              value={nome ?? ""}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>

          <label>
            <Layers className="icon" /> Quantidade:
            <input
              type="number"
              value={quantidade ?? 0}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </label>
        </div>

        <div className="linha">
          <label>
            <DollarSign className="icon" /> Preço:
            <input
              type="number"
              value={preco ?? 0}
              onChange={(e) => setPreco(e.target.value)}
            />
          </label>

          <label>
            <Image className="icon" /> Imagem (URL):
            <input
              type="text"
              value={imagem ?? ""}
              onChange={(e) => setImagem(e.target.value)}
            />
          </label>
        </div>

        <label className="descricao-label">
          <FileText className="icon" /> Descrição:
          <textarea
            value={descricao ?? ""}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        {imagem && (
          <div className="preview">
            <p>Pré-visualização:</p>
            <img src={imagem} alt="Pré-visualização" />
          </div>
        )}

        <div className="botoes">
          <button type="submit" className="botao salvar">
            <Save className="icon" /> Salvar
          </button>
          <button
            type="button"
            className="botao cancelar"
            onClick={() => window.history.back()}
          >
            <X className="icon" /> Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProdutosForm;