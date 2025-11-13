import ConstMatcha from "../ConstMatcha.js";
import driver from "../repo/neo4jRepo.js";


export const setAllConstraints = async (): Promise<void> => {
  const session = driver.session();
  try{
    await session.run(ConstMatcha.NEO4j_STMT_ID_CONSTRAINT_UNIQUE_ID);
    await session.run(ConstMatcha.NEO4j_STMT_TAG_CONSTRAINT_UNIQUE_NAME);
  } finally {
    session.close();
  }
}