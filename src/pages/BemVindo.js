import { Link, useNavigate } from "react-router-dom";
import "./../styles/BemVindo.css";
import { useState } from "react";
import axios from "axios";
import { urlApi } from "../url";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaUsers } from "react-icons/fa";

export default function BemVindo() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUsuario = async () => {
    if (!usuario || !senha) {
      alert("Preencha todos os campos");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${urlApi}/login`, {
        usuario,
        senha,
      });

      if (response?.data?.erro) {
        alert(response?.data?.erro);
        return;
      }

      localStorage.setItem("TOKEN", response?.data?.token);
      localStorage.setItem("USUARIO", usuario);
      navigate("/dashboard");
    } catch (e) {
      alert("Erro ao fazer login");
      console.log(e);
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
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="bemvindo">
      <h1>Painel Administrativo</h1>
      <form className="formulario" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>
            <FaUser /> Login
          </label>
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input"
            placeholder="Digite seu Login"
            type="text"
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>
            <FaLock /> Senha
          </label>
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input"
            placeholder="Digite sua Senha"
            type="password"
            autoComplete="current-password"
          />
        </div>
        <div>
          <button className="botao" onClick={loginUsuario}>
            <FaSignInAlt style={{ marginRight: '8px' }} /> Entrar
          </button>
        </div>
        <p className="mensagem">
          ou{" "}
          <Link to="/registrar" className="link-a">
            <FaUserPlus style={{ marginRight: '4px' }} />
            fazer cadastro
          </Link>
        </p>
      </form>
      <Link className="cliente-link" to="/painel">
        <FaUsers style={{ marginRight: '8px' }} />
        Entrar como cliente
      </Link>
    </div>
  );
}
