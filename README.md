# homERP

Home ERP for managing cash inflows and outflows.

## Tech Stack

- Spring Boot 3.3.0
- PostgreSQL

## Project Structure

```
homERP/
├── docker-compose.yml          # PostgreSQL container
├── spring-boot-backend/     # Spring Boot API
│   ├── pom.xml
│   └── src/
└── README.md
```

## Prerequisites

- Java 17+
- Maven (or run `mvn wrapper:wrapper` in `spring-boot-backend/` to generate Maven Wrapper)
- Docker (for PostgreSQL)

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Run Backend

```bash
cd spring-boot-backend
mvn spring-boot:run
```

The API will be available at http://localhost:8080

API Documentation: http://localhost:8080/swagger-ui.html

## Docker Commands

```bash
docker-compose up -d      # Start
docker-compose down       # Stop
docker-compose down -v    # Stop and remove volume
```