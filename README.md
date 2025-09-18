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

1. GET /pubapi/ping - matcha-backend/src/routes/rootRoute.ts
2. POST /pubapi/login - matcha-backend/src/routes/rootRoute.ts
3. POST /pubapi/register - matcha-backend/src/routes/rootRoute.ts
4. GET /pubapi/activate/:token - matcha-backend/src/routes/rootRoute.ts
5. POST /pubapi/reset-password - matcha-backend/src/routes/rootRoute.ts
6. POST /pubapi/reset-password/:id/:token - matcha-backend/src/routes/rootRoute.ts
7. PUT /api/user/profile - matcha-backend/src/routes/auth/userRoute.ts
