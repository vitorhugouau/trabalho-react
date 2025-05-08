import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Registro() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se os campos de senha e confirmação não estão vazios
    if (!senha || !confirma) {
      setError('Por favor, preencha ambos os campos de senha.');
      return;
    }

    // Verifica se as senhas coincidem
    if (senha !== confirma) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      // Envia a requisição para registrar o usuário
      const response = await api.post('/app/registrar', { usuario, senha, confirma });

      if (response.status === 200) {
        // Redireciona para o login após registro bem-sucedido
        navigate('/admin/login');
      }
    } catch (error) {
      setError('Erro ao registrar. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuário"
          required
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />
        <input
          type="password"
          value={confirma}
          onChange={(e) => setConfirma(e.target.value)}
          placeholder="Confirmar Senha"
          required
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}
