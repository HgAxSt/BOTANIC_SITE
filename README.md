# 🌱 Catálogo Botânico Lo-Fi

Um catálogo de plantas full-stack com uma estética lo-fi aconchegante.

Este é um projeto completo que usa HTML/CSS/JS no frontend e um backend com Node.js, Express e MongoDB para servir os dados de forma dinâmica.

## ✨ Funcionalidades

* Interface com design lo-fi, responsiva e interativa.
* API RESTful para buscar e filtrar plantas.
* Filtros dinâmicos que rodam no backend (eficiência).

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **Banco de Dados:** MongoDB (com Mongoose)

---

## 🚀 Como Rodar o Projeto

Você precisará de duas coisas:
1.  Um banco de dados MongoDB Atlas (é gratuito).
2.  O Node.js instalado na sua máquina.

### 1. Backend

```bash
# 1. Navegue para a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Crie seu próprio arquivo .env
# (Copie o .env.example e adicione sua string de conexão do MongoDB)

# 4. Inicie o servidor (ele rodará em http://localhost:3000)
node server.js