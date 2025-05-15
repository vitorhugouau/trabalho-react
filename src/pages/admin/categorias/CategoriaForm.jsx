import { useState } from 'react';
import { useCategoria } from '../../../contexts/CategoriaContext';
import './CategoriasForm.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const CategoriaForm = () => {
  // const { adicionarCategoria, listarCategorias } = useCategoria();
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const listarCategorias = async () => {
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
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    setError(null)

    console.log("Aaaaaaaaaaaaaaaa")

    if (!nome.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }
    try {
      await api.post('/app/categorias', {
        nome_categoria: nome
      })
      alert("caiu")
    } catch (err) {
      setError("Erro ao carregar categorias");
      console.error(err);
    }finally{
      setLoading(false)
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

      <div>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Categoria"
          className="input-field"
          required
        />
        <button onClick={handleSubmit} type="submit" className="submit-button">
          <i className="fas fa-plus"></i> Adicionar
        </button>
      </div>
        <button onClick={handleVoltar} className="back-button">
          <i className="fas fa-arrow-left"></i> Voltar
        </button>
    </div>
  );
}

export default CategoriaForm;