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

## Data Seeding

The application seeds initial data from a JSON file on startup.

### Configuration

Edit `spring-boot-backend/src/main/resources/application.properties`:

```properties
seed.enabled=true  # Set to false to disable seeding
```

### Seed Data

The seed data is stored in: `spring-boot-backend/src/main/resources/seed-data.json`

Contains:
- 1 test user (test@homerp.com)
- 1 default account (Main Account)
- Categories (INCOME and EXPENSE)
- 991 transactions

### How It Works

The `DataSeeder` runs on application startup and:

1. Creates a test user if not exists
2. Creates a default "Main Account" if not exists
3. Creates all categories (INCOME and EXPENSE)
4. Imports all transactions
5. Skips if database already contains data (to avoid duplicates)

### Disable Seeding

To start fresh without seeding:

```properties
seed.enabled=false
```

Then manually delete the database or run:
```bash
docker-compose down -v
```

### Updating Seed Data

To regenerate the seed-data.json from a new Excel file, run the Python script in the backend and copy the output to resources:
```bash
python3 scripts/generate_seed.py
```