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

- GET   /pubapi/ping
- POST  /pubapi/ping
- GET   /pubapi/photo/:name
- POST  /pubapi/login
- POST  /pubapi/register
- GET   /pubapi/activate/:token
- POST  /pubapi/reset-password
- POST  /pubapi/reset-password/:userId/:token

## Endpoints need jwt

- GET       /api/photo/:name
- GET       /api/user/profile
- PUT       /api/user/profile
- GET       /api/profile/short/:userId
- GET       /api/profile/:userId
- GET       /api/user/tag
- POST      /api/user/tag
- DELETE    /api/user/tag
- PUT       /api/user/pw
- GET       /api/user/photo
- PUT       /api/user/photo/:no
- DELETE    /api/user/photo/:no
- PUT       /api/user/photo/order
- GET       /api/user/viewed
- GET       /api/user/viewed/by
- POST      /api/user/viewed
- GET       /api/user/liked/by
- POST      /api/user/liked
- DELETE    /api/user/liked
- GET       /api/user/liked/matched 
- GET       /api/user/block
- POST      /api/user/block
- DELETE    /api/user/block
- GET       /api/user/notification?limit=20&offset=0
- DELETE    /api/user/notification
- PUT       /api/user/notification


## Websockets Client to Server Events

- isOnline - Check online status of users
    - Payload: userIds: string[]
- chatMessage - Send chat message
    - Payload: {fromUserId, toUserId, content, timestamp}

## Websockets Server to Client Events

- notification - Receive notifications
    - Types: VIEW, LIKE, MATCH, UNLIKE
- onlineStatus - Receive online status response
    - Payload: Record<string, boolean>
- serverChatmsg - Receive chat messages
    - Payload: {fromUserId, toUserId, content, timestamp}
- error - Error messages
    - Payload: {msg: string}

## Connection Events

- connection - User connects to WebSocket
- disconnect - User disconnects from WebSocket
