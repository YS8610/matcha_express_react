import {getDb} from "../repo/mongoRepo.js";
import ConstMatcha from "../ConstMatcha.js";
import { Db } from "mongodb";


export const isUserReported = async (reporterId: string, reportedId: string, getDataBase: () => Promise<Db> = getDb): Promise<boolean> => {
  const db = await getDataBase();
  const reportCount = await db.collection(ConstMatcha.MONGO_COLLECTION_REPORTS).countDocuments({
    reporterId,
    reportedId,
  });
  return reportCount > 0;
}

export const reportUser = async (reporterId: string, reportedId: string, reason: string, getDataBase: () => Promise<Db> = getDb): Promise<void> => {
  const db = await getDataBase();
  // Here you would typically handle the user report, e.g., save it to the database
  await db.collection(ConstMatcha.MONGO_COLLECTION_REPORTS).insertOne({
    reporterId,
    reportedId,
    reason,
    timestamp: Date.now(),
  });
}