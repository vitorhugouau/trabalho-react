
# 🛒 Projeto React - Marketplace (SI 5º Termo)

Este é um projeto de **Marketplace** desenvolvido com **React**, voltado para fins acadêmicos. Ele conta com **duas áreas principais**:

- 🔐 **Área Administrativa** (acesso restrito com login)
- 🛍️ **Área do Cliente** (compra de produtos)

---

## ✨ Funcionalidades

### Área Administrativa 👨‍💼
- Login de acesso 🔐
- CRUD completo de **Produtos** e **Categorias** 📦📂
- Visualização de **vendas realizadas** 💸

### Área do Cliente 🛍️
- Visualização de produtos disponíveis 🧾
- Adição de produtos ao **carrinho de compras** 🛒
- Escolha do **meio de pagamento** 💳
- Preenchimento de **nome do cliente** 🙍
- Tela de **confirmação/agradecimento** após a compra ✅

---

## 🧪 Tecnologias Utilizadas

- ⚛️ [React](https://reactjs.org/)
- ⚡ [Vite](https://vitejs.dev/)
- 🔀 [React Router DOM](https://reactrouter.com/)
- 🔗 [Axios](https://axios-http.com/)

---

## 🔌 Conexão com o Backend

A API utilizada está hospedada em Vercel:

```js
// src/url.js
export const urlApi = 'https://backend-completo.vercel.app/app';
```

Exemplo de requisição GET para listar produtos:

```js
import axios from "axios";
import { urlApi, user } from "../url";

const [produtos, setProdutos] = useState([]);
const [loading, setLoading] = useState(false);

const getProdutos = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${urlApi}/produtos/${user}`);
    setProdutos(response.data);
  } catch (e) {
    console.log(e);
    alert("Erro ao buscar produtos");
  } finally {
    setLoading(false);
  }
};
```

---

## 🔐 Sistema de Rotas

O projeto possui **rotas protegidas** e **rotas públicas**:

- **Rotas Públicas**: acessíveis a qualquer usuário.
- **Rotas Protegidas**: requerem login para acesso à área administrativa.

A proteção das rotas foi implementada por meio de um componente de middleware de autenticação localizado em:

```
src/ProtectedRoute.js
```

---

## 🗂️ Estrutura de Pastas

```
/src
├── components         # Componentes reutilizáveis
│   └── styles         # Estilizações dos componentes
├── pages              # Páginas principais do projeto
│   └── Admin          # Páginas específicas da área Admin
├── styles             # Estilizações das páginas
│   └── Admin          # Estilos específicos da área Admin
```

---

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar o projeto em modo de desenvolvimento
npm start
```

---
