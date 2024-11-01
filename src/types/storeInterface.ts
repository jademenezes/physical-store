import Address from './addressInterface';

//Estrutura de dados da loja no banco de dados
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
