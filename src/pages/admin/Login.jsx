import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Importe o contexto de autenticação
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth(); // Pega a função de login
  const [usuario, setUsuario] = useState(''); // Armazenando usuario
  const [senha, setSenha] = useState(''); // Armazenando senha
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tenta fazer login e navega para o dashboard após sucesso
      await login({ usuario, senha });
      navigate('/admin/dashboard'); // Navegação para o dashboard
    } catch (error) {
      alert('Credenciais inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Usuário"
      />
      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
