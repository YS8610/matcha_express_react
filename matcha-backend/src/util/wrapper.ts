import { CustomError } from "../errors/CustomError.js";
import ServerRequestError from "../errors/ServerRequestError.js";

export const serverErrorWrapper = async <T>(fn: () => T, errorMsg: string, log: boolean = true, code: number = 500): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof CustomError)
      throw error;
    throw new ServerRequestError({
      code,
      message: errorMsg,
      logging: log,
      context: { error }
    });
  }
};

export const catchErrorWrapper = async <T>(promise : Promise<T>): Promise<[undefined, T] | [Error]> => {
  try {
    const result = await promise;
    return [undefined, result] as [undefined, T];
  } catch (error) {
    return [error as Error];
  }
};

export const catchTypedErrorWrapper = async <T, E extends new (message?:string) => Error>(promise: Promise<T>, ErrorTypetoCatch?: E[]): Promise<[undefined, T] | [InstanceType<E>]> => {
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
