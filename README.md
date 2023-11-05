# Axbot

## Requirements

- NodeJS v18+
- NPM v8+
- MongoDB v6+
- Docker (optional)

## Setup and Development

Before you begin, ensure you have NodeJS, MongoDB, and optional Docker installed.

1. Install nodemon globally:
    ```sh
    npm install -g nodemon
    ```
2. Install project dependencies:
    ```sh
    npm install
    ```

3. Open two terminals for development:

    Terminal 1: Run the development server using nodemon:
    ```sh
    nodemon
    ```
    Terminal 2: Start the application:
    ```sh
    npm run dev
    ```

*Using Mongo Atlas*

If you prefer to use MongoDB Atlas, make the following changes:

1. Open `src/config/database.ts`.

2. Update the database connection URL from:
    ```ts
    let url = mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}
    ```

    to:
    ```ts
    let url = mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}
    ```

This setup compiles TypeScript files to JavaScript in the `dist` directory and starts an Express server using nodemon.

## Docker

To run the application with Docker, ensure you have Docker and Docker Compose installed.

1. Create a `.env` file in the root directory:

    ```sh
    cp .env.example .env
    ```

2. Edit the environment variables in the `.env` file.

3. Open two terminals for development:

    Terminal 1: Run the development server with nodemon:
    ```sh
    npm run dev
    ```

    Terminal 2: Start the Docker container:
    ```sh
    docker compose up
    ```


## WhatsApp API Integration

To integrate WhatsApp API, follow these steps:

1. Go to [Meta For Developers](https://developers.facebook.com) and create an account or log in if you have one.

2. Create a new app on [Meta Apps](https://developers.facebook.com/apps).

3. After creating the app, copy its credentials and update the `.env` file with the new values.

4. Setup [Ngrok](https://ngrok.com/download)
