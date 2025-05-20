import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./../styles/Agradecimento.css";

export default function Agradecimento() {
  const location = useLocation();
  const navigate = useNavigate();
  const nome = location.state || "Cliente";

  return (
     <div className="agradecimento-container">
      <FaCheckCircle className="icon-sucesso" />
      <h1>Obrigado pela sua compra, {nome}! 🎉</h1>
      <p>
        Sua venda foi registrada com sucesso. Esperamos te ver novamente!
      </p>
      <button onClick={() => navigate("/painel")}>
        Voltar para o painel
      </button>
    </div>
  );
}
