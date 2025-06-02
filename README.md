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
  npm run dev:express // for express
  npm run dev:nest //for nestjs
  ```

## API Documentation

The API documentation is available through the NestJS application, which must be running to access it. The Express version of the API does not include documentation, although the endpoints are functionally the same.

Documentation can be accessed here:
<http://localhost:4000/api>

## Running Tests

Unit tests and integration tests are implemented as much as possible having the time limit in mind. As test runner i have used vitest also i have used testcontainers to implement integration tests.

- <https://testcontainers.com/?language=nodejs>

### Running unit tests

```
npm run test
```

### Running all tests

```
npm run test
```

### Running unit tests

```
npm run test:unit
```

### Running integration tests

```
npm run test:integ
```

## Project Structure

```
 .
├──  cmd
│   ├──  express.ts
│   └──  nest.ts
├──  dist
│   ├──  cmd
│   ├──  src
│   └──  test
├──  docker
│   ├──  docker-compose.yaml
│   └──  Dockerfile
├──  infrastructure
│   ├──  deployment
│   └──  modules
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
├──  test
│   └──  setupIntegration.ts
├──  Makefile
├──  nest-cli.json
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

## Why Both? NestJS & Express Coexistence Explained

I implemented both a NestJS application and a Express application to demonstrate and validate the separation of the interface layer from the core application logic. While both implementations expose the same functionality, this dual setup serves as a clear illustration of how the application’s core services and use cases are decoupled from any specific web framework.

This approach highlights:

- Interface abstraction: It allows us to swap or layer different interfaces (NestJS, Express, or others) without affecting the domain logic.

- Framework-agnostic architecture: Our core logic (services, use cases, and repositories) remains clean and free from framework-specific decorators or dependencies.

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
