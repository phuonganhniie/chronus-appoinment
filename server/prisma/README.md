This README outlines the steps necessary to create/update tables in the PostgreSQL database for the Calendar App using Prisma Migrate.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma CLI](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-cli)

Make sure your PostgreSQL database is running and accessible at `postgresql://admin:admin@localhost:5432/calendar-app-db`.

## Environment Setup

1. Install project dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env` file in the root of your project directory and provide your database connection URL:

```plaintext
# .env
DATABASE_URL="postgresql://admin:admin@localhost:5432/calendar-app-db?schema=public"
```

## Running Migrations

To apply migrations and create tables in your database, follow these steps:

### Generate the Prisma client:
```bash
npx prisma migrate dev --name init
```
This command will create for migration files in the `prisma/migrations` directory and apply them to your database.

### Run the migrations to apply the schema changes to your database:

```bash
prisma migrate dev 
```
This will keep your database schema in sync with your Prisma schema. The commands will also regenerate Prisma Client.

## Reviewing the Database
After running migrations, you can view the current state of your database schema using Prisma Studio:

``` bash
npx prisma studio
```
This will open a web interface where you can view and manipulate data in your database.

---

For more detailed instructions, visit the [Prisma Migrate Documentation](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql).