import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 

export default function Login() {
  const { login } = useAuth(); 
  const [usuario, setUsuario] = useState(''); 
  const [senha, setSenha] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await login({ usuario, senha });
      navigate('/admin/dashboard'); 
    } catch (error) {
      alert('Credenciais inválidas');
    }
  };

  const handleRegister = () => {
    navigate('/registro'); 
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2><i className="fas fa-sign-in-alt"></i> Login</h2>

      <div className="input-group">
        <label htmlFor="usuario"><i className="fas fa-user"></i></label>
        <input
          id="usuario"
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuário"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="senha"><i className="fas fa-lock"></i></label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />
      </div>

      <button type="submit">
        <i className="fas fa-arrow-right"></i> Entrar
      </button>

      <button
        type="button"
        className="register-button"
        onClick={handleRegister}
      >
        <i className="fas fa-user-plus"></i> Registrar
      </button>
    </form>
  );
}
