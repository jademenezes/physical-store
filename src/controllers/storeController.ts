import { Request, Response, NextFunction } from 'express-serve-static-core';
import axios from 'axios';

import Store from '../models/storeModel';
import RequestParamsCep from '../types/requestParamsCep';
import catchAsync from '../utils/catchAsync';
import UserResponseData from '../types/userResponseData';

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

    const rData: UserResponseData = r.data;
    const userResponse = (rData) => {
      rData.forEach((element) => {});
    };

    res.status(200).json({
      status: 'success',
      data: r.data,
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
