import ConstMatcha from "../ConstMatcha.js";
import { ProfileGetJson, ProfileShort } from "../model/profile.js";
import driver from "../repo/neo4jRepo.js";

export const getBlockedById = async (id: string): Promise<ProfileGetJson[]> => {
  const session = driver.session();
  const result = await session.run<ProfileGetJson>(ConstMatcha.NEO4j_STMT_GET_USER_BLOCKED_BY_ID, { userId: id });
  const blockedUser = result.records.map(record => record.get(0));
  return blockedUser;
}

export const setBlockedById = async (userId: string, blockedUserId: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER_BLOCKED_REL, { userId, blockedUserId });
  session.close();
  return;
}

export const deleteBlockedById = async (userId: string, blockedUserId: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_DELETE_USER_BLOCKED_REL, { userId, blockedUserId });
  session.close();
  return;
}