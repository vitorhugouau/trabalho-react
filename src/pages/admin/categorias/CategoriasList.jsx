import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriasList.css';
import api from '../../../services/api';

const CategoriasList = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/app/categorias');
      setCategorias(response.data);
    } catch (err) {
      setError("Erro ao carregar categorias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletarCategoria = async (id) => {
    try {
      await api.delete(`/app/categorias/${id}`);
      setCategorias((prevCategorias) =>
        prevCategorias.filter((categoria) => categoria.id !== id)
      );
    } catch (err) {
      setError("Erro ao excluir categoria");
      console.error(err);
    }
  };

  useEffect(() => {
    listarCategorias();
  }, [listarCategorias]);

  const handleAddCategoria = () => {
    navigate('/admin/categorias/adicionar');
  };

  const handleVoltar = () => {
    navigate('/admin/dashboard');
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="categoria-container">
      <h2 className="categoria-title">Lista de Categorias</h2>

      <ul className="categoria-list">
        {categorias.length > 0 ? (
          categorias.map((categoria) => (
            <li key={categoria.id} className="categoria-item">
              <span>{categoria.nome}</span>
            </li>
          ))
        ) : (
          <li className="categoria-item">Não há categorias disponíveis.</li>
        )}
      </ul>
      <button
        className="categoria-button delete-button"
        onClick={() => deletarCategoria(categoria.id)}
      >
        <i className="fas fa-trash-alt"></i> Excluir
      </button>

      <button className="categoria-button add-button" onClick={handleAddCategoria}>
        <i className="fas fa-plus-circle"></i> Adicionar Categoria
      </button>

      <button className="back-button" onClick={handleVoltar}>
        <i className="fas fa-arrow-left"></i> Voltar
      </button>
    </div>
  );
};

export default CategoriasList;
