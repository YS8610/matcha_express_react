import ConstMatcha from "../ConstMatcha.js";
import { ProfileGetJson, ProfileShort } from "../model/profile.js";
import driver from "../repo/neo4jRepo.js";

// get profile of users who liked the user with given id
export const getLikedById = async (id: string): Promise<ProfileGetJson[]> => {
  const session = driver.session();
  const result = await session.run<ProfileGetJson[]>(ConstMatcha.NEO4j_STMT_GET_USER_LIKED_BY, { userId: id });
  const likedByUserIds = result.records.map(record => record.get(0));
  session.close();
  return likedByUserIds;
};

// get profile of users liked by the user with given id
export const getLiked = async (id: string): Promise<ProfileGetJson[]> => {
  const session = driver.session();
  const result = await session.run<ProfileGetJson[]>(ConstMatcha.NEO4j_STMT_GET_USER_LIKED, { userId: id });
  const likedUserIds = result.records.map(record => record.get(0));
  session.close();
  return likedUserIds;
};

// record that user with id has liked user with likedUserId
export const addLiked = async (id: string, likedUserId: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER_LIKED_REL, { userId: id, likedUserId });
  session.close();
};

// remove the like relationship that user with id has liked user with likedUserId
export const removeLiked = async (id: string, likedUserId: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_DELETE_USER_LIKED_REL, { userId: id, likedUserId });
  session.close();
};

export const isLiked = async (userId: string, otherUserId: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<{ isLiked: boolean }>(ConstMatcha.NEO4j_STMT_CHECK_USER_LIKED, { userId, otherUserId });
  session.close();
  return result.records[0].get("isLiked");
};

// check if user with userId and otherUserId have liked each other
export const isMatch = async (userId: string, otherUserId: string): Promise<boolean> => {
  const session = driver.session();
  const result = await session.run<{ matchCount: number }>(ConstMatcha.NEO4j_STMT_IS_MATCHED, { userId, otherUserId });
  session.close();
  return result.records[0].get("matchCount") >= 2;
}

export const getMatchedUsersShortProfile = async (userId: string): Promise<ProfileShort[]> => {
  const session = driver.session();
  const result = await session.run<ProfileShort[]>(ConstMatcha.NEO4j_STMT_GET_MATCHED_USERS_SHORT_PROFILE_WITH_ID, { userId });
  session.close();
  return result.records.map(record => record.get(0));
};