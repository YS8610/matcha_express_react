import ConstMatcha from "../ConstMatcha.js";
import { ProfileGetJson, ProfileShort } from "../model/profile.js";
import driver from "../repo/neo4jRepo.js";

// get profile of users who liked the user with given id
export const getLikedById = async (id: string): Promise<ProfileGetJson[]> => {
  const session = driver.session();
  try{
    const result = await session.run<ProfileGetJson[]>(ConstMatcha.NEO4j_STMT_GET_USER_LIKED_BY, { userId: id });
    const likedByUserIds = result.records.map(record => record.get(0));
    return likedByUserIds;
  } finally {
    await session.close();
  }
};

// get profile of users liked by the user with given id
export const getLiked = async (id: string): Promise<ProfileGetJson[]> => {
  const session = driver.session();
  try {
    const result = await session.run<ProfileGetJson[]>(ConstMatcha.NEO4j_STMT_GET_USER_LIKED, { userId: id });
    const likedUserIds = result.records.map(record => record.get(0));
    return likedUserIds;
  } finally {
    await session.close();
  }
};

// record that user with id has liked user with likedUserId
export const addLiked = async (id: string, likedUserId: string): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER_LIKED_REL, { userId: id, likedUserId });
  } finally {
    await session.close();
  }
};

// remove the like relationship that user with id has liked user with likedUserId
export const removeLiked = async (id: string, likedUserId: string): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(ConstMatcha.NEO4j_STMT_DELETE_USER_LIKED_REL, { userId: id, likedUserId });
  } finally {
    await session.close();
  }
};

export const isLiked = async (userId: string, otherUserId: string): Promise<boolean> => {
  const session = driver.session();
  try {
    const result = await session.run<{ isLiked: boolean }>(ConstMatcha.NEO4j_STMT_CHECK_USER_LIKED, { userId, otherUserId });
    return result.records[0].get("isLiked");
  } finally {
    await session.close();
  }
};

export const isLikedBack = async (userId: string, otherUserId: string): Promise<boolean> => {
  const session = driver.session();
  try{
    const result = await session.run<{ isLikedBack: boolean }>(ConstMatcha.NEO4j_STMT_CHECK_USER_LIKED_BACK, { userId, otherUserId });
    return result.records[0].get("isLikedBack");
  } finally {
    await session.close();
  }
};

// check if user with userId and otherUserId have liked each other
export const isMatch = async (userId: string, otherUserId: string): Promise<boolean> => {
  const session = driver.session();
  try{
    const result = await session.run<{ isMatched: boolean }>(ConstMatcha.NEO4j_STMT_IS_MATCHED, { userId, otherUserId });
    if (result.records.length === 0) return false;
    return result.records[0].get("isMatched") as boolean;
  } finally {
    await session.close();
  }
};

export const getMatchedUsersShortProfile = async (userId: string): Promise<ProfileShort[]> => {
  const session = driver.session();
  try {
    const result = await session.run<ProfileShort[]>(ConstMatcha.NEO4j_STMT_GET_MATCHED_USERS_SHORT_PROFILE_WITH_ID, { userId });
    return result.records.map(record => record.get(0));
  } finally {
    await session.close();
  }
};