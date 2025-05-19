import { useState } from "react";
import "./../styles/Registrar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock, FaKey } from "react-icons/fa";
import { urlApi } from "../url";

export default function Registrar() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registraUsuario = async () => {
    if (!usuario || !senha || !confirmaSenha) {
      alert("Preencha todos os campos");
      return;
    }

    if (senha !== confirmaSenha) {
      alert("Senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${urlApi}/registrar`, {
        usuario,
        senha,
        confirma: confirmaSenha,
      });

      if (response?.data?.erro) {
        alert(response?.data?.erro);
        return;
      }

      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (e) {
      alert("Erro ao fazer cadastro");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="registrar">
      <h1>Cadastrar no Painel Administrativo</h1>
      <form className="formulario" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>
            <FaUser /> Login
          </label>
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="input"
            placeholder="Digite seu Login"
            type="text"
          />
        </div>
        <div className="form-group">
          <label>
            <FaLock /> Senha
          </label>
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="input"
            placeholder="Digite sua Senha"
            type="password"
          />
        </div>
        <div className="form-group">
          <label>
            <FaKey /> Confirmar Senha
          </label>
          <input
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
            className="input"
            placeholder="Confirme sua Senha"
            type="password"
          />
        </div>
        <div>
          <button className="botao" onClick={registraUsuario}>
            Registrar
          </button>
        </div>
        <p className="mensagem">
          ou{" "}
          <Link to="/" className="link-a">
            fazer login
          </Link>
        </p>
      </form>
    </div>
  );

}
