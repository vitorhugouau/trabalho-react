import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./../../styles/Admin/EditarProduto.css";
import axios from "axios";
import { urlApi } from "../../url";
import Loading from "../../components/Loading";
import { 
  ImageIcon, 
  TagIcon, 
  PackageIcon, 
  DollarSignIcon, 
  FileTextIcon, 
  CheckIcon, 
  XIcon,
  AlertTriangleIcon,
  EyeIcon,
  PlusIcon,
  SaveIcon,
  ArrowLeftIcon
} from "lucide-react";

export default function EditarProduto() {
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();
  const location = useLocation();
  const produto = location.state?.produto;

  const [formData, setFormData] = useState({
    nome: produto?.nome ?? "",
    categoria: produto?.categoria ?? "",
    quantidade: produto?.quantidade ?? 0,
    preco: produto?.preco ?? 0,
    imagem: produto?.imagem ?? "",
    descricao: produto?.descricao ?? ""
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'quantidade') {
      processedValue = Math.max(0, parseInt(value) || 0);
    } else if (name === 'preco') {
      processedValue = Math.max(0, parseFloat(value) || 0);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    if (!formData.categoria) {
      newErrors.categoria = "Categoria é obrigatória";
    }
    
    if (formData.quantidade < 0) {
      newErrors.quantidade = "Quantidade não pode ser negativa";
    }
    
    if (formData.preco <= 0) {
      newErrors.preco = "Preço deve ser maior que zero";
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const editaOuCriaProduto = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (produto) {
        await axios.put(
          `${urlApi}/produtos`,
          { id: produto._id, ...formData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(`${urlApi}/produtos`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/produtos");
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Erro ao salvar produto. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const buscaCategorias = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${urlApi}/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
      setErrors({ categorias: "Erro ao buscar categorias." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscaCategorias();
  }, []);

  // Aviso antes de sair se houver mudanças não salvas
  useEffect(() => {
    if (isDirty) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isDirty]);

  if (loading) return <Loading />;

  return (
    <div className="editar-produto">
      <div className="header-container">
        <h1>
          <PackageIcon className="icon-title" />
          {produto ? `Editar produto: ${produto.nome}` : "Novo produto"}
        </h1>
        <div className="header-actions">
          
        </div>
      </div>

      {errors.submit && (
        <div className="error-message">
          <AlertTriangleIcon />
          {errors.submit}
        </div>
      )}

      <form onSubmit={editaOuCriaProduto}>
        <div className="form-container">
          <div className="form-fields">
            <div className="input-row">
              <label className={errors.nome ? 'error' : ''}>
                <TagIcon className="icon" />
                Nome:
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={previewMode}
                  placeholder="Nome do produto"
                />
                {errors.nome && <span className="error-text">{errors.nome}</span>}
              </label>

              <label className={errors.quantidade ? 'error' : ''}>
                <PackageIcon className="icon" />
                Quantidade:
                <input
                  type="number"
                  name="quantidade"
                  min={0}
                  value={formData.quantidade}
                  onChange={handleChange}
                  disabled={previewMode}
                  placeholder="0"
                />
                {errors.quantidade && <span className="error-text">{errors.quantidade}</span>}
              </label>
            </div>

            <div className="input-row">
              <label className={errors.categoria ? 'error' : ''}>
                <TagIcon className="icon" />
                Categoria:
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  disabled={previewMode}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.nome}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
                {errors.categoria && <span className="error-text">{errors.categoria}</span>}
              </label>

              <label className={errors.preco ? 'error' : ''}>
                <DollarSignIcon className="icon" />
                Preço:
                <input
                  type="number"
                  name="preco"
                  min={0}
                  step="0.01"
                  value={formData.preco}
                  onChange={handleChange}
                  disabled={previewMode}
                  placeholder="0.00"
                />
                {errors.preco && <span className="error-text">{errors.preco}</span>}
              </label>
            </div>

            <label className={errors.imagem ? 'error' : ''}>
              <ImageIcon className="icon" />
              Imagem (URL):
              <input
                type="text"
                name="imagem"
                value={formData.imagem}
                onChange={handleChange}
                disabled={previewMode}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </label>

            <label className={errors.descricao ? 'error' : ''}>
              <FileTextIcon className="icon" />
              Descrição:
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                disabled={previewMode}
                placeholder="Descrição detalhada do produto"
              />
              {errors.descricao && <span className="error-text">{errors.descricao}</span>}
            </label>
          </div>

          {(formData.imagem || previewMode) && (
            <div className="preview-container">
              <h3>
                <EyeIcon className="icon" />
                Prévia do Produto
              </h3>
              <div className="preview-card">
                <img 
                  src={formData.imagem || "/img/sem-imagem.jpg"} 
                  alt="Prévia do Produto"
                  onError={(e) => {
                    e.target.src = "/img/sem-imagem.jpg";
                  }}
                />
                <div className="preview-info">
                  <h4>{formData.nome || "Nome do Produto"}</h4>
                  <span className="categoria-tag">{formData.categoria || "Categoria"}</span>
                  <p className="descricao-preview">{formData.descricao || "Descrição do produto"}</p>
                  <div className="preview-details">
                    <span className="preco">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(formData.preco)}
                    </span>
                    <span className={`quantidade-badge ${formData.quantidade < 10 ? 'baixo' : 'normal'}`}>
                      {formData.quantidade} unidades
                      {formData.quantidade < 10 && <AlertTriangleIcon className="warning-icon" />}
                      {formData.quantidade >= 10 && <CheckIcon className="check-icon" />}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="botoes">
          <button type="button" onClick={() => navigate("/produtos")} className="btn-cancelar">
            <ArrowLeftIcon className="icon-button" /> Voltar
          </button>
          <button type="submit" className="btn-salvar" disabled={previewMode}>
            {produto ? (
              <>
                <SaveIcon className="icon-button" /> Salvar Alterações
              </>
            ) : (
              <>
                <PlusIcon className="icon-button" /> Criar Produto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
