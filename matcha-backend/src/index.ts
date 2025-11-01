import dotenv from "dotenv";
import { clogger } from "./service/loggerSvc.js";
import appfunc from "./app.js";
import ConstMatcha from "./ConstMatcha.js";
import driver from "./repo/neo4jRepo.js";
import { setAllConstraints } from "./service/constraintSvc.js";
import { serverErrorWrapper } from "./util/wrapper.js";
import { createServer } from "http";
import { Server } from "socket.io";
import eventHandlers from "./websocket/eventHandler.js";
import  redisClient from "./repo/redisRepo.js";
import { closeClient } from "./repo/mongoRepo.js";
import { seeding, seedingProfiles } from "./service/seedSvc.js";

dotenv.config();
const port = process.env.PORT || ConstMatcha.DEFAULT_PORT;

// for supertest testing
const app = appfunc();

// websocket server setup
const server = createServer(app);
const io = new Server(server);
eventHandlers(io);

// start http server
server.listen(port, async () => {
  await serverErrorWrapper(setAllConstraints, "failed to set constraints");
  await seeding(10, seedingProfiles);
  // await redisClient.connect().catch(err => {
  //   clogger.error(`[redis]: Could not connect to Redis: ${err}`);
  // });
  clogger.info(`[server]: Server is running at http://localhost:${port}`);
});

// Close the Neo4j session and driver on exit
process.on('exit', async () => {
  // await redisClient.quit();
  // clogger.info('[server]: Redis client closed');
  await driver.close();
  clogger.info('[server]: Neo4j driver closed');
  await io.close();
  clogger.info('[server]: Socket.IO server closed');
  server.close();
  clogger.info('[server]: Server closed to new connections');
  server.closeAllConnections();
  clogger.info('[server]: All existing socket io connections closed');
  await closeClient();
  clogger.info('[server]: MongoDB client closed');
});