export interface StoreBody {
  nome: string;
  cep: string;
  numero: number;
  complemento?: string;
}

export interface CreateStoreInterface {
  nome: string;
  endereço: {
    logradouro: string;
    numero: number;
    complemento?: string;
    cep: string;
  };
  bairro: string;
  localidade: string;
  uf: string;
  location: {
    type: 'Point';
    coordinates: [Number, Number];
  };
}
