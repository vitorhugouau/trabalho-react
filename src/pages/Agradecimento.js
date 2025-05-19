import { useLocation, useNavigate } from "react-router-dom";

export default function Agradecimento() {
  const location = useLocation();
  const navigate = useNavigate();
  const nome = location.state || "Cliente";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1e293b",
        color: "#fff",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        Obrigado pela sua compra, {nome}! 🎉
      </h1>
      <p style={{ fontSize: "20px", marginBottom: "30px" }}>
        Sua venda foi registrada com sucesso. Esperamos te ver novamente!
      </p>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/painel")}
      >
        Voltar para o painel
      </button>
    </div>
  );
}
