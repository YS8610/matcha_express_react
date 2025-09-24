import ConstMatcha from "../ConstMatcha.js";
import driver from "../repo/neo4jRepo.js";

export const createTag = async (name:string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_CREATE_TAG, { name });
  session.close();
  return;
}

export const getTagCountById = async (id:string): Promise<number> => {
  const session = driver.session();
  const result = await session.run<{ tagCount: number }>(ConstMatcha.NEO4j_STMT_GET_TAG_COUNTS_BY_USER_ID, { id });
  session.close();
  return result.records[0].get("tagCount");
};

export const getTagsById = async (id:string): Promise<string[]> => {
  const session = driver.session();
  const result = await session.run<{ name: string }>(ConstMatcha.NEO4j_STMT_GET_USER_TAGS, { id });
  session.close();
  return result.records.map(record => record.get("name"));
}

export const setTagbyUserId = async (userId: string, tagName: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER_TAG_REL, { userId, tagName });
  session.close();
  return;
}

export const deleteTagbyUserId = async (userId: string, tagName: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_DELETE_USER_TAG_REL, { userId, tagName });
  session.close();
  return;
}