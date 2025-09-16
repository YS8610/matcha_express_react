import ConstMatcha from "../ConstMatcha";
import { ProfileDb } from "../model/profile";
import driver from "../repo/neo4jRepo";

export const isUserByEmail = async (email: string): Promise<boolean> => {
  // todo: implement email presence check
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_EMAIL, { email });
  session.close();
  return result.records.length > 0;
};

export const isUserByUsername = async (username: string): Promise<boolean> => {
  // todo: implement email presence check
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
  session.close();
  return result.records.length > 0;
};

export const getUserIdByUsername = async (username: string): Promise<string> => {
  // todo: implement get user ID logic
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
  session.close();
  return result.records.length > 0 ? result.records[0].get("id") : "";
};

export const isUserByEmailUsername = async (email: string, username: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_EMAIL_USERNAME, { email, username });
  session.close();
  return result.records.length > 0;
};

export const getHashedPwByUsername = async (username: string): Promise<string> => {
  const session = driver.session();
  const result = await session.run<{ pw: string }>(ConstMatcha.NEO4j_STMT_GET_PW_BY_USERNAME, { username });
  session.close();
  return result.records.length == 1 ? result.records[0].get("pw"): "";
};

export const setPwByUsername = async (username: string, hashedpw: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_SET_PW_BY_USERNAME, { username, hashedpw });
  session.close();
  return;
}

export const createUser = async (email: string, hashedPassword: string, firstName: string, lastName: string, username: string, birthDate: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_CREATE_USER, { email, password: hashedPassword, firstName, lastName, username, birthDate });
  session.close();
  return result.records.length > 0;
};

export const getUserById = async (id: string): Promise<ProfileDb | null> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_USER_BY_ID, { id });
  session.close();
  return result.records.length > 0 ? result.records[0].toObject() : null;
};

export const getUsers = async (): Promise<ProfileDb[]> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_GET_ALL_USERS);
  session.close();
  const records = result.records.map(record => record.toObject());
  return records;
};

export const activateUserByUsername = async (username: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<ProfileDb>(ConstMatcha.NEO4j_STMT_ACTIVATE_USER_BY_USERNAME, { username });
  session.close();
  return result.records.length > 0;
}

// password validation function (e.g., length, complexity)
export const isPwValid = (pw: string): boolean => {
  if (pw.length < 8) return false; // Minimum length
  if (!/[A-Z]/.test(pw)) return false; // At least one uppercase letter
  if (!/[a-z]/.test(pw)) return false; // At least one lowercase letter
  if (!/[0-9]/.test(pw)) return false; // At least one number
  if (!/[!@#$%^&*]/.test(pw)) return false; // At least one special character
  return true;
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