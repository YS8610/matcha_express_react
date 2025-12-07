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

  // Sample biographies for seeding
  const sampleBiographies = [
    "Coffee enthusiast and weekend hiker. Love exploring new trails and hidden cafes around the city. Always up for spontaneous adventures!",
    "Passionate about fitness and healthy living. Yoga instructor by day, foodie by night. Looking for someone to share wholesome experiences with.",
    "Book lover and aspiring writer. Spend my weekends in cozy cafes working on my novel. Love deep conversations about life, art, and everything in between.",
    "Tech geek with a love for gaming and anime. Always looking for new challenges and experiences. Let's team up for some co-op adventures!",
    "Nature photographer capturing the beauty of Singapore. Love sunrise hikes and exploring hidden spots. Seeking a companion for outdoor adventures.",
    "Music lover and concert goer. Play guitar in my free time and enjoy jamming with friends. Looking for someone who shares my passion for live music.",
    "Amateur chef experimenting with fusion cuisine. Love hosting dinner parties and trying new restaurants. Let's explore the culinary world together!",
    "Fitness junkie who loves CrossFit and running marathons. Believe in pushing limits and living life to the fullest. Seeking an active partner in crime.",
    "Art enthusiast and museum regular. Love discussing contemporary art and visiting galleries. Looking for someone who appreciates creativity and culture.",
    "Travel addict with a bucket list that keeps growing. Been to 30 countries and counting. Let's plan our next adventure together!",
    "Dog lover and volunteer at the local shelter. Spend my weekends hiking with my golden retriever. Seeking someone who loves animals as much as I do.",
    "Sustainability advocate working towards a greener future. Love gardening, composting, and zero-waste living. Let's make the world better together!",
    "Netflix binge-watcher with impeccable taste in series. Love cozy nights in with good shows and great company. Looking for my binge-watching partner.",
    "Beach bum who lives for the ocean. Surfing, swimming, and beach volleyball are my things. Let's catch some waves together!",
    "Foodie on a mission to try every cuisine. Love street food adventures and hidden gems. Seeking a fellow food explorer to share meals with.",
    "Meditation practitioner finding peace in mindfulness. Yoga, meditation, and spiritual growth are important to me. Looking for a zen partner.",
    "DIY enthusiast who loves creating things from scratch. Woodworking, crafts, and home improvement projects keep me busy. Let's build something together!",
    "Comedy fan who never misses a stand-up show. Love laughing and making others laugh. Seeking someone with a great sense of humor.",
    "Wine connoisseur exploring the world of viticulture. Love wine tastings and pairing dinners. Let's uncork some new experiences together!",
    "Cycling enthusiast exploring every bike trail in Singapore. Love long rides and discovering new routes. Looking for a cycling buddy.",
    "Aspiring polyglot learning multiple languages. Currently working on my Mandarin and Spanish. Let's practice together over coffee!",
    "Theater lover and occasional actor in community plays. Love the arts, drama, and creative expression. Seeking a cultured companion.",
    "Vegan advocate passionate about plant-based living. Love cooking creative vegan dishes and sharing recipes. Let's explore vegan cuisine together!",
    "Photography hobbyist always carrying my camera. Love capturing candid moments and beautiful landscapes. Looking for my muse and adventure partner.",
    "Festival goer who lives for music and good vibes. Love everything from EDM to indie rock. Let's dance the night away at the next festival!"
  ];

  // Helper function to get random tags for a profile
  const getRandomTags = (min: number, max: number): string[] => {
    const count = randomInt(min, max + 1);
    const shuffled = [...popularTags].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Helper function to get random biography
  const getRandomBiography = (): string => {
    return sampleBiographies[Math.floor(Math.random() * sampleBiographies.length)];
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
          biography: $biography,
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
      const biography = getRandomBiography();

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
          biography: biography,
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

      console.log(`Seeded profile: ${profile.username} (Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}, Tags: ${userTags.join(', ')}, Bio: "${biography.substring(0, 50)}...")`);
    }
  } finally {
    await session.close();
  }
}
// match (n:PROFILE) delete n
