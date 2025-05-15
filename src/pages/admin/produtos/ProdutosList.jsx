import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const ProdutosList = () => {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const listarProdutos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/app/produtos');
            setProdutos(response.data);
        } catch (err) {
            setError("Error ao carregar produtos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletarProdutos = async (id) => {
        try {
            await api.delete(`/app/produtos${id}`);
            setprodutos((prevProdutos) =>
                prevprodutos.filter((produtos) => produtoForm.id !== id)
            );
        } catch (err) {
            setError("Erro ao excluir produtos");
            console.log(err)
        }
    };

useEffect(() => {
    listarProdutos();
}, [listarProdutos]);

const HandleAddproduto = () => {
    navigate('admin/produtos/adicionar');
};

const handleVoltar = () => {
    navigate('admin/dashboard');
};

if (error){
    return <p>{error}</p>
}

return (
    <div className="produto-container">
      <h2 className="produto-title">Lista de produtos</h2>

      <ul className="produto-list">
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <li key={produto.id} className="produto-item">
              <span>{produto.nome}</span>
            </li>
          ))
        ) : (
          <li className="produto-item">Não há produtos disponíveis.</li>
        )}
      </ul>
      <button
        className="produto-button delete-button"
        onClick={() => deletarproduto(produto.id)}
      >
        <i className="fas fa-trash-alt"></i> Excluir
      </button>

      <button className="produto-button add-button" onClick={handleAddproduto}>
        <i className="fas fa-plus-circle"></i> Adicionar produto
      </button>

      <button className="back-button" onClick={handleVoltar}>
        <i className="fas fa-arrow-left"></i> Voltar
      </button>
    </div>
  );
};

export default produtosList;


