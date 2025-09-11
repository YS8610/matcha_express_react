import ConstMatcha from '../ConstMatcha';
import * as argon2 from "argon2";
import driver from '../repo/neo4jRepo';
import { ProfileDb } from '../model/profile';
import { createToken } from './jwtSvc';
import ServerRequestError from '../errors/ServerRequestError';

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


export const loginSvc = async (email: string, password: string): Promise<string> => {
  // todo: implement login logic here
  const session = driver.session();
  const result = await session.run<{u:{properties:ProfileDb}}>(ConstMatcha.NEO4j_STMT_FIND_USER_BY_EMAIL, { email });
  session.close();
  if (result.records.length === 0)
    return "";
  const profile = result.records[0].get("u").properties;
  try {
    const isValid = await verifyPW(profile.pw, password);
    if (!isValid)
      return "";
    const token = await createToken(profile.email, profile.username);
    return token;
  } catch (error) {
    throw new ServerRequestError({
      code: 500,
      message: "Failed to create token",
      logging: true,
      context: { error }
    });
  }
};