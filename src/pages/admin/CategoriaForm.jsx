import { useState } from 'react';
import { useCategoria } from '../../contexts/CategoriaContext';
import './CategoriasForm.css';
import { useNavigate } from 'react-router-dom';

export default function CategoriaForm() {
  const { adicionarCategoria, listarCategorias } = useCategoria();
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    try {
      await adicionarCategoria({ nome });
      listarCategorias();
      setNome('');
      setError('');
      setSuccess('Categoria adicionada com sucesso!');
    } catch (err) {
      setError('Erro ao adicionar categoria.');
      setSuccess('');
    }
  };

  const handleVoltar = () => {
    navigate('/admin/categorias');
  };

  return (
    <div className="categoria-form-container">
      <h2 className="categoria-title">Adicionar Categoria</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Categoria"
          className="input-field"
          required
        />
        <button type="submit" className="submit-button">
          <i className="fas fa-plus"></i> Adicionar
        </button>
      </form>
        <button onClick={handleVoltar} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </button>
    </div>
  );
}
