import {
  Request,
  Response,
  NextFunction,
  ParamsDictionary,
} from 'express-serve-static-core';
import axios from 'axios';

import Store from '../models/storeModel';
import { RequestBodyStore } from '../types/updateStore';
import { StoreBody, createStoreInterface } from '../types/createStoreBody';
import catchAsync from '../utils/catchAsync';
import UserResponseData from '../types/userResponseData';
import geocoder from '../services/geocoder';
import AppError from '../utils/appError';

//Pegar coordenadas utilizando string de endereço
const geocodeCep = async (address: string) => {
  try {
    const response = await geocoder.geocode(address);

    if (!response || response.length === 1) {
      throw new AppError('Não foram encontrados resultados para o cep.', 500);
    }

    const { latitude, longitude } = response[0];
    if (!latitude || !longitude) {
      throw new AppError('Erro ao achar as coordenadas.', 500);
    }
    const coordinates = {
      latitude,
      longitude,
    };
    return coordinates;
  } catch (err) {
    console.log(err);
    throw new AppError('Erro ao geocodificar o endereço.', 500);
  }
};

// Get Todas as lojas no banco
export const getAllStores = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const lojas = await Store.find();

    res.status(200).json({
      status: 'success',
      lojas,
    });
  },
);

// Get lojas em 100km de um cep
export const getStoresInRadius = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Tratar cep recebido nos parametros
    const userCep = (req as Request<{ cep: string }>).params.cep;

    if (!userCep) throw new Error('insira um cep!');

    const cleanedCep = userCep.replace(/\D/g, '');
    if (userCep.length != 8) {
      throw new AppError('Insira um cep válido!', 400);
    }

    //Requisição para API ViaCep
    const r = await axios.get(`http://viacep.com.br/ws/${cleanedCep}/json/`);

    const userResponse: UserResponseData = {
      logradouro: r.data.logradouro,
      localidade: r.data.localidade,
    };

    //Processar latitude e longitude
    const coord = await geocodeCep(
      `${userResponse.logradouro} ${userResponse.localidade}`,
    );

    // Fazer Query das lojas por distância
    const lojas = await Store.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [coord.longitude, coord.latitude],
          },
          distanceField: 'distance',
          maxDistance: 100000,
          spherical: true,
        },
      },
      {
        $addFields: {
          distanciaKm: { $round: [{ $divide: ['$distance', 1000] }, 2] },
        },
      },
      { $sort: { distance: 1 } },
      {
        $project: {
          _id: 0,
          location: 0,
          __v: 0,
          distance: 0,
        },
      },
    ]);

    if (lojas.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Sinto muito, não encontramos lojas próximas de você.',
      });
    }

    return res.status(200).json({
      status: 'success',
      lojas,
    });
  },
);

// Criar loja
export const createStore = catchAsync(
  async (
    req: Request<{}, {}, StoreBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const r = await axios.get(`http://viacep.com.br/ws/${req.body.cep}/json/`);

    // Erro se o cep for inválido
    if (r.data.erro === 'true') {
      return next(new AppError('Erro ao receber localização da loja!', 400));
    }

    //Pegar coordenadas geográficas pelo endereço
    const address = `${r.data.logradouro} ${req.body.numero} ${r.data.localidade}`;
    const coordinates = await geocodeCep(address);

    //Criar objeto Loja
    const { latitude, longitude } = coordinates;

    //Tirar log
    console.log(`${latitude} ${longitude}`);
    const storeData: createStoreInterface = {
      nome: req.body.nome,
      endereço: {
        logradouro: r.data.logradouro as string,
        numero: req.body.numero,
        complemento: req.body.complemento,
        cep: req.body.cep,
      },
      bairro: r.data.bairro,
      localidade: r.data.localidade,
      uf: r.data.uf,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };

    const newStore = await Store.create(storeData);

    res.status(201).json({
      status: 'success',
      loja: newStore,
    });
  },
);

// Atualizar loja existente
export const updateStore = catchAsync(
  async (
    req: Request<ParamsDictionary, {}, RequestBodyStore>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, req.body);

    if (!store) {
      return next(new AppError('Nenhuma loja encontrada com essa ID!', 400));
    }
  },
);

//Deletar loja
export const deleteStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await Store.findByIdAndDelete(id);

    res.status(204).send();
  },
);
