import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaCheckCircle, 
  FaShoppingBag, 
  FaArrowLeft, 
  FaHeart,
  FaStar 
} from "react-icons/fa";
import "./../styles/Agradecimento.css";
import { useEffect } from "react";

export default function Agradecimento() {
  const location = useLocation();
  const navigate = useNavigate();
  const nome = location.state || "Cliente";

  useEffect(() => {
    // Trigger confetti animation on mount
    const confetti = Array.from({ length: 50 }, (_, i) => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.setProperty('--delay', `${Math.random() * 5}s`);
      confetti.style.setProperty('--x', `${Math.random() * 100}vw`);
      confetti.style.setProperty('--rotation', `${Math.random() * 360}deg`);
      return confetti;
    });

    const container = document.querySelector('.agradecimento-container');
    confetti.forEach(c => container.appendChild(c));

    return () => {
      confetti.forEach(c => c.remove());
    };
  }, []);

  return (
    <div className="agradecimento-container">
      <div className="success-icon-wrapper">
        <FaCheckCircle className="icon-sucesso" />
        <div className="success-rings"></div>
      </div>
      
      <h1>
        <FaStar className="star-icon" />
        Obrigado pela sua compra, {nome}!
        <FaStar className="star-icon" />
      </h1>
      
      <div className="message-container">
        <FaShoppingBag className="message-icon" />
        <p>
          Sua venda foi registrada com sucesso. Esperamos te ver novamente!
        </p>
        <FaHeart className="message-icon heart-icon" />
      </div>

      <button onClick={() => navigate("/painel")} className="return-button">
        <FaArrowLeft className="button-icon" />
        <span>Voltar para o painel</span>
      </button>
    </div>
  );
}
