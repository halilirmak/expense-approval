NAME:=application
DC=docker-compose -f ./docker/docker-compose.yaml --env-file ./.env
clean:
	$(DC) down --rmi local --remove-orphans -v
	$(DC) rm -f -v

migrate: db-up
	sleep 5;
	npx prisma migrate dev --name init
	npx prisma generate

docker-build: 
	docker build -f docker/Dockerfile -t app .

db-down:
	$(DC) down postgres

db-up: 
	$(DC) up -d postgres

env: 
	cp .env.example .env

setup: env migrate
