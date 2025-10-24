import ConstMatcha from "../ConstMatcha.js";
import BadRequestError from "../errors/BadRequestError.js";
import driver from "../repo/neo4jRepo.js";
import { isUserExistsById } from "./userSvc.js";

const getFame = async (userId: string): Promise<number | null> => {
  const session = driver.session();
  const result = await session.run<{ fameRating: number }>(
    ConstMatcha.NEO4j_STMT_GET_FAME_RATING_BY_USER_ID,
    { userId }
  );
  await session.close();
  if (result.records.length === 0)
    return null;
  return result.records[0].get("fameRating");
};

const setFame = async (userId: string, fame: number): Promise<void> => {
  const session = driver.session();
  const exist = await isUserExistsById(userId);
  if (!exist)
    throw new BadRequestError({
      message: `User with id ${userId} does not exist`,
      code: 400,
      context: { error : "UserNotFound" },
    });
  await session.run(
    ConstMatcha.NEO4j_STMT_SET_FAME_RATING_BY_USER_ID,
    { userId, fameRating: fame }
  );
  await session.close();
};

export const updateFameRating = async (userId: string, increment: number): Promise<number> => {
  const currentFame = await getFame(userId);
  if (currentFame === null)
    throw new BadRequestError({
      message: `User with id ${userId} does not exist`,
      code: 400,
      context: { error : "UserNotFound" },
    });
  const newFame = (currentFame ?? 0) + increment;
  await setFame(userId, newFame);
  return newFame;
};