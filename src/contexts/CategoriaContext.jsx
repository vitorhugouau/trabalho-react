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

  const listarCategorias = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/categorias');  
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
