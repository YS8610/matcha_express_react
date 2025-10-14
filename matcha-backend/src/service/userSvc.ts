import ConstMatcha from "../ConstMatcha.js";
import { ProfileDb, ProfileGetJson, ProfilePutJson, ProfileShort } from "../model/profile.js";
import driver from "../repo/neo4jRepo.js";

export const isUserByEmail = async (email: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_EMAIL, { email });
  session.close();
  return result.records.length == 1;
};

export const isUserByUsername = async (username: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
  session.close();
  return result.records.length > 0;
};

export const isUserExistsById = async (id: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_ID, { id });
  session.close();
  return result.records.length > 0;
};

export const isUserByEmailUsername = async (email: string, username: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_EMAIL_USERNAME, { email, username });
  session.close();
  return result.records.length > 0;
};

export const getUsers = async (): Promise<ProfileDb[]> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_ALL_USERS);
  session.close();
  return result.records.map(record => record.get(0));
};

export const getUserById = async (id: string): Promise<ProfileDb | null> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_ID, { id });
  session.close();
  return result.records.length == 1 ? result.records[0].get(0) : null;
};

export const getShortProfileById = async (id: string): Promise<ProfileShort | null> => {
  const session = driver.session();
  const result = await session.run<ProfileShort>(ConstMatcha.NEO4j_STMT_GET_SHORT_PROFILE_BY_ID, { id });
  session.close();
  return result.records.length == 1 ? result.records[0].get(0) : null;
};

export const getUserByUsername = async (username: string): Promise<ProfileDb | null> => {
    const session = driver.session();
    const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
    session.close();
    return result.records.length == 1 ? result.records[0].get(0) : null;
}

export const getUserIdByUsername = async (username: string): Promise<string> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
  session.close();
  return result.records.length == 1 ? result.records[0].get(0).id : "";
};

export const getHashedPwById = async (id: string): Promise<string> => {
  const session = driver.session();
  const result = await session.run<{ pw: string }>(ConstMatcha.NEO4j_STMT_GET_PW_BY_ID, { id });
  session.close();
  return result.records.length == 1 ? result.records[0].get("pw"): "";
};

export const getHashedPwByUsername = async (username: string): Promise<string> => {
  const session = driver.session();
  const result = await session.run<{ pw: string }>(ConstMatcha.NEO4j_STMT_GET_PW_BY_USERNAME, { username });
  session.close();
  return result.records.length == 1 ? result.records[0].get("pw"): "";
};

export const setUserProfileById = async (id : string, profileUpdateJson : ProfilePutJson): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_SET_USER_PROFILE_BY_ID, { id, ...profileUpdateJson });
  session.close();
  return;
}

export const setPwByUsername = async (username: string, hashedpw: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_SET_PW_BY_USERNAME, { username, hashedpw });
  session.close();
  return;
}

export const setPwById = async (id: string, hashedpw: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_SET_PW_BY_ID, { id, hashedpw });
  session.close();
  return;
}

export const createUser = async (id:string, email: string, hashedPassword: string, firstName: string, lastName: string, username: string, birthDate: string): Promise<void> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_CREATE_USER, { id, email, password: hashedPassword, firstName, lastName, username, birthDate });
  session.close();
};

export const activateUserByUsername = async (username: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_ACTIVATE_USER_BY_USERNAME, { username });
  session.close();
  return result.records.length > 0;
}

export const getUserProfileById = async (id: string): Promise<ProfileGetJson | null> => {
  const session = driver.session();
  const result = await session.run<ProfileGetJson>(ConstMatcha.NEO4j_STMT_GET_USER_PROFILE_BY_ID, { id });
  session.close();
  return result.records.length == 1 ? result.records[0].get(0) : null;
};

// password validation function (e.g., length, complexity)
export const isPwValid = (pw: string): number => {
  let mask = 0;
  // Minimum length of 8 characters
  if (pw.length < 8) 
    mask |= 1; 
  // At least one uppercase letter
  if (!/[A-Z]/.test(pw)) 
    mask |= 2; 
  // At least one lowercase letter
  if (!/[a-z]/.test(pw)) 
    mask |= 4; 
  // At least one number
  if (!/[0-9]/.test(pw)) 
    mask |= 8;
  // At least one special character
  if (!/[!@#$%^&*]/.test(pw))
    mask |= 16;
  return mask; // Return 0 if valid, otherwise return the bitmask indicating issues
}

export const isValidDateStr = (dateStr: string): boolean => {
  // Check if the date string is in a valid format (YYYY-MM-DD)
  dateStr = dateStr.trim();
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) 
    return false; // Invalid date
  return dateRegex.test(dateStr);
}