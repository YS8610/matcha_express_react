import ConstMatcha from "../ConstMatcha.js";
import { ProfileGetJson, ProfileShort } from "../model/profile.js";
import driver from "../repo/neo4jRepo.js";

export const getBlockedById = async (id: string): Promise<ProfileGetJson[]> => {
  const session = driver.session();
  try {
    const result = await session.run<ProfileGetJson>(ConstMatcha.NEO4j_STMT_GET_USER_BLOCKED_BY_ID, { userId: id });
    const blockedUser: ProfileGetJson[] = result.records.map(record => record.get(0));
    return blockedUser;
  }
  finally {
    await session.close();
  }
}

export const setBlockedById = async (userId: string, blockedUserId: string): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER_BLOCKED_REL, { userId, blockedUserId });
  } finally {
    await session.close();
  }
}

export const deleteBlockedById = async (userId: string, blockedUserId: string): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(ConstMatcha.NEO4j_STMT_DELETE_USER_BLOCKED_REL, { userId, blockedUserId });
  } finally {
    await session.close();
  }
}

export const getBlockedRel = async (userId: string, otherUserId: string): Promise<boolean> => {
  const session = driver.session();
  try {
    const result = await session.run<{ isBlocked: boolean }>(ConstMatcha.NEO4j_STMT_CHECK_USER_BLOCKED, { userId, otherUserId });
    return result.records[0].get("isBlocked");
  } finally {
    await session.close();
  }
}