import dotenv from "dotenv";
import { clogger } from "./service/loggerSvc.js";
import appfunc from "./app.js";
import ConstMatcha from "./ConstMatcha.js";
import driver from "./repo/neo4jRepo.js";
import { setAllConstraints } from "./service/constraintSvc.js";
import { serverErrorWrapper } from "./util/wrapper.js";


dotenv.config();
const port = process.env.PORT || ConstMatcha.DEFAULT_PORT;

// for supertest testing
const app = appfunc();

app.listen(port, async () => {
  await serverErrorWrapper(setAllConstraints, "failed to set constraints");
  clogger.info(`[server]: Server is running at http://localhost:${port}`);
});

// Close the Neo4j session and driver on exit
process.on('exit', async () => {
  await driver.close();
});