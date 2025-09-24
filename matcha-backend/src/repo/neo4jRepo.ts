import dotenv from "dotenv";
import neo4j from "neo4j-driver";
import ConstMatcha from "../ConstMatcha.js";

dotenv.config();

// docker network ls
// docker network inspect bridge
const driver = neo4j.driver(
  // Neo4j URI
  process.env.NEO4J_URI || ConstMatcha.NEO4j_DEFAULT_URI,
  // Authentication
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || ConstMatcha.NEO4j_DEFAULT_USERNAME,
    process.env.NEO4J_PASSWORD || ConstMatcha.NEO4j_DEFAULT_PASSWORD
  ),
  // Configuration
  { 
    maxConnectionPoolSize: parseInt(process.env.NEO4J_POOL || ConstMatcha.NEO4j_DEFAULT_POOL.toString(), 10)
  }
);

export default driver;