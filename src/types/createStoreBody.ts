export default interface StoreBody {
  nome: string;
  endereço: string;
  numero: number;
  cep: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  location: {
    type: 'Point';
    coordinates: [Number, Number];
  };
}
