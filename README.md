# Matcha

Create dating website, inspiration using tinder website. Forever alone!

## Packages Required

- sudo apt install git vim nodejs npm
- npm install -g create-next-app
- npx create-next-app matcha-frontend
- npm install bcryptjs jsonwebtoken cookies-next mongoose socket.io-client
- npm install @prisma/client prisma --save-dev

## Start Frontend Server

```sh
cd matcha-frontend
npm run build
npm start
```

"proxy": "http://localhost:8080", << set this proxy in package.json

## Frontend PDF Checklist

- Your application must be free of errors, warnings, or notices, both server-side and client-side.
    - to check for npm build npm run and browser console, so far all cleared
- For this project, you are free to use any programming language of your choice.
    - used typescript, ts, tsx, html, css for frontend
- You may use micro-frameworks and any necessary libraries for this project.
    - next js is a full fledge frontend framework
- You are free to use UI libraries such as React, Angular, Vue, Bootstrap, Semantic, or any combination of them.
    - next.config.ts and postcss.config.mjs
- No security vulnerabilities are allowed. You must address at least the mandatory security
requirements, but we strongly encourage you to go beyond them everything depends on it.
    - not yet fully secured, to review and fix it.

## Frontend TODO

- All backend stuff are currently mocked on the frontend, to integrate once ready.
- All pages to be inspired by tinder, to change red to green theme though.
- Currently tailwindcss syntax using version 3, need to switch to version 4.

## Backend Notes

- using express, typescript, postgresql, helmetjs
- yet to see any api endpoint, auth, db table
