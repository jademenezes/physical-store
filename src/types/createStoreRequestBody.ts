//Estrutura de dados para o Body da requisição na função createStore
export interface StoreBody {
  nome: string;
  cep: string;
  numero: number;
  complemento?: string;
}

//Estrutura para o objeto que será utilizado para criar uma loja no BD
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
