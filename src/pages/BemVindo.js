import { Link, useNavigate } from "react-router-dom";
import "./../styles/BemVindo.css";
import { useState } from "react";
import axios from "axios";
import { urlApi } from "../url";
import { 
  FaUser, 
  FaLock, 
  FaSignInAlt, 
  FaUserPlus, 
  FaUsers, 
  FaExclamationCircle 
} from "react-icons/fa";

export default function BemVindo() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginUsuario = async () => {
    if (!usuario || !senha) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${urlApi}/login`, {
        usuario,
        senha,
      });

      if (response?.data?.erro) {
        setError(response.data.erro);
        return;
      }

      localStorage.setItem("TOKEN", response?.data?.token);
      localStorage.setItem("USUARIO", usuario);
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.erro || "Erro ao fazer login. Tente novamente.");
      console.error("Erro no login:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loginUsuario();
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
    <div className="login-page">
      <h1>Painel Administrativo</h1>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <div className="login-form-group">
          <label className="login-label">
            <FaUser /> Login
          </label>
          <input
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            className="login-input"
            placeholder="Digite seu Login"
            type="text"
            autoComplete="username"
            disabled={loading}
          />
        </div>
        <div className="login-form-group">
          <label className="login-label">
            <FaLock /> Senha
          </label>
          <input
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            className="login-input"
            placeholder="Digite sua Senha"
            type="password"
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
        {error && (
          <div className="login-error-message">
            <FaExclamationCircle />
            {error}
          </div>
        )}
        <div>
          <button 
            className="login-button" 
            onClick={loginUsuario}
            disabled={loading}
          >
            <FaSignInAlt /> Entrar
          </button>
        </div>
        <p className="login-message">
          ou
          <Link to="/registrar" className="login-link">
            <FaUserPlus />
            fazer cadastro
          </Link>
        </p>
      </form>
      <Link className="login-client-link" to="/painel">
        <FaUsers />
        Entrar como cliente
      </Link>
    </div>
  );
}
