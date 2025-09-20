# Matcha

Create dating website, inspiration using tinder website. Forever alone!

## Packages Required

- sudo apt install git vim nodejs npm
- npm install -g create-next-app
- npx create-next-app matcha-frontend
- npm install

## Start Frontend Server

```sh
cd matcha-frontend
npm run dev
```

## Backend endpoints

matcha-backend/src/routes/rootRoute.ts

1. GET /pubapi/ping
2. POST /pubapi/login
3. POST /pubapi/register
4. GET /pubapi/activate/:token
5. POST /pubapi/reset-password
6. POST /pubapi/reset-password/:id/:token
7. PUT /api/user/profile
8. PUT /api/user/password
