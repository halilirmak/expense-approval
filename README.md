## Overview

This service handles expense management approval. It includes a REST API interface and follows a layered architecture.

## Prerequisites

- Node 20+
- Docker & Docker Compose
- Make (optional)

## Setup

### Install Dependencies

```
npm i
```

### Configure Environment Variables

```
PORT=4000
APP_NAME="loan-app"
PG_HOST=localhost
PG_USER=user
PG_PASSWORD=password
PG_DB_NAME=loan
PG_PORT=5432
APP_DATABASE_URL="postgresql://user:password@localhost:5432/loan?schema=public"
APP_LOG_LEVEL="debug"
```

You can pass this step, since it is a test project i am sending the .env file as well

## Runing the project

```
cp .env.example .env
docker-compose -f ./docker/docker-compose.yaml --env-file ./.env up postgres -d
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

- with Make:

  ```
  make setup
  npm run dev
  ```

## API Documentation

Due to limited time i was not able to add swagger documentation, however here is basic documentation:

```
POST localhost:4000/user
Body:
{
 "email": "example@example.com",
 "managerId": uuid // this field is optional once a user created, another user can be assigned to diffrent user as managed to them, since approvals work user -> manager -> manager -> end Manager
}

Response:
{
 "id": uuid //user id
}
```

```
POST localhost:4000/expense
Body:
{
 "amount": "200.00",
 "submitterId": uuid //user id
}

Response:
{
 "id": uuid // returns expense id
}
```

```
POST  localhost:4000/expense/:expenseId
Body:
{
 "APPROVAL": "APPROVED|REJECTED",
 "userId": uuid // userid of the approver
  "reason": string //required once rejected.
}

Response:
{
 "expense": {
  "id": "4c210dcd-7c2d-4371-890c-f4798071ad34",
  "amount": "20",
  "status": "APPROVED", // automatically approves once every manager approves it, or automatically rejects once someone rejects it to end the approval queue
  "submitterId": "be8a212c-28d3-4718-8f5c-2341f204811f"
 },
 "assignment": {
  "id": "88972d07-6435-4016-b7cf-0d3c3ca42947",
  "expenseId": "4c210dcd-7c2d-4371-890c-f4798071ad34",
  "approverId": "bd20d006-e322-48d4-9c3d-87d88f17e83f",
  "status": "APPROVED"
 }
}
```

## Running Tests

Unit tests have been implemented, but integration tests are not included due to time constraints. For integration testing, the Testcontainers package is recommended.

- <https://testcontainers.com/?language=nodejs>

### Running unit tests

```
npm run test
```

## Project Structure

```
 .
├──  cmd
│   └──  index.ts
├──  dist
│   ├──  cmd
│   └──  src
├──  docker
│   ├──  docker-compose.yaml
│   └──  Dockerfile
├──  infrastructure
│   ├──  deployment
│   └──  modules
├──  logs
│   ├──  error.log
│   └──  info.log
├──  prisma
│   ├──  migrations
│   └──  schema.prisma
├──  src
│   ├──  application
│   ├──  common
│   ├──  config
│   ├──  domain
│   ├──  infra
│   └──  interfaces
├──  Makefile
├──  nodemon.json
├──  package-lock.json
├──  package.json
├──  README.md
├──  tsconfig.json
└──  vitest.config.ts
```

### Interface Layer

Interface layer is responsible for handling the user requests. At the moment we only rest api however in feature
this could be extended with grpc, graphql, websocket, message queues etc.

### Infastructure Layer

Infastructure layer is responsible for external dependencies like databases, caching, messaging queues, 3rd party interfaces etc. It acts as a bridge between application layer and
external services.

### Application Layer

Application layer is responsible for orchestrating the flow of data between user facing interfaces, this layer does not contain business logic, the whole responsibility is cordinating tasks
from infrastructure layer and domain layer.

### Domain Layer

Domain layer contains core business logic and business rules. This layer is independent of the external systems.

## Solution

When a user creates an expense:

- If they have no manager, the expense is automatically approved.

- If they have a manager, the expense is sent to that manager for approval or rejection.

- If the manager also has a manager, the approval request continues up the chain until there are no more managers.

At any point, if any manager rejects the expense, the process stops immediately and the expense is marked as REJECTED.

## Infrastructure & Deployment

Infrastructure is provisioned using Terraform. Core components are modular and reusable. Please note it is to give an infrastructure idea, not have been tested.

### Prerequisites

- Terraform 1.12+
- S3 bucket for remote state: terraform-state-loanapplication (or update versions.tf)
- AWS Secrets Manager configured with secret paths like /app-secrets-<env> (or update main.tf)

### How to create new terraform workspace

Terraform workspace workspace works as env in this application. To create new workspace:

```
/infrastructure/main
terraform workspace new NAME
```

### How to deploy?

```
/infrastructure/main
terraform plan
```

this would show for you all the components changes on your infrastructure once happy

```
/infrastructure/main
terraform apply
```

### How Components Working?

There is 5 key components VPC, RDS, ECR, IAM and finally Elastic Beanstalk.

ECR is for container registry.
RDS instance is hosted private subnet of the VPC and Elastic beanstalk is hosted public subnet of the VPC, this way we do not expose the RDS instance in over internet.

Elastic beanstalk pulls the image securely from ECR with and iam role attached with least privilege principle.

Due to time constraints, i was not able to implement IAM authentication on RDS database, but idea is, creating an role and with that role exchanging authentication token to talk to RDS database.
