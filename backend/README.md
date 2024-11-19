# Backend

## Requirements

Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

>[!NOTE]
>If you are rebuilding the containers, you may need to remove the existing ones to avoid conflicts. You can do this by running the following command.
>```bash
>docker system prune -a
>```

## Deploying all microservices

1. Clone the repository to your local machine and cd into it.

```bash
git clone https://github.com/antonioortegas/laWiki.git
cd laWiki
```

2. cd into the `backend` directory.

```bash
cd backend
```

3. Copy the `.env.example` into a new file called `.env`. (Since we are not deploying to the cloud, you can leave the values as they are.)

```bash
cp .env.example .env
```

4. Deploy all microservices running the following command.

```bash
docker compose up -d
```

This will build and start all the microservices and the database. The services will be available at ports 3001 to 3004. (You can change the ports in the .env file if needed.)

5. Seed the database with some initial data, accessing the corresponding endpoint.
[http://localhost:3000/seed](http://localhost:3000/seed), OR

```bash
curl http://localhost:3000/seed
```

6. By default, the services will be available at the following ports:
- [http://localhost:3001/users](http://localhost:3001/users) - Users service
- [http://localhost:3002/wikis](http://localhost:3002/wikis) - Wiki service
- [http://localhost:3003/entries](http://localhost:3003/entries) - Entries service
- [http://localhost:3004/versions](http://localhost:3004/versions) - Versions service
- Adittionally, a mongo-express instance will be available at [http://localhost:8081](http://localhost:8081) to manage the database, with the credentials defined in the .env file, by default `admin:admin`.