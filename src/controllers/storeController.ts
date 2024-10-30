import { Request, Response, NextFunction } from 'express-serve-static-core';
import axios from 'axios';

import Store from '../models/storeModel';
import RequestParamsCep from '../types/requestParamsCep';
import { RequestParamsStore, RequestBodyStore } from '../types/updateStore';
import catchAsync from '../utils/catchAsync';
import UserResponseData from '../types/userResponseData';
import geocoder from './../utils/geocoder';

async function geocodeCep(address: string) {
  const response = await geocoder.geocode(address);

  const coord = {
    lat: response[0].latitude,
    lon: response[0].longitude,
  };
  return coord;
}
async function getAllStores(req: Request, res: Response, next: NextFunction) {
  const lojas = await Store.find();

  res.status(200).json({
    status: 'success',
    lojas,
  });
}

export async function getStoresInRadius(
  req: Request<RequestParamsCep>,
  res: Response,
  next: NextFunction,
) {
  try {
    let userCep = req.params.cep;

    if (!userCep) throw new Error('insira um cep!');

    userCep = userCep.replace(/\D/g, '');
    if (userCep.length != 8) {
      throw new Error('Insira um cep válido!');
    }

    const r = await axios.get<UserResponseData>(
      `http://viacep.com.br/ws/${userCep}/json/`,
    );

    const userResponse: UserResponseData = {
      cep: r.data.cep,
      logradouro: r.data.logradouro,
      bairro: r.data.localidade,
      localidade: r.data.localidade,
      uf: r.data.uf,
    };
    res.status(200).json({
      status: 'success',
      data: userResponse,
    });
  } catch (err) {
    console.log(err);
  }
}

async function createStore(req: Request, res: Response, next: NextFunction) {
  const newStore = await Store.create(req.body);

  res.status(201).json({
    status: 'success',
    loja: newStore,
  });
}

async function updateStore(
  req: Request<RequestParamsStore, {}, RequestBodyStore>,
  res: Response,
  next: NextFunction,
) {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body);

    if (!store) {
      return next(new Error('Nenhuma loja encontrada com essa ID!'));
    }
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
}

export const getAllStoresAsync = catchAsync(getAllStores);
export const createStoreAsync = catchAsync(createStore);

// async function getStoresInRadius(
//   req: Request<RequestParamsCep>,
//   res: Response,
//   next: NextFunction,
// ) {
//   const userCep = req.params.cep;

//   if (!userCep) {
//     return new Error('insira um cep válido!');
//   }

//   userCep.replace(/\D/, '');
//   console.log(userCep);
//   const validacep = /^[0-9]{8}$/;
//   console.log(userCep);
//   console.log(validacep.test(userCep));

//   if (validacep.test(userCep)) {
//     const r = await axios.get(`http://viacep.com.br/ws/${userCep}/json/`);

//     // // const storeData = userResponse.data;
//     // console.log(response.data);

//     // res.status(200).json({
//     //   status: 'success',
//     //   data: response.data,
//     // });
//   }

//   res.status(500).send();
// }
