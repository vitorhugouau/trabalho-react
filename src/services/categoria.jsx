import api from './api'; 

const categoriaService = {
  listar: async () => {
    return await api.get('/categorias');
  },

  criar: async (dados) => {
    return await api.post('/categorias', dados);
  },

  atualizar: async (id, dados) => {
    return await api.put(`/categorias/${id}`, dados);
  },

  deletar: async (id) => {
    return await api.delete(`/categorias/${id}`);
  },
};

export default categoriaService;
