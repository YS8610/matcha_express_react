import ServerRequestError from "../errors/ServerRequestError";

export const serverErrorWrapper = async <T>(fn: () => T, errorMsg: string, log: boolean = true, code: number = 500): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    throw new ServerRequestError({
      code,
      message: errorMsg,
      logging: log,
      context: { error }
    });
  }
};