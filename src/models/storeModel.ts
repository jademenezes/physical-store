import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Loja deve ter um nome!'],
    trim: true,
  },
  cep: {
    type: Number,
    required: [true, 'Digite um CEP para a loja!'],
  },
  numero: {
    type: Number,
    required: [true, 'Digite o número da loja!'],
  },
  complemento: String,
});

const Store = mongoose.model('Store', storeSchema);

export default Store;
