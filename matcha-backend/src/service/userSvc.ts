import ConstMatcha from "../ConstMatcha";
import driver from "../repo/neo4jRepo";

export const isUser = async (email: string): Promise<boolean> => {
  // todo: implement email presence check
  const session = driver.session();
  const result = await session.run(ConstMatcha.NEO4j_STMT_FIND_USER_BY_EMAIL, { email });
  session.close();
  return result.records.length > 0;
};

export const getUserId = async (email: string): Promise<number> => {
  // todo: implement get user ID logic
  const session = driver.session();
  const result = await session.run(ConstMatcha.NEO4j_STMT_FIND_USER_BY_EMAIL, { email });
  session.close();
  return result.records.length > 0 ? result.records[0].get("id") : 0;
};

export const createUser = async (email: string, hashedPassword: string, firstName: string, lastName: string, username: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER, { email, password: hashedPassword, firstName, lastName, username });
  session.close();
  return result.records.length > 0;
};

export const getUsers = async (): Promise<any[]> => {
  const session = driver.session();
  const result = await session.run(ConstMatcha.NEO4j_STMT_GET_ALL_USERS);
  session.close();
  const records = result.records.map(record => record.toObject());
  return records;
};

// password validation function (e.g., length, complexity)
export const isPwValid = (pw: string): boolean => {
  if (pw.length < 8) return false; // Minimum length
  if (!/[A-Z]/.test(pw)) return false; // At least one uppercase letter
  if (!/[a-z]/.test(pw)) return false; // At least one lowercase letter
  if (!/[0-9]/.test(pw)) return false; // At least one number
  if (!/[!@#$%^&*]/.test(pw)) return false; // At least one special character
  return true;
}