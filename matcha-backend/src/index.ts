import dotenv from "dotenv";
import { clogger } from "./service/loggerSvc.js";
import appfunc from "./app.js";
import ConstMatcha from "./ConstMatcha.js";
import driver from "./repo/neo4jRepo.js";
import ServerRequestError from "./errors/ServerRequestError.js";


dotenv.config();
const port = process.env.PORT || ConstMatcha.DEFAULT_PORT;

// for supertest testing
const app = appfunc();

app.listen(port, async () => {
  const session = driver.session();
  try {
    await session.run(ConstMatcha.NEO4j_STMT_ID_CONSTRAINT_UNIQUE_ID);
    await session.run(ConstMatcha.NEO4j_STMT_TAG_CONSTRAINT_UNIQUE_NAME);
  } catch (error) {
    session.close();
    throw new ServerRequestError({
      code: 500,
      message: "Failed to create constraints",
      logging: true,
      context: { error }
    });
  }
  session.close();
  clogger.info(`[server]: Server is running at http://localhost:${port}`);
});

// Close the Neo4j session and driver on exit
process.on('exit', async () => {
  await driver.close();
});