# Turbo Full Stack Assessment

This template provides a minimal setup for a Turbo Full Stack project. It
includes the following packages (explain which you are unfamiliar with):

- TypeScript
- Nest.js
- Prisma
- React
- Tailwind CSS
- Shadcn Components
- ESLint
- Docker Compose (Postgres, Redis)

## Tech Assessment Instructions

The goal of this assessment is to evaluate your proficiency working across the
full stack. You will be asked to complete a series of tasks that involve
adding endpoints to the Nest.js API, updating the React front end, and
implementing new features.

## Preparation

1. **System Requirements:**
   - Ensure you have Node.js installed, preferably version 20, as it is required by the project.
   - You may use any code editor of your choice (e.g., VSCode, Atom).
   - Access to the internet and the ability to share your screen during the assessment.

2. **Repository Setup:**
   - Please clone the repository from GitHub:
     `git clone https://github.com/thebrubaker/turbo-full-stack-assessment.git`
   - Navigate into the project directory:
     `cd turbo-full-stack-assessment`
   - Copy the example environment file:
     `cp .env.example .env`
   - Start Postgres and Redis:
     `docker-compose up -d`
   - Install dependencies:
     `npm install`
   - Generate Prisma client and run migrations:
     `npx prisma generate && npx prisma migrate dev`
   - Start the mono-repo apps:
     `npx turbo dev`

3. **During the Assessment:**
   - You are free to use any tools or online resources, including Google and AI assistance, to aid in your coding during the assessment.
   - The tasks will be presented to you at the beginning of the call. They will involve:
      - **Nest.js API:** Adding endpoints to the existing API.
      - **React Front End:** Updating the React front end to consume the new API
      endpoints.
      - **New Features:** Implementing new features in the React front end.

4. **Screen Sharing:**
   - You will be required to share your screen throughout the assessment. Please ensure your internet connection is stable enough to support screen sharing without significant lag.

5. **Interview Etiquette:**
   - Feel free to ask clarifying questions at any time.
   - Discuss your thought process openly as you work through the tasks. This discussion is as important as the final code.

## Repository Overview

The repository is set up with the following key files:

### Database Schema (`prisma/schema.prisma`)

Defines a User model with fields:

- `id`: Auto-incrementing primary key
- `email`: Unique string
- `firstName`: String
- `lastName`: String
- `password`: String

The schema uses PostgreSQL as the database provider, configured via environment variables.

### Frontend Sign Up Page (`apps/web/src/app/page.tsx`)

Contains a React component rendering a sign-up form with:

- First name and last name inputs
- Email input
- Password input
- Submit button
The form uses Shadcn UI components for consistent styling.

### API Users Controller (`apps/api/src/users/users.controller.ts`)

A NestJS controller that:

- Uses Prisma service for database operations
- Currently implements a GET endpoint to fetch users by ID
- Returns user data from the database

The repository follows a monorepo structure using Turborepo, with separate apps for the frontend (Next.js) and backend (NestJS), sharing a common database layer through Prisma.

## End of Assessment

- You will have a chance to discuss and explain your solutions.
- We are interested in your approach and problem-solving strategies, so detailed explanations are encouraged.
- Feedback will be provided at the end of the session.

We look forward to seeing your coding skills in action. Good luck!
