# secret-server

Secret Server Task

## Backend Configuration

Everything be set in environment variables. You should set them first in your environment.
create a backend/.env file using env.tmp to set your own.
Generate a secret key for token encryption: openssl rand256 | base64

## Backend Installation

Install project dependencies but first please check your node and npm version number. Use the latest one.
cd backend
npm install

## Backend Testing

cd backend
npm test

## Start Application

cd backend
npm start
