import dotenv from "dotenv";
import { argon2i } from "argon2";

dotenv.config();

// notification types
export enum NOTIFICATION_TYPE {
    VIEW = "view",
    LIKE = "like",
    UNLIKE = "unlike",
    MATCH = "match",
    MESSAGE = "message"
  }

export default class ConstMatcha {

  static readonly wsmap = new Map<string, Set<string>>();

  // constants for the app
  static readonly DEFAULT_PORT: number = 8080;

  // photo dump
  static readonly PHOTO_DUMP_DIR = "./photoDump/";

  // ip api for approximate location
  static readonly IP_API_URL = "https://ip-api.com/";

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

  // constants for mail
  static readonly MAIL_FROM = process.env.MAIL_USERNAME || "no_reply@matcha.com";
  static readonly DOMAIN_NAME = process.env.DOMAIN_NAME || "http://localhost";
  static readonly DOMAIN_FE_PORT = process.env.DOMAIN_FE_PORT || 3000;
  static readonly EMAIL_VERIFICATION_SUBJECT = "Matcha Account Activation";
  static readonly EMAIL_PASSWORD_RESET_SUBJECT = "Matcha Password Reset";

  // default value for redis
  static readonly REDIS_DEFAULT_HOST = 'redis://localhost:6379';

  // default value for mongo
  static readonly MONGO_DEFAULT_URI = 'mongodb://localhost:27017/';
  static readonly MONGO_DEFAULT_DB = 'matcha';
  static readonly MONGO_DEFAULT_POOL = 50;
  static readonly MONGO_DEFAULT_TIMEOUT = 5000;
  static readonly MONGO_COLLECTION_NOTIFICATIONS = 'notifications';
  static readonly MONGO_COLLECTION_CHATMESSAGES = 'chatmessages';
  static readonly MONGO_COLLECTION_REPORTS = 'reports';
  static readonly MONGO_COLLECTION_LOCATION = 'location';

  // default value for neo4j
  static readonly NEO4j_DEFAULT_URI = 'bolt://localhost:7687';
  static readonly NEO4j_DEFAULT_USERNAME = 'neo4j';
  static readonly NEO4j_DEFAULT_PASSWORD = 'your_password';
  static readonly NEO4j_DEFAULT_POOL = 50;

  // default value for newly created user
  static readonly DEFAULT_TAG_PROFILE = "PROFILE";
  static readonly DEFAULT_TAG_TAG = "TAG";
  static readonly DEFAULT_GENDER = 0;
  static readonly DEFAULT_FAME_RATING = 50;
  static readonly DEFAULT_BIRTH_DATE = "\"1000-01-01\"";
  static readonly DEFAULT_BIOGRAPHY = "\"\"";

  // user limit
  static readonly NEO4j_USER_MAX_TAGS = 10;
  static readonly NEO4j_USER_MAX_PHOTOS = 5;
  static readonly NEO4j_FAME_INCREMENT_LIKE = 10;
  static readonly NEO4j_FAME_DECREMENT_UNLIKE = -10;
  static readonly NEO4j_FAME_DECREMENT_BLOCK = -5;
  static readonly NEO4j_FAME_DECREMENT_UNBLOCK = 5;

  // sexual preference
  static readonly SEXUAL_PREFERENCE_MALE = 1;
  static readonly SEXUAL_PREFERENCE_FEMALE = 2;
  static readonly SEXUAL_PREFERENCE_BISEXUAL = 3;

  // statement for neo4j
  // constraints
  static readonly NEO4j_STMT_ID_CONSTRAINT_UNIQUE_ID = `
    CREATE CONSTRAINT unique_id IF NOT EXISTS
    FOR (u:${ConstMatcha.DEFAULT_TAG_PROFILE})
    REQUIRE u.id IS UNIQUE;
  `;

  static readonly NEO4j_STMT_TAG_CONSTRAINT_UNIQUE_NAME = `
    CREATE CONSTRAINT unique_tag_name IF NOT EXISTS
    FOR (t:${ConstMatcha.DEFAULT_TAG_TAG})
    REQUIRE t.name IS UNIQUE;
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
      lastOnline: $lastOnline,
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

  static readonly NEO4j_STMT_GET_SHORT_PROFILE_BY_ID = `
    MATCH (u:PROFILE { id: $id })
    RETURN u{.id, .firstName, .lastName, .username, .fameRating, .photo0, .birthDate}
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

  static readonly NEO4j_STMT_GET_SHORT_PROFILE_FILTERED = `
    MATCH (u:PROFILE)
    WHERE u.activated = true AND
    u.fameRating >= $minFameRating AND
    u.fameRating <= $maxFameRating AND
    u.id <> $userId AND
    NOT ( (:PROFILE { id: $userId })-[:BLOCKED]-(u) )
    AND date().year - u.birthDate.year >= $minAge
    AND date().year - u.birthDate.year <= $maxAge
    AND u.gender IN CASE
      WHEN $sexualPreference = ${ConstMatcha.SEXUAL_PREFERENCE_BISEXUAL} THEN [1,2,3]
      WHEN $sexualPreference = ${ConstMatcha.SEXUAL_PREFERENCE_MALE} THEN [2]
      WHEN $sexualPreference = ${ConstMatcha.SEXUAL_PREFERENCE_FEMALE} THEN [1]
      ELSE [1,2,3]
    END
    OPTIONAL MATCH (u)-[:HAS_TAG]->(t:TAG)
    WITH u, collect(t.name) as userTags
    RETURN u{.id, .firstName, .lastName, .username, .fameRating, .photo0, .birthDate}, userTags
    ORDER BY u.fameRating DESC
    SKIP $skip
    LIMIT $limit
  `

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

  static readonly NEO4j_STMT_GET_USER_PROFILE_BY_ID = `
    MATCH (u:PROFILE { id: $id })
    RETURN u{.*}
  `;

  // statements for tags
  static readonly NEO4j_STMT_GET_TAG_BY_NAME = `
    MATCH (t:TAG { name: $name })
    RETURN t{.*}
  `;

  static readonly NEO4j_STMT_SET_LAST_ONLINE_BY_ID = `
    MATCH (u:PROFILE { id: $id })
    SET u.lastOnline = $timestamp
  `;

  static readonly NEO4j_STMT_CREATE_TAG = `
    MERGE (t:TAG { name: $name })
    RETURN t{.*}
  `;

  static readonly NEO4j_STMT_CREATE_USER_TAG_REL = `
    MATCH (u:PROFILE { id: $userId }) MERGE (t:TAG { name: $tagName })
    MERGE (u)-[:HAS_TAG]->(t)
  `;

  static readonly NEO4j_STMT_DELETE_USER_TAG_REL = `
    MATCH (u:PROFILE { id: $userId })-[r:HAS_TAG]->(t:TAG { name: $tagName })
    DELETE r
  `;

  static readonly NEO4j_STMT_GET_USER_TAGS = `
    MATCH (u:PROFILE { id: $userId })-[:HAS_TAG]->(t:TAG)
    RETURN t.name as name
  `;

  static readonly NEO4j_STMT_GET_TAG_COUNTS_BY_USER_ID = `
    MATCH (u:PROFILE { id: $userId })-[:HAS_TAG]->(t:TAG)
    RETURN count(t) as tagCount
  `;

  static readonly NEO4j_STMT_ADD_USER_PHOTO0 = `
    MATCH (u:PROFILE { id: $userId })
    SET u.photo0 = $photoUrl, u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_ADD_USER_PHOTO1 = `
    MATCH (u:PROFILE { id: $userId })
    SET u.photo1 = $photoUrl, u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_ADD_USER_PHOTO2 = `
    MATCH (u:PROFILE { id: $userId })
    SET u.photo2 = $photoUrl, u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_ADD_USER_PHOTO3 = `
    MATCH (u:PROFILE { id: $userId })
    SET u.photo3 = $photoUrl, u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_ADD_USER_PHOTO4 = `
    MATCH (u:PROFILE { id: $userId })
    SET u.photo4 = $photoUrl, u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_GET_ALL_PHOTO_NAME_BY_USER_ID = `
    MATCH (u:PROFILE { id: $userId })
    RETURN [u.photo0, u.photo1, u.photo2, u.photo3, u.photo4] AS photoNames
  `;

  static readonly NEO4j_STMT_SET_PHOTO_ORDER_BY_USER_ID = `
    MATCH (u:PROFILE { id: $userId })
    SET u.photo0 = $photo0,
        u.photo1 = $photo1,
        u.photo2 = $photo2,
        u.photo3 = $photo3,
        u.photo4 = $photo4,
        u.updatedAt = datetime()
  `;

  static readonly NEO4j_STMT_GET_USER_VIEWED_BY = `
    MATCH (u:PROFILE { id: $userId })<-[:VIEWED]-(v:PROFILE)
    RETURN v{.id, .firstName, .lastName, .username, .fameRating, .photo0}
  `;

  static readonly NEO4j_STMT_GET_USER_VIEWED = `
    MATCH (u:PROFILE { id: $userId })-[:VIEWED]->(v:PROFILE)
    RETURN v{.id, .firstName, .lastName, .username, .fameRating, .photo0}
  `;

  static readonly NEO4j_STMT_CHECK_USER_VIEWED = `
    MATCH (:PROFILE { id: $userId })-[r:VIEWED]->(:PROFILE { id: $otherUserId })
    RETURN count(r) > 0 as isViewed
  `;

  static readonly NEO4j_STMT_CREATE_USER_VIEWED_REL = `
    MATCH (u:PROFILE { id: $userId }) with u
    MATCH (v:PROFILE { id: $viewedUserId })
    MERGE (u)-[:VIEWED]->(v)
  `;

  static readonly NEO4j_STMT_GET_USER_LIKED_BY = `
    MATCH (u:PROFILE { id: $userId })<-[:LIKED]-(v:PROFILE)
    RETURN v{.*}
  `;

  static readonly NEO4j_STMT_GET_USER_LIKED = `
    MATCH (u:PROFILE { id: $userId })-[:LIKED]->(v:PROFILE)
    RETURN v{.*}
  `;

  static readonly NEO4j_STMT_CREATE_USER_LIKED_REL = `
    MATCH (u:PROFILE { id: $userId }) with u
    MATCH (v:PROFILE { id: $likedUserId })
    MERGE (u)-[:LIKED]->(v)
  `;

  static readonly NEO4j_STMT_DELETE_USER_LIKED_REL = `
    MATCH (u:PROFILE { id: $userId }) with u
    MATCH (v:PROFILE { id: $likedUserId })
    MATCH (u)-[r:LIKED]->(v)
    DELETE r
  `;

  static readonly NEO4j_STMT_CHECK_USER_LIKED = `
    MATCH (:PROFILE { id: $userId })-[r:LIKED]->(:PROFILE { id: $otherUserId })
    RETURN count(r) > 0 as isLiked
  `;

  static readonly NEO4j_STMT_CHECK_USER_LIKED_BACK = `
    MATCH (:PROFILE { id: $otherUserId })-[r:LIKED]->(:PROFILE { id: $userId })
    RETURN count(r) > 0 as isLikedBack
  `;

  static readonly NEO4j_STMT_IS_MATCHED = `
    MATCH (u:PROFILE { id: $userId })-[:LIKED]-(v:PROFILE {id : $otherUserId})
    RETURN count(*) >= 2 as isMatched
  `;

  static readonly NEO4j_STMT_GET_MATCHED_USERS_SHORT_PROFILE_WITH_ID = `
    MATCH (u:PROFILE { id: $userId })-[:LIKED]->(v:PROFILE),
    (v)-[:LIKED]->(u)
    RETURN v{.id, .firstName, .lastName, .username, .fameRating, .photo0, .birthDate}
  `;

  static readonly NEO4j_STMT_GET_USER_BLOCKED_BY_ID = `
    MATCH (u:PROFILE { id: $userId })-[:BLOCKED]->(v:PROFILE)
    RETURN v{.*}
  `;

  static readonly NEO4j_STMT_CREATE_USER_BLOCKED_REL = `
    MATCH (u:PROFILE { id: $userId }) with u
    MATCH (v:PROFILE { id: $blockedUserId })
    MERGE (u)-[:BLOCKED]->(v)
  `;

  static readonly NEO4j_STMT_DELETE_USER_BLOCKED_REL = `
    MATCH (u:PROFILE { id: $userId }) with u
    MATCH (v:PROFILE { id: $blockedUserId })
    MATCH (u)-[r:BLOCKED]->(v)
    DELETE r
  `;

  static readonly NEO4j_STMT_CHECK_USER_BLOCKED = `
    MATCH (:PROFILE { id: $userId })-[r:BLOCKED]-(:PROFILE { id: $otherUserId })
    RETURN count(r) > 0 as isBlocked
  `;

  static readonly NEO4j_STMT_GET_FAME_RATING_BY_USER_ID = `
    MATCH (u:PROFILE { id: $userId })
    RETURN u.fameRating as fameRating
  `;

  static readonly NEO4j_STMT_SET_FAME_RATING_BY_USER_ID = `
    MATCH (u:PROFILE { id: $userId })
    SET u.fameRating = $fameRating
  `;

}

// MATCH (u:PROFILE { id: "37e4428f-d7ec-4b93-8b78-b81d42b4c8b5" }) with u
// MATCH (v:PROFILE { id: "bd18a016-1142-4ae5-b1f2-1767e9f1ef53" })
// MERGE (u)-[:VIEWED ]->(v)

// MATCH (u:PROFILE { id: $userId }) with u
// MATCH (v:PROFILE { id: $viewedUserId })
// MERGE (u)-[:VIEWED { viewedAt: datetime() }]->(v)

// MATCH (u:PROFILE { id: "37e4428f-d7ec-4b93-8b78-b81d42b4c8b5" }), (v:PROFILE { id: "bd18a016-1142-4ae5-b1f2-1767e9f1ef53" })
// MERGE (u)-[:VIEWED ]->(v)
// MATCH (:PROFILE {id: "bd18a016-1142-4ae5-b1f2-1767e9f1ef53" }) <- [r:VIEWED] - () DELETE r
// MATCH (n) WHERE size(labels(n)) = 0 return n
