import ConstMatcha from '../ConstMatcha';
import * as argon2 from "argon2";

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