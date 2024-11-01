import Address from './addressInterface';

export default interface Store {
  nome: string;
  endereço: Address;
  bairro: String;
  localidade: String;
  uf: String;
  location: {
    type: 'Point';
    coordinates: [Number];
  };
}
