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
  endereço: String,
  numero: {
    type: Number,
    required: [true, 'Digite o número da loja!'],
  },
  complemento: String,
  bairro: String,
  localidade: String,
  uf: String,
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
  },
});

storeSchema.index({ location: '2dsphere' });

const Store = mongoose.model('Store', storeSchema);

export default Store;
