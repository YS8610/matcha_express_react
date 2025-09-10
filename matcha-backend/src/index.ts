import dotenv from "dotenv";
import { clogger } from "./service/loggerSvc";
import appfunc from "./app";
import ConstMatcha from "./ConstMatcha";
import driver from "./repo/neo4jRepo";


dotenv.config();
const port = process.env.PORT || ConstMatcha.DEFAULT_PORT;

// for supertest testing
const app = appfunc();

app.listen(port, () => {
  clogger.info(`[server]: Server is running at http://localhost:${port}`);
});

// Close the Neo4j session and driver on exit
process.on('exit', async () => {
  await driver.close();
});