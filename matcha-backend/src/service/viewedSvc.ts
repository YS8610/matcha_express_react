import driver from "../repo/neo4jRepo.js";
import ConstMatcha from "../ConstMatcha.js";
import { ProfileGetJson } from "../model/profile.js";

// get profile of users viewed by the user with given id
export const getVisitedById = async (id: string): Promise<ProfileGetJson[]> => {
  const session = driver.session();
  const result = await session.run<ProfileGetJson>(ConstMatcha.NEO4j_STMT_GET_USER_VIEWED, { userId: id });
  const viewedUserIds = result.records.map(record => record.get(0));
  session.close();
  return viewedUserIds;
};

// get profile of users who viewed the user with given id
export const getViewedById = async (id: string): Promise<ProfileGetJson[]> => {
  const session = driver.session();
  const result = await session.run<ProfileGetJson>(ConstMatcha.NEO4j_STMT_GET_USER_VIEWED_BY, { userId: id });
  const viewedByUserIds = result.records.map(record => record.get(0));
  session.close();
  return viewedByUserIds;
};

// record that user with id has viewed user with viewedUserId
export const addViewed = async (id: string, viewedUserId: string): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_CREATE_USER_VIEWED_REL, { userId: id, viewedUserId });
  session.close();
};

