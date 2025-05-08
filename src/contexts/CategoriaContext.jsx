import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const CategoriaContext = createContext();

export function useCategoria() {
  return useContext(CategoriaContext);
}

export function CategoriaProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para listar categorias
  const listarCategorias = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/categorias');  // Alterar para o endpoint correto
      setCategorias(response.data);  // Assume que o backend retorna uma lista de categorias
    } catch (err) {
      setError("Erro ao carregar categorias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para excluir uma categoria
  const deletarCategoria = async (id) => {
    try {
      await api.delete(`/categorias/${id}`);
      setCategorias((prevCategorias) =>
        prevCategorias.filter((categoria) => categoria.id !== id)
      );
    } catch (err) {
      setError("Erro ao excluir categoria");
      console.error(err);
    }
  };

  return (
    <CategoriaContext.Provider value={{ categorias, listarCategorias, deletarCategoria, loading, error }}>
      {children}
    </CategoriaContext.Provider>
  );
}
