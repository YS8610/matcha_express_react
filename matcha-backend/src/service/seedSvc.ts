import fs from "fs";
import dotenv from "dotenv";
import { randomInt } from "crypto";
import ConstMatcha from "../ConstMatcha.js";
import driver from "../repo/neo4jRepo.js";
import { v4 as uuidv4 } from "uuid";
import { hashPW } from "./authSvc.js";

dotenv.config();

export const seedingProfiles = (num: number) => {
  // Seed data generation
  const firstNames = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack", "Kara", "Leo", "Mia", "Nate", "Olivia", "Paul", "Quinn", "Rita", "Sam", "Tina", "Uma", "Vince", "Wendy", "Xander", "Yara", "Zane"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White"];
  const domains = ["example.com", "mail.com", "test.org", "demo.net", "sample.io"];

  const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n: number, l = 3) => String(n).padStart(l, "0");
  const randomBirthDate = () => {
    const start = new Date(1950, 0, 1).getTime();
    const end = new Date(2005, 11, 31).getTime();
    const t = new Date(start + Math.floor(Math.random() * (end - start)));
    return t.toISOString().slice(0, 10);
  };
  const randomPassword = (i: number) => {
    // simple deterministic-ish password for seed use
    return `P@ss${pad(1000 + i)}Ab`;
  };

  const seedProfiles = Array.from({ length: num }, (_, i) => {
    const first = rand(firstNames);
    const last = rand(lastNames);
    const usernameBase = `${first.toLowerCase()}_${last.toLowerCase()}`;
    const username = `${usernameBase}${i + 1}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@${rand(domains)}`;
    const pw = randomPassword(i + 1);
    return {
      email,
      pw,
      firstName: first,
      lastName: last,
      username,
      birthDate: randomBirthDate()
    };
  });
  return seedProfiles;
}


export const seeding = async (qty: number, seedingProfiles: (num: number) => { email: string, pw: string, firstName: string, lastName: string, username: string, birthDate: string }[]) => {
  const seedProfiles = seedingProfiles(qty);
  const session = driver.session();
  const dbsize = await session.run<{ count: number }>(`MATCH (n:${ConstMatcha.DEFAULT_TAG_PROFILE}) RETURN count(n) AS count`);
  if (dbsize.records[0].get("count") >= qty)
    return;
  for (const profile of seedProfiles) {
    const NEO4J_SEED = `
      CREATE (u:${ConstMatcha.DEFAULT_TAG_PROFILE} {
        id: $id,
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        username: $username,
        pw: $password,
        birthDate: date($birthDate),
        biography: ${ConstMatcha.DEFAULT_BIOGRAPHY},
        gender: $gender,
        sexualPreference: $sexualPreference,
        fameRating: ${ConstMatcha.DEFAULT_FAME_RATING},
        photo0: $photo0,
        photo1: "",
        photo2: "",
        photo3: "",
        photo4: "",
        activated: true,
        lastOnline: $lastOnline,
        createdAt: datetime(),
        updatedAt: datetime()
      })`;
    fs.appendFileSync("./logs/seed_responses.log", `${JSON.stringify(profile)}\n`);
    const hashpw = await hashPW(profile.pw);
    await session.run(
      NEO4J_SEED,
      { id: uuidv4(), firstName: profile.firstName, lastName: profile.lastName, email: profile.email, username: profile.username, password: hashpw, birthDate: profile.birthDate, gender: randomInt(1, 3), sexualPreference: randomInt(1, 3), photo0: "default.png", lastOnline: Date.now() }
    );
    console.log(`Seeded profile: ${profile.username}`);
  }
  await session.close();
}
// match (n:PROFILE) delete n