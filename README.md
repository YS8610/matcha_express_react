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

## Endpoints no jwt

All working so far, photo test endpoint only.

- GET /pubapi/ping
- POST /pubapi/ping
- GET /pubapi/photo/:name
- POST /pubapi/login
- POST /pubapi/register
- GET /pubapi/activate/:token
- POST /pubapi/reset-password
- POST /pubapi/reset-password/:userId/:token

## Endpoints need jwt

- GET /api/user/profile
- PUT /api/user/profile
- GET /api/user/tag
- POST /api/user/tag
- DELETE /api/user/tag
- PUT /api/user/pw
- GET /api/user/photo
- PUT /api/user/photo/:no
- DELETE /api/user/photo/:no
- PUT /api/user/photo/order
- GET /api/photo/:name
- GET /api/user/viewed
- GET /api/user/viewed/by
- POST /api/user/viewed
- GET /api/user/liked/by
- POST /api/user/liked
- DELETE /api/user/liked
