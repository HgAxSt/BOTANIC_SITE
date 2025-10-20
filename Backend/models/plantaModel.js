// Importa o mongoose
const mongoose = require('mongoose');

// Cria uma variável para o Schema
const Schema = mongoose.Schema;

// Define o "molde" (Schema) da nossa planta
// Estamos dizendo quais campos uma planta terá e quais os tipos de dados
const plantaSchema = new Schema({
    nome: {
        type: String,
        required: true // O campo é obrigatório
    },
    luz: {
        type: String,
        required: true
    },
    rega: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
        required: true 
    }
});

// Cria e exporta o "Model"
// O Mongoose vai criar (ou usar) uma coleção no banco chamada "plantas" (ele coloca no plural)
// Agora podemos usar este "Planta" em outros arquivos para criar, ler, atualizar e deletar plantas
module.exports = mongoose.model('Planta', plantaSchema);