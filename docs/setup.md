# Setup guide for local development

## Necessary software

- [MongoDB](https://www.mongodb.com/try/download/community), a NoSQL database
- [MongoDB Compass](https://www.mongodb.com/try/download/compass), a GUI for MongoDB
- [Docker Desktop](https://www.docker.com/products/docker-desktop), a containerization platform

## Setting up the project

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
