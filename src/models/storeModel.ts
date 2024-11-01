import mongoose from 'mongoose';
import Adress from '../types/addressInterface';
import Store from '../types/storeInterface';

//Schema para endereço
const addressSchema = new mongoose.Schema<Adress>({
  logradouro: {
    type: String,
    required: true,
  },
  numero: {
    type: String,
    required: true,
  },
  complemento: String,
  cep: {
    type: String,
    required: true,
  },
});

const storeSchema = new mongoose.Schema<Store>({
  nome: {
    type: String,
    required: [true, 'Loja deve ter um nome!'],
    trim: true,
  },
  endereço: {
    type: addressSchema,
    required: true,
  },
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
//index para tornar o endereço unico
storeSchema.index(
  {
    'endereço.logradouro': 1,
    'endereço.numero': 1,
    'endereço.cep': 1,
  },
  {
    unique: true,
  },
);

const Store = mongoose.model('Store', storeSchema);

export default Store;
