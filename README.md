# secret-server

Secret Server Task

## How to run the app with Docker Compose

git clone
cd backend
docker-compose up
type in the browser: http://127.0.0.1

## How to run the app without Docker Compose

1. Install MongoDB on your machine
2. Update Nodejs and NPM to the latest version
3. git clone
4. You need to build the frontend and install the backend dependencies. (see configuration sections below)
5. Copy the frontend/secret-server/dist/js and frontend/secret-server/dist/img files into the backend/public/js and backend/public/img folders.
6. cd backend and npm start
7. access the page on http://127.0.0.1:8080

### Backend Configuration

Everything be set in environment variables. You should set them first in your environment.
create a backend/.env file using env.tmp to set your own.
Generate a secret key for token encryption: openssl rand256 | base64
You can set a MONGODB_URL or if you use docker leave it empty and set the others (MONGO_USERNAME, MONGO_PASSWORD, MONGO_PORT, MONGO_DB)
the MONGO_HOST settings come from docker-compose db section and you should leave empty in that case.

### Backend Installation

Install project dependencies but first please check your node and npm version number. Use the latest one.
cd backend
npm install

## Backend Testing

cd backend
npm test

## Frontend Build

cd frontend/secret-server
npm install
npm run build
