# Matcha

Create dating website, for now i will create frontend directory to separate out first.

## Packages Required

- sudo apt install git vim nodejs npm
- npm install -g create-next-app
- npx create-next-app matcha-frontend
- npm install bcryptjs jsonwebtoken cookies-next mongoose socket.io-client
- npm install @prisma/client prisma --save-dev

## Frontend stack used

- next js
- tailwind css

## Start Frontend Server

```sh
cd matcha-frontend
npm run build
npm start
```

"proxy": "http://localhost:8080", << set this proxy in package.json

## Frontend TODO

- Create responsive layout with header, main section, and footer
- Create Registration and Sign-in Page
- Create User Profile Page
- Create Browsing and Matching Page
- Create Search Functionality Page
- Create Profile View Page
- Create Chat Page
- Create Notifications Page
- Design UI for social network authentication (OmniAuth)
- Apply Security and Infrastructure
