import { CustomError } from "../errors/CustomError.js";
import ServerRequestError from "../errors/ServerRequestError.js";
import redisClient from "../repo/redisRepo.js";

export const serverErrorWrapper = async <T>(fn: () => T, errorMsg: string, log: boolean = true, code: number = 500): Promise<T> => {
  try {
    return await fn();
  } catch (error: unknown) {
    if (error instanceof CustomError)
      throw error;
    throw new ServerRequestError({
      code,
      message: errorMsg,
      logging: log,
      context: { error, errorMsg: (error as Error)?.message, errorStack: (error as Error)?.stack }
    });
  }
};

export const catchErrorWrapper = async <T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> => {
  try {
    const result = await promise;
    return [undefined, result] as [undefined, T];
  } catch (error) {
    return [error as Error];
  }
};

export const catchTypedErrorWrapper = async <T, E extends new (message?: string) => Error>(promise: Promise<T>, ErrorTypetoCatch?: E[]): Promise<[undefined, T] | [InstanceType<E>]> => {
  try {
    const result = await promise;
    return [undefined, result] as [undefined, T];
  } catch (error) {
    if (!ErrorTypetoCatch || ErrorTypetoCatch.length === 0)
      return [error as InstanceType<E>];
    if (ErrorTypetoCatch.some((ErrorType) => error instanceof ErrorType))
      return [error as InstanceType<E>];
    throw error;
  }
};

export const cacheFunc = <T>(key: string, fn: (input: string) => Promise<T>, expirySeconds: number = 1000): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    try {
      const cached = await redisClient.get(key);
      if (cached)
        return resolve(JSON.parse(cached));
      const result = await fn(key);
      await redisClient.set(key, JSON.stringify(result), {
        expiration: { type: "EX", value: expirySeconds }
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};