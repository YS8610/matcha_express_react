import ConstMatcha from "../ConstMatcha.js";
import BadRequestError from "../errors/BadRequestError.js";
import { IntTypeNeo4j } from "../model/profile.js";
import driver from "../repo/neo4jRepo.js";
import { isUserExistsById } from "./userSvc.js";

export const getFame = async (userId: string): Promise<IntTypeNeo4j | null> => {
  const session = driver.session();
  try {
    const result = await session.run<{ fameRating: IntTypeNeo4j }>(
      ConstMatcha.NEO4j_STMT_GET_FAME_RATING_BY_USER_ID,
      { userId }
    );
    if (result.records.length === 0)
      return null;
    return result.records[0].get("fameRating");
  } finally {
    await session.close();
  }
};

export const setFame = async (userId: string, fame: number): Promise<void> => {
  const session = driver.session();
  try {
    const exist = await isUserExistsById(userId);
    if (!exist)
      throw new BadRequestError({
        message: `User with id ${userId} does not exist`,
        code: 400,
        context: { error: "UserNotFound" },
      });
    await session.run(
      ConstMatcha.NEO4j_STMT_SET_FAME_RATING_BY_USER_ID,
      { userId, fameRating: fame }
    );
  } finally {
    await session.close();
  }
};

export const updateFameRating = async (
  userId: string,
  increment: number,
  getFame: (userid: string) => Promise<IntTypeNeo4j | null>,
  setFame: (userid: string, fame: number) => Promise<void>): Promise<number> => {
  const exist = await isUserExistsById(userId);
  if (!exist)
    throw new BadRequestError({
      message: `User with id ${userId} does not exist`,
      code: 404,
      context: { error: "UserNotFound" },
    });
  const currentFame = await getFame(userId);
  const newFame = (currentFame?.low ?? 0) + increment;
  await setFame(userId, newFame);
  return newFame;
};