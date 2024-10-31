import {
  Request,
  Response,
  NextFunction,
  ParamsDictionary,
} from 'express-serve-static-core';
import axios from 'axios';

import Store from '../models/storeModel';
import { RequestBodyStore } from '../types/updateStore';
import createStoreBody from '../types/createStoreBody';
import catchAsync from '../utils/catchAsync';
import UserResponseData from '../types/userResponseData';
import geocoder from '../services/geocoder';
import AppError from '../utils/appError';

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

export const getAllStores = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const lojas = await Store.find();

    res.status(200).json({
      status: 'success',
      lojas,
    });
  },
);

export const getStoresInRadius = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCep = (req as Request<{ cep: string }>).params.cep;

    if (!userCep) throw new Error('insira um cep!');

    const cleanedCep = userCep.replace(/\D/g, '');
    if (userCep.length != 8) {
      throw new AppError('Insira um cep válido!', 400);
    }

    const r = await axios.get(`http://viacep.com.br/ws/${cleanedCep}/json/`);

    const userResponse: UserResponseData = {
      cep: r.data.cep,
      logradouro: r.data.logradouro,
      bairro: r.data.localidade,
      localidade: r.data.localidade,
      uf: r.data.uf,
    };

    const coord = await geocodeCep(userResponse.logradouro);

    res.status(200).json({
      status: 'success',
      data: {
        userResponse,
        coordinates: coord,
      },
    });
  },
);

export const createStore = catchAsync(
  async (
    req: Request<{}, {}, createStoreBody>,
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
    const storeData: createStoreBody = {
      nome: req.body.nome,
      endereço: r.data.logradouro,
      numero: req.body.numero,
      complemento: req.body.complemento,
      cep: req.body.cep,
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
