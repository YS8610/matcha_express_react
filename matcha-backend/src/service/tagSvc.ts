import ConstMatcha from "../ConstMatcha.js";
import driver from "../repo/neo4jRepo.js";
import neo4j from "neo4j-driver";

export const createTag = async (name:string): Promise<void> => {
  const session = driver.session();
  try{
    await session.run(ConstMatcha.NEO4j_STMT_CREATE_TAG, { name });
  } finally {
    await session.close();
  }
}

export const getTagCountById = async (id:string): Promise<number> => {
  const session = driver.session();
  try{
    const result = await session.run<{ tagCount: number }>(ConstMatcha.NEO4j_STMT_GET_TAG_COUNTS_BY_USER_ID, { userId: id });
    return result.records[0].get("tagCount");
  } finally {
    await session.close();
  }
};

export const getTagsById = async (id:string): Promise<string[]> => {
  const session = driver.session();
  try{
    const result = await session.run<{ name: string }>(ConstMatcha.NEO4j_STMT_GET_USER_TAGS, { userId: id });
    return result.records.map(record => record.get("name"));
  } finally {
    await session.close();
  }
}

export const setTagbyUserId = async (userId: string, tagName: string): Promise<void> => {
  const session = driver.session();
  try{
    await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER_TAG_REL, { userId, tagName });
  } finally {
    await session.close();
  }
}

export const deleteTagbyUserId = async (userId: string, tagName: string): Promise<void> => {
  const session = driver.session();
  try{
    await session.run(ConstMatcha.NEO4j_STMT_DELETE_USER_TAG_REL, { userId, tagName });
  } finally {
    await session.close();
  }
}

export const getPopularTags = async (limit: number): Promise<{ name: string, tagCount: number }[]> => {
  const session = driver.session();
  try{
    const result = await session.run<{ name: string, tagCount: number }>(ConstMatcha.NEO4j_STMT_GET_POPULAR_TAGS, { limit: neo4j.int(limit) });
    return result.records.map(record => ({ name: record.get("name"), tagCount: record.get("tagCount") }));
  } finally {
    await session.close();
  }
}