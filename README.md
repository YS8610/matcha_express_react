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

- /pubapi/ping - Health check
- /pubapi/login - User login with username/password
- /pubapi/register - User registration with all required fields
- /pubapi/activate/:token - Account activation

- Currently activation not fully implemented, need to wait before testing further.
- /api/user/profile - Profile updates (protected route)
