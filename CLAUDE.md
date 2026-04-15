# Order Management System — Backend

## Project Overview
Food delivery backend like Swiggy/Zomato built with Node.js, Express, MongoDB, Redis, Kafka.

## Tech Stack
- Runtime: Node.js 18
- Framework: Express.js
- Database: MongoDB with Mongoose
- Cache: Redis (ioredis)
- Message Queue: Kafka (kafkajs)
- Auth: JWT + bcrypt
- Validation: express-validator
- Security: helmet, express-mongo-sanitize

## Architecture Pattern
Route → Controller → Service → Database
- Routes: define URLs and middleware chain
- Controllers: handle req/res, call services
- Services: business logic, database operations
- Models: Mongoose schemas

## Role System
Three roles: customer, restaurant_admin, super_admin
Permissions based on roles — defined in config/roles.js
Never hardcode role strings — always use ROLES constant

## Code Style
- CommonJS (require/module.exports) — not ES modules
- async/await — not callbacks or .then()
- asyncHandler wrapper — no try/catch in controllers
- AppError class — for all errors thrown in services
- sendSuccess utility — for all success responses
- All strings in single quotes
- No semicolons optional but be consistent

## Environment Variables
Never hardcode secrets — always use process.env
.env file for local development
.env never committed to git

## Current Phase
Phase 1 — Project setup and Node.js fundamentals

## Important Rules
- Explain every line of code written
- Never write more than one phase worth of code at a time
- After each file — explain what it does
- If I ask why — go deep, dont say "thats how it works"
- Check my understanding before moving to next concept

