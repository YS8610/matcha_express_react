import dotenv from "dotenv";
import { argon2i } from "argon2";

dotenv.config();

export default class ConstMatcha{

  // constants for the app
  static readonly DEFAULT_PORT:number = 8080;
  
  // constants for argon2
  static readonly ARGON_HASHLENGTH = 128;
  static readonly ARGON_MEMORYCOST = 131072;
  static readonly ARGON_PARALLELISM = 4;
  static readonly ARGON_TYPE = argon2i;
  static readonly ARGON_SALTLENGTH = 32;
  static readonly ARGON_SECRET = Buffer.from(process.env.HASHING_SECRET || "uKDFkACTga43Qz9Z7V5vGWERXcsdr6hL");

  // constant for jwt secret
  static readonly JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";
  static readonly JWT_EXPIRY = "20d";

  // default value for neo4j
  static readonly NEO4j_DEFAULT_URI = 'bolt://localhost:7687';
  static readonly NEO4j_DEFAULT_USERNAME = 'neo4j';
  static readonly NEO4j_DEFAULT_PASSWORD = 'your_password';
  static readonly NEO4j_DEFAULT_POOL = 50;

  // default value for newly created user
  static readonly DEFAULT_TAG_PROFILE = "PROFILE";
  static readonly DEFAULT_GENDER = 0;
  static readonly DEFAULT_FAME_RATING = 0;
  static readonly DEFAULT_BIRTH_DATE = "\"1000-01-01\"";
  static readonly DEFAULT_BIOGRAPHY = "\"\"";

  // sexual preference
  static readonly SEXUAL_PREFERENCE_MALE = 1;
  static readonly SEXUAL_PREFERENCE_FEMALE = 2;
  static readonly SEXUAL_PREFERENCE_BISEXUAL = 3;

  // statement for neo4j
  // constraints
  static readonly NEO4j_STMT_ID_CONSTRAINT_UNIQUE_ID = `
    CREATE CONSTRAINT unique_id IF NOT EXISTS
    FOR (u:${ConstMatcha.DEFAULT_TAG_PROFILE})
    REQUIRE u.id IS UNIQUE
  `;

  static readonly NEO4j_STMT_TAG_CONSTRAINT_UNIQUE_NAME = `
    CREATE CONSTRAINT unique_tag_name IF NOT EXISTS
    FOR (t:TAG)
    REQUIRE t.name IS UNIQUE
  `;

  // user related statements
  static readonly NEO4j_STMT_CREATE_USER = `
    CREATE (u:${ConstMatcha.DEFAULT_TAG_PROFILE} {
      id: $id,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      username: $username,
      pw: $password,
      birthDate: date($birthDate),
      biography: ${ConstMatcha.DEFAULT_BIOGRAPHY},
      gender: ${ConstMatcha.DEFAULT_GENDER},
      sexualPreference: ${ConstMatcha.SEXUAL_PREFERENCE_BISEXUAL},
      fameRating: ${ConstMatcha.DEFAULT_FAME_RATING},
      photo0: "",
      photo1: "",
      photo2: "",
      photo3: "",
      photo4: "",
      activated: false,
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `;

  static readonly NEO4j_STMT_GET_USER_BY_EMAIL = `
    MATCH (u:PROFILE { email: $email })
    RETURN u{.*}
  `;

  static readonly NEO4j_STMT_GET_USER_BY_USERNAME = `
    MATCH (u:PROFILE { username: $username })
    RETURN u{.*}
  `;

  static readonly NEO4j_STMT_GET_USER_BY_EMAIL_USERNAME = `
    MATCH (u:PROFILE { email: $email, username: $username })
    RETURN u{.*}
  `;

  static readonly NEO4j_STMT_GET_USER_BY_ID = `
    MATCH (u:PROFILE { id: $id })
    RETURN u{.*}
  `;

  static readonly NEO4j_STMT_GET_ALL_USERS = `
    MATCH (u:PROFILE)
    RETURN u{.*}
  `;

  static readonly NEO4j_STMT_ACTIVATE_USER_BY_USERNAME = `
    MATCH (u:PROFILE { username: $username })
    SET u.activated = true
    RETURN u{.*}
  `;

  static readonly NEO4j_STMT_GET_PW_BY_USERNAME = `
    MATCH (u:PROFILE { username: $username })
    RETURN u.pw as pw 
  `;

  static readonly NEO4j_STMT_SET_PW_BY_USERNAME = `
    MATCH (u:PROFILE { username: $username })
    SET u.pw = $hashedpw, u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_SET_PW_BY_ID = `
    MATCH (u:PROFILE { id: $id })
    SET u.pw = $hashedpw, u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_SET_USER_PROFILE_BY_ID = `
    MATCH (u:PROFILE { id: $id })
    SET u.firstName = $firstName,
    u.lastName = $lastName,
    u.email = $email,
    u.gender = $gender,
    u.sexualPreference = $sexualPreference,
    u.biography = $biography,
    u.birthDate = date($birthDate),
    u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_GET_PW_BY_ID = `
    MATCH (u:PROFILE { id: $id })
    RETURN u.pw as pw
  `;

  // statements for tags
  static readonly NEO4j_STMT_GET_TAG_BY_NAME = `
    MATCH (t:TAG { name: $name })
    RETURN t{.*}
  `;

  static readonly NEO4j_STMT_CREATE_TAG = `
    MERGE (t:TAG { name: $name })
    RETURN t{.*}
  `;

  static readonly NEO4j_STMT_CREATE_USER_TAG_REL = `
    MATCH (u:PROFILE { id: $userId }), (t:TAG { name: $tagName })
    MERGE (u)-[:HAS_TAG]->(t)
  `;  
}
