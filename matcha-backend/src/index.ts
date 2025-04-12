import dotenv from "dotenv";
import { clogger } from "./service/loggerSvc";
import appfunc from "./app";
import ConstMatcha from "./ConstMatcha";


dotenv.config();
const port = process.env.PORT || ConstMatcha.DEFAULT_PORT;

// for supertest testing
const app = appfunc();

app.listen(port, () => {
  clogger.info(`[server]: Server is running at http://localhost:${port}`);
});