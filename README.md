# Self-Service System Happy Herbivore

## Table of contents

- [Self-Service System Happy Herbivore](#self-service-system-happy-herbivore)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Installation Guide](#installation-guide)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
  - [Building for production](#building-for-production)
  - [Authors](#authors)
  - [License](#license)

## Overview

This project is a self-service ordering system created as a school assignment for a fictional company, _Happy Herbivore_. The system is divided into three main parts:

1. API (`/server`)

   - Supplies product data to the front-end.
   - Handles incoming orders by storing them in the database.
   - Uses WebSockets to broadcast new orders to the dashboard in real time.

2. Front-end (`/react`)

   - A user-friendly application designed for customers to browse products and place orders.
   - Provides a seamless ordering experience on a touchscreen or kiosk.

3. Back-end (`/dashboard`)

   - A dashboard accessible only to employees.
   - Displays incoming orders and relevant statistics for order management.

4. Documents (`/docs`)
   - The video, receipt and questions from the field research (`/docs/field-research`)
   - Test documents (compatibility- functional- and performance test) (`/docs/tests`)
   - Database ERD, functional design and UI design.

## Installation Guide

Follow these steps to set up and run the _Happy Herbivore_ self-service system.

### Prerequisites

Requirements for running the website locally (in your browser)

- [Bun](https://bun.sh/) (or a package manager combined with a TypeScript runtime of choice, this guide uses Bun because it's an all-in-one sollution.)
- [MySQL](https://www.mysql.com/)

### Installation Steps

1. Clone the repository
   Clone the repository and navigate to the project folder:

   ```
   git clone https://github.com/TwanAsselbergs/happy-herbivore.git
   cd happy-herbivore
   ```

2. Install dependencies  
   Install dependencies for both the front-end and API:

   ```bash
   cd react && bun i && cd ../server && bun i && cd ../dashboard && bun i && cd ..
   ```

3. Create a new database

   ```mysql
   # Make sure to run this inside of a MySQL shell
   CREATE DATABASE happy_herbivore;
   ```

4. Configure the API  
   4.1. Navigate to the `/server` directory:

   ```bash
   cd server
   ```

   4.2. Copy the `.env.example` file and rename it to `.env`:

   ```bash
   cp .env.example .env
   ```

   4.3. Edit the `.env` file and update the database URL with your credentials.

5. Migrate and seed the database

   ```bash
   bunx migrate dev
   bun ./src/db/seed.ts
   ```

6. Start the API

   ```bash
   bun --watch ./index.ts
   ```

7. Configure the front-end

   Open a new terminal, navigate to the `react` directory, copy the `.env.example` file and rename it to `.env`:

   ```bash
   cd <path-to-the-repo>/react
   cp .env.example .env
   ```

8. Start the front-end

   ```bash
   bun run dev
   ```

Now the system should be up and running! 🚀

## Building for production

_(View [STARTUP.md](STARTUP.md))_

## Authors

- **Noah Kamphuisen** - _Front-/back-end development, documentation, design_ - [NoahMelle](https://github.com/NoahMelle)
- **Twan Asselbergs** - _Front-/back-end development, documentation, design_ - [TwanAsselbergs](https://github.com/TwanAsselbergs)

## License

This project is licensed under the [MIT](LICENSE.md)
License - see the [LICENSE.md](LICENSE.md) file for
details
