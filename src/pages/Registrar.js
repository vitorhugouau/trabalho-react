import { useState } from "react";
import "./../styles/Registrar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaUser, 
  FaLock, 
  FaKey, 
  FaUserPlus, 
  FaSignInAlt, 
  FaExclamationCircle,
  FaCheckCircle 
} from "react-icons/fa";
import { urlApi } from "../url";

export default function Registrar() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const registraUsuario = async () => {
    if (!usuario || !senha || !confirmaSenha) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (senha !== confirmaSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post(`${urlApi}/registrar`, {
        usuario,
        senha,
        confirma: confirmaSenha,
      });

      if (response?.data?.erro) {
        setError(response.data.erro);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (e) {
      setError(e.response?.data?.erro || "Erro ao fazer cadastro");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      registraUsuario();
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-content">
        <h1>
          <FaUserPlus className="register-title-icon" />
          Criar Conta
        </h1>
        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <div className="register-form-group">
            <label className="register-label">
              <FaUser /> Login
            </label>
            <input
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className="register-input"
              placeholder="Digite seu Login"
              type="text"
              autoComplete="username"
              disabled={loading}
            />
          </div>
          <div className="register-form-group">
            <label className="register-label">
              <FaLock /> Senha
            </label>
            <input
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className="register-input"
              placeholder="Digite sua Senha"
              type="password"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          <div className="register-form-group">
            <label className="register-label">
              <FaKey /> Confirmar Senha
            </label>
            <input
              value={confirmaSenha}
              onChange={(e) => {
                setConfirmaSenha(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className="register-input"
              placeholder="Confirme sua Senha"
              type="password"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="register-error-message">
              <FaExclamationCircle />
              {error}
            </div>
          )}
          {success && (
            <div className="register-success-message">
              <FaCheckCircle />
              Cadastro realizado com sucesso! Redirecionando...
            </div>
          )}
          <div>
            <button 
              className="register-button" 
              onClick={registraUsuario}
              disabled={loading || success}
            >
              <FaUserPlus />
              Criar Conta
            </button>
          </div>
          <p className="register-message">
            Já tem uma conta?{" "}
            <Link to="/" className="register-link">
              <FaSignInAlt />
              Fazer Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
