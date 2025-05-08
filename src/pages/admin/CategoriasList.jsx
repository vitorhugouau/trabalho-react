import { useEffect } from 'react';
import { useCategoria } from '../../contexts/CategoriaContext';
import { useNavigate } from 'react-router-dom'; // Importando o useNavigate
import './CategoriasList.css'; // Estilo da página

export default function CategoriasList() {
  const { categorias, listarCategorias, deletarCategoria, loading, error } = useCategoria();
  const navigate = useNavigate(); // Usando o useNavigate

  useEffect(() => {
    listarCategorias();
  }, [listarCategorias]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleAddCategoria = () => {
    navigate('/admin/categorias/adicionar'); 
  };

  const handleVoltar = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="categoria-container">
      <h2 className="categoria-title">Lista de Categorias</h2>
      <ul className="categoria-list">
        {categorias && categorias.length > 0 ? (
          categorias.map((categoria) => (
            <li key={categoria.id} className="categoria-item">
              <span>{categoria.nome}</span>
              <button 
                className="categoria-button delete-button" 
                onClick={() => deletarCategoria(categoria.id)}>
                <i className="fas fa-trash-alt"></i> Excluir
              </button>
            </li>
          ))
        ) : (
          <p>Não há categorias disponíveis.</p>
        )}
      </ul>

      {/* Botão para adicionar uma nova categoria */}
      <button className="categoria-button add-button" onClick={handleAddCategoria}>
        <i className="fas fa-plus-circle"></i> Adicionar Categoria
      </button>
      <button onClick={handleVoltar} className="back-button">
        <i className="fas fa-arrow-left"></i> Voltar
      </button>
    </div>
  );
}
