import ConstMatcha from '../ConstMatcha.js';
import * as argon2 from "argon2";
import { createToken } from './jwtSvc.js';
import BadRequestError from '../errors/BadRequestError.js';
import { getUserByUsername } from './userSvc.js';
import { serverErrorWrapper } from '../util/wrapper.js';

export const option = {
  hashLength: ConstMatcha.ARGON_HASHLENGTH,
  memoryCost: ConstMatcha.ARGON_MEMORYCOST,
  parallelism: ConstMatcha.ARGON_PARALLELISM,
  type: ConstMatcha.ARGON_TYPE,
  saltLength: ConstMatcha.ARGON_SALTLENGTH,
  secret: ConstMatcha.ARGON_SECRET,
};

export const verifyPW  = async(dbhash:string, pw:string) : Promise<boolean> =>{
    const isSame = await argon2.verify(dbhash, pw, option);
    return isSame;
}

export const hashPW = async(pw:string) =>{
    const hash = await argon2.hash(pw, option);
    return hash;
}


export const loginSvc = async (username: string, password: string): Promise<string> => {
  // todo: implement login logic here
  const user = await serverErrorWrapper(() => getUserByUsername(username), "Failed to get user by username");
  if (!user)
    return "";
  if (!user.activated){
    throw new BadRequestError({
      code: 400,
      message: "Account not activated. Please check your email for the activation link.",
      logging: false,
      context: { username: "not activated" }
    });
  }
  const isValid = await serverErrorWrapper(() => verifyPW(user.pw, password), "Failed to verify password");
  if (!isValid)
    return "";
  const token = await createToken(user.id, user.email, user.username, user.activated);
  return token;
};