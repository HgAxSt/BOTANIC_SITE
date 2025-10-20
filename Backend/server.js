// 1. IMPORTAÇÕES
// Importa as ferramentas que vamos usar
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Planta = require("./models/plantaModel");
//---------------------------------------------------------------------------------------------------------------------------------------

// 2. CONFIGURAÇÕES INICIAIS
// Cria o "aplicativo" do servidor
const app = express();

//define a porta onde o servidor vai rodar. Pegamos do .env ou usamos 3000 como padrão
const PORT = process.env.PORT || 3000;

// Pega a string de conexão de dentro do arquivo .env
const MONGO_URI = process.env.MONGO_URI;

//---------------------------------------------------------------------------------------------------------------------------------------

// 3. MIDDLEWARES
// Configura o CORS para permitir que nosso frontend acesse este backend
app.use(cors());
// Configura o Express para entender JSON (o formato de dados que vamos usar)
app.use(express.json());


//---------------------------------------------------------------------------------------------------------------------------------------

// 4. ROTA DE TESTE
// ROTA [GET] /api/plantas
// Objetivo: Buscar as plantas do banco DE ACORDO COM OS FILTROS
app.get('/api/plantas', async (req, res) => {

    console.log('Recebido pedido GET em /api/plantas');
    console.log('Query Params recebidos:', req.query); // Mostra os filtros

    try {
        // 1. Cria um objeto de "query" (consulta) vazio
        const filtros = {};

        // 2. Verifica se cada filtro veio na URL (req.query) e adiciona ao objeto
        // (Ex: se a URL for /api/plantas?luz=sol-pleno)

        if (req.query.luz) {
            filtros.luz = req.query.luz;
            // -> filtros vai ser { luz: 'sol-pleno' }
        }

        if (req.query.rega) {
            filtros.rega = req.query.rega;
            // -> filtros pode ser { luz: 'sol-pleno', rega: 'baixa' }
        }

        if (req.query.tipo) {
            filtros.tipo = req.query.tipo;
        }

        // Filtro especial para a busca de texto
        if (req.query.busca) {
            // $regex: "Procura por qualquer texto que contenha o valor de 'busca'"
            // $options: 'i': "Ignora maiúsculas/minúsculas (case-insensitive)"
            filtros.nome = { $regex: req.query.busca, $options: 'i' };
        }

        // 3. Usa o Model "Planta" para encontrar (.find())
        // Em vez de .find() vazio, passamos o objeto "filtros"
        // Se "filtros" estiver vazio {}, ele busca tudo.
        // Se for { luz: 'sol-pleno' }, ele busca SÓ as de sol pleno.
        const plantas = await Planta.find(filtros); 

        // 4. Envia a resposta (agora filtrada!)
        res.status(200).json(plantas);

    } catch (error) {
        // 5. Se der algum erro no banco, envia uma mensagem de erro
        console.error('Erro ao buscar plantas:', error.message);
        res.status(500).json({ message: 'Erro ao buscar plantas', error: error.message });
    }
});
// ROTA [POST] /api/plantas
// Objetivo: Adicionar uma NOVA planta ao banco de dados

app.post("/api/plantas", async (req, res) => {
  console.log("Recebido pedido POST em /api/plantas"); // Log
  console.log("Dados recebidos:", req.body); // Mostra os dados que o usuário enviou

  try {
    // 1. Pega todos os dados do "corpo" (body) do pedido
    // (Nosso app.use(express.json()) lá em cima já preparou o req.body para nós)
    const { nome, luz, rega, tipo, descricao, imagem } = req.body;
    // 2. Tenta criar uma nova planta no banco com esses dados
    // O "await" espera a operação terminar
    const novaPlanta = await Planta.create({
      nome,
      luz,
      rega,
      tipo,
      descricao,
      imagem,
    });

    res.status(201).json(novaPlanta);
  } catch (error) {
    // 4. Se der erro (ex: um campo obrigatório faltou)
    // O status(400) significa "Bad Request" (Pedido inválido)
    console.error("Erro ao criar planta:", error.message);
    res
      .status(400)
      .json({ message: "Erro ao criar planta", error: error.message });
  }
});

//---------------------------------------------------------------------------------------------------------------------------------------
// 5. CONEXÃO COM O BANCO DE DADOS E INICIALIZAÇÃO DO SERVIDOR
// Tenta conectar ao MongoDB Atlas
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado ao MongoDB Atlas!");

    // Se a conexão for um sucesso, "liga" o servidor para ouvir os pedidos
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Acesse http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Se der erro na conexão, exibe o erro no console
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
  });
//---------------------------------------------------------------------------------------------------------------------------------------
