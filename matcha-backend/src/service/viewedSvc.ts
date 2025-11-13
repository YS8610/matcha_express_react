import driver from "../repo/neo4jRepo.js";
import ConstMatcha from "../ConstMatcha.js";
import { ProfileShort } from "../model/profile.js";

// get profile of users viewed by the user with given id
export const getVisitedById = async (id: string): Promise<ProfileShort[]> => {
  const session = driver.session();
  try {
    const result = await session.run<ProfileShort>(ConstMatcha.NEO4j_STMT_GET_USER_VIEWED, { userId: id });
    const viewedUserIds = result.records.map(record => record.get(0));
    return viewedUserIds;
  } finally {
    await session.close();
  }
};

// get profile of users who viewed the user with given id
export const getViewedById = async (id: string): Promise<ProfileShort[]> => {
  const session = driver.session();
  try {
    const result = await session.run<ProfileShort>(ConstMatcha.NEO4j_STMT_GET_USER_VIEWED_BY, { userId: id });
    const viewedByUserIds = result.records.map(record => record.get(0));
    return viewedByUserIds;
  } finally {
    await session.close();
  }
};

// record that user with id has viewed user with viewedUserId
export const addViewed = async (id: string, viewedUserId: string): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER_VIEWED_REL, { userId: id, viewedUserId });
  } finally {
    await session.close();
  }
};

// check if user with userId has viewed user with otherUserId
export const isViewed = async (userId: string, otherUserId: string): Promise<boolean> => {
  const session = driver.session();
  try{
    const result = await session.run<{ isViewed: boolean }>(ConstMatcha.NEO4j_STMT_CHECK_USER_VIEWED, { userId, otherUserId });
    return result.records[0].get("isViewed");
  } finally {
    await session.close();
  }
};

