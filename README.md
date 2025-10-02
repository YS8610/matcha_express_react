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

1. GET /pubapi/ping
2. POST /pubapi/login
3. POST /pubapi/register
4. GET /pubapi/activate/:token
5. POST /pubapi/reset-password
6. POST /pubapi/reset-password/:userId/:token

## Endpoints need jwt

7. GET /api/user/profile
8. PUT /api/user/profile
9. GET /api/user/tag
10. POST /api/user/tag
11. DELETE /api/user/tag
12. PUT /api/user/pw
13. GET /api/user/photo
14. PUT /api/user/photo/:no
15. DELETE /api/user/photo/:no
16. PUT /api/user/photo/order
17. GET /api/photo/:name

