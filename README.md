Admin Dashboard Project

## Getting Started

Run the following commands to start the development server:

```
pnpm install
pnpm dev
```

You should now be able to access the application at http://localhost:3000.

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name text NOT NULL,
email text NOT NULL UNIQUE,
password varchar NOT NULL,
);
