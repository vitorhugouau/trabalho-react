import { Link } from "react-router-dom";
import './styles/Voltar.css';

export default function Voltar() {
  return (
    <div>
      <Link to="/dashboard" className="voltar">Voltar</Link>
    </div>
  );
}
