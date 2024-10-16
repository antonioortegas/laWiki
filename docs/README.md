# Setup guide for local development

## Used software and tools

- [MongoDB](https://www.mongodb.com/try/download/community), a NoSQL database
- [MongoDB Compass](https://www.mongodb.com/try/download/compass), a GUI for MongoDB
- [Docker Desktop](https://www.docker.com/products/docker-desktop), a containerization platform

## Setting up the project locally

1. Install Docker Desktop (a reboot may be required)
2. Clone the repository
3. cd into the project directory

    ```bash
    cd laWiki/
    ```

4. Run the following command to start the containers

    ```bash
    docker compose -f ./docs/docker-compose.yml up -d
    ```

## Accessing the containers

MongoDB will now be running, and can be accessed via [localhost:27017](http://localhost:27017)

You can access [localhost:8081](http://localhost:8081) with the default credentials and interact with the instance using the web-based GUI [Mongo Express](https://github.com/mongo-express/mongo-express)

Alternatively, you can access the MongoDB instance using MongoDB Compass GUI with the default credentials
