import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './RegisterForm.css';

const Registro = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!senha || !confirma) {
      setError('Por favor, preencha ambos os campos de senha.');
      return;
    }

    if (senha !== confirma) {
      setError('As senhas não coincidem');
      return;
    }

    try {

      const response = await api.post('/app/registrar', { usuario, senha, confirma });

      if (response.status === 200) {
        
        navigate('/admin/login');
      }
    } catch (error) {
      setError('Erro ao registrar. Tente novamente.');
      console.error(error);
    }
  };
  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  return (
    <div className="register-form">
      <h2><i className="fas fa-user-plus"></i> Cadastro</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
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

        <div className="input-group">
          <label htmlFor="confirma"><i className="fas fa-lock"></i></label>
          <input
            id="confirma"
            type="password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            placeholder="Confirmar Senha"
            required
          />
        </div>

        <button type="submit">
          <i className="fas fa-check"></i> Registrar
        </button>
      </form>

      <button
        type="button"
        className="login-redirect-button"
        onClick={handleLoginRedirect}
      >
        Já tem uma conta? <i className="fas fa-sign-in-alt"></i> Login
      </button>
    </div>
  );
}

export default Registro;