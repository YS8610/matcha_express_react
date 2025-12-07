import fs from "fs";
import dotenv from "dotenv";
import { randomInt } from "crypto";
import ConstMatcha from "../ConstMatcha.js";
import driver from "../repo/neo4jRepo.js";
import { v4 as uuidv4 } from "uuid";
import { hashPW } from "./authSvc.js";
import { updateUserLocation } from "./locationSvc.js";

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

  // Default photos to rotate through
  const defaultPhotos = ["default.png", "default2.png", "default3.png", "default4.png", "default5.png"];

  // Popular tags for seeding
  const popularTags = [
    "travel", "fitness", "music", "cooking", "photography", "hiking", "yoga", "reading",
    "gaming", "art", "movies", "coffee", "wine", "dancing", "sports", "fashion",
    "technology", "foodie", "adventure", "beach", "mountains", "cycling", "running",
    "swimming", "meditation", "vegan", "vegetarian", "pets", "dogs", "cats",
    "nature", "camping", "surfing", "skiing", "climbing", "netflix", "anime",
    "books", "writing", "poetry", "guitar", "piano", "singing", "concerts",
    "festivals", "theater", "comedy", "diy", "crafts", "baking", "grilling",
    "gardening", "sustainability", "volunteering", "languages", "history", "science"
  ];

  // Helper function to get random tags for a profile
  const getRandomTags = (min: number, max: number): string[] => {
    const count = randomInt(min, max + 1);
    const shuffled = [...popularTags].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Singapore coordinate bounds
  // Latitude: 1.15 to 1.47, Longitude: 103.6 to 104.0
  const randomSingaporeLocation = () => {
    const latitude = 1.15 + Math.random() * (1.47 - 1.15);
    const longitude = 103.6 + Math.random() * (104.0 - 103.6);
    return { latitude, longitude };
  };

  try {
    const dbsize = await session.run<{ count: number }>(`MATCH (n:${ConstMatcha.DEFAULT_TAG_PROFILE}) RETURN count(n) AS count`);
    if (dbsize.records[0].get("count") >= qty)
      return;
    for (let i = 0; i < seedProfiles.length; i++) {
      const profile = seedProfiles[i];

      // Rotate photos for each user (different starting index)
      const photoStartIndex = i % defaultPhotos.length;
      const userPhotos = [
        defaultPhotos[photoStartIndex],
        defaultPhotos[(photoStartIndex + 1) % defaultPhotos.length],
        defaultPhotos[(photoStartIndex + 2) % defaultPhotos.length],
        defaultPhotos[(photoStartIndex + 3) % defaultPhotos.length],
        defaultPhotos[(photoStartIndex + 4) % defaultPhotos.length]
      ];

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
          photo1: $photo1,
          photo2: $photo2,
          photo3: $photo3,
          photo4: $photo4,
          activated: true,
          lastOnline: $lastOnline,
          createdAt: datetime(),
          updatedAt: datetime()
        })`;
      fs.appendFileSync("./logs/seed_responses.log", `${JSON.stringify(profile)}\n`);
      const hashpw = await hashPW(profile.pw);
      let tid = uuidv4();
      const location = randomSingaporeLocation();

      await session.run(
        NEO4J_SEED,
        {
          id: tid,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          username: profile.username,
          password: hashpw,
          birthDate: profile.birthDate,
          gender: randomInt(1, 3),
          sexualPreference: randomInt(1, 3),
          photo0: userPhotos[0],
          photo1: userPhotos[1],
          photo2: userPhotos[2],
          photo3: userPhotos[3],
          photo4: userPhotos[4],
          lastOnline: Date.now()
        }
      );
      await updateUserLocation(tid, profile.username, location.latitude, location.longitude);

      // Add random tags to the profile
      const userTags = getRandomTags(2, 5);
      for (const tag of userTags) {
        const tagName = tag.toLowerCase().trim();
        // Create TAG node if it doesn't exist, then create HAS_TAG relationship
        await session.run(
          `MERGE (t:TAG {name: $tagName})
           WITH t
           MATCH (u:${ConstMatcha.DEFAULT_TAG_PROFILE} {id: $userId})
           MERGE (u)-[:HAS_TAG]->(t)`,
          { tagName, userId: tid }
        );
      }

      console.log(`Seeded profile: ${profile.username} (Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}, Tags: ${userTags.join(', ')})`);
    }
  } finally {
    await session.close();
  }
}
// match (n:PROFILE) delete n
