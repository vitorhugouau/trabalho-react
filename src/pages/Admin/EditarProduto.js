import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./../../styles/Admin/EditarProduto.css";
import axios from "axios";
import { urlApi } from "../../url";
import Loading from "../../components/Loading";

export default function EditarProduto() {
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();
  const location = useLocation();
  const produto = location.state?.produto;

  const [nome, setNome] = useState(produto?.nome ?? "");
  const [categoria, setCategoria] = useState(produto?.categoria ?? "");
  const [categorias, setCategorias] = useState([]);
  const [quantidade, setQuantidade] = useState(produto?.quantidade ?? 0);
  const [preco, setPreco] = useState(produto?.preco ?? 0);
  const [imagem, setImagem] = useState(produto?.imagem ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [loading, setLoading] = useState(false);

  const editaOuCriaProduto = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dados = { nome, quantidade, preco, imagem, descricao, categoria };

    if (Object.values(dados).some((v) => v === "" || v === null)) {
      alert("Preencha todos os campos");
      setLoading(false);
      return;
    }

    if (dados.preco < 0 || dados.quantidade < 0) {
      alert("Valores inválidos");
      setLoading(false);
      return;
    }

    try {
      if (produto) {
        await axios.put(
          `${urlApi}/produtos`,
          { id: produto._id, ...dados },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(`${urlApi}/produtos`, dados, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      alert("Produto salvo com sucesso!");
      navigate("/produtos");
    } catch (err) {
      console.log(err);
      alert("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  const buscaCategorias = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${urlApi}/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias(res.data);
    } catch (err) {
      console.log(err);
      alert("Erro ao buscar categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscaCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="editar-produto">
      <h1>{produto ? `Editar produto: ${produto.nome}` : "Criar produto"}</h1>

      <form onSubmit={editaOuCriaProduto}>
        <div className="input-row">
          <label>
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>

          <label>
            Quantidade:
            <input
              type="number"
              min={0}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="input-row">
          <label>
            Categoria:
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="input-row">
          <label>
            Preço:
            <input
              type="number"
              min={0}
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
            />
          </label>

          <label>
            Imagem (URL):
            <input
              type="text"
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
            />
          </label>
        </div>

        <label>
          Descrição:
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        {imagem && <img src={imagem} alt="Prévia do Produto" />}

        <div className="botoes">
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => navigate("/produtos")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
