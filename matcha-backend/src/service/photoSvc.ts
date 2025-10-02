import ConstMatcha from "../ConstMatcha.js";
import BadRequestError from "../errors/BadRequestError.js";
import ServerRequestError from "../errors/ServerRequestError.js";
import driver from "../repo/neo4jRepo.js";
import fs from "fs/promises";

export const setPhotobyUserId = async (userId: string, photoUrl: string, photoNumber: number): Promise<void> => {
  const session = driver.session();
  if (photoNumber < 0 || photoNumber > ConstMatcha.NEO4j_USER_MAX_PHOTOS) {
    session.close();
    throw new BadRequestError({
      message: "Invalid photo number",
      logging: false,
      code: 400,
      context: { err : "pls provide a number from 0 to 4"}
    });
  }
  switch (photoNumber) {
    case 0:
      await session.run(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO0, { userId, photoUrl });
      break;
    case 1:
      await session.run(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO1, { userId, photoUrl });
      break;
    case 2:
      await session.run(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO2, { userId, photoUrl });
      break;
    case 3:
      await session.run(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO3, { userId, photoUrl });
      break;
    case 4:
      await session.run(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO4, { userId, photoUrl });
      break;
    default:
      await session.run(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO0, { userId, photoUrl });
      break;
  }
  session.close();
  return;
}

export const deletePhotoByName = async(photoName : string): Promise<boolean> => {
  const filePath = `${ConstMatcha.PHOTO_DUMP_DIR}/${photoName}`;
  try {
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') 
      return false;
    throw new ServerRequestError({
      message: "Failed to delete photo",
      logging: true,
      code: 500,
      context: { err }
    });
  }
}

export const getAllPhotoNameByUserId = async(userId : string) : Promise<string[]> => {
  const session = driver.session();
  const result = await session.run<{ photoNames: string[] }>(ConstMatcha.NEO4j_STMT_GET_ALL_PHOTO_NAME_BY_USER_ID, { userId });
  session.close();
  return result.records[0].get("photoNames");
}

export const isValidOrder = (order:number[]): boolean => {
  if (order.length !== ConstMatcha.NEO4j_USER_MAX_PHOTOS)
    return false;
  let mask = 0;
  for (let n of order) {
    if (n < 0 || n >= ConstMatcha.NEO4j_USER_MAX_PHOTOS)
      return false;
    mask |= (1 << n);
  }
  if (mask !== (1 << ConstMatcha.NEO4j_USER_MAX_PHOTOS) - 1)
    return false;
  return true;
}

  // assume newOrder and oldOrder are both valid
export const reorderPhotosByID = async(userId: string, newOrder: number[], oldOrder: string[]): Promise<void> => {
  let cont = false;
  for (let i =0, n= ConstMatcha.NEO4j_USER_MAX_PHOTOS ;i<n;i++){
    if (i != newOrder[i]) {
      cont = true;
      break;
    }
  }
  if (!cont)
    return;
  const session = driver.session();
  const str = new Array<string>(ConstMatcha.NEO4j_USER_MAX_PHOTOS);
  for (let i =0;i<ConstMatcha.NEO4j_USER_MAX_PHOTOS;i++)
    str[i] = oldOrder[newOrder[i]];
  await session.run(ConstMatcha.NEO4j_STMT_SET_PHOTO_ORDER_BY_USER_ID, {
    userId,
    photo0: str[0],
    photo1: str[1],
    photo2: str[2],
    photo3: str[3],
    photo4: str[4]
  });
  session.close();
  return;
}