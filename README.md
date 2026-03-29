#  Finance Manager App

A full-stack Finance Manager application that helps users track expenses, manage budgets, and gain insights into their financial habits.

---

##  Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Tailwind CSS**

### Backend

* **NestJS**
* **TypeScript**
* **Prisma ORM**

### Database

* **PostgreSQL**

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Protected routes with authorization guards

### Expense Management

* Create, read, update, and delete expenses
* Associate expenses with categories
* User-specific data isolation

### Budget Management

* Set monthly budgets
* Update and track spending limits
* Manage budgets per user

### Categories

* Predefined categories
* Used for organizing expenses

### Statistics

* Monthly financial insights
* Expense summaries and analytics
* Read-only statistical data

---

## 🏗️ Backend Architecture

The backend is structured into modular components:

* **Auth Module**

  * Handles user registration and login
  * Uses JWT for authentication
  * Includes guards for route protection

* **Expense Module**

  * CRUD operations for expenses
  * Validated using DTOs

* **Budget Module**

  * CRUD operations for budgets
  * User-specific budget control

* **Category Module**

  * Fetches predefined categories

* **Stats Module**

  * Provides aggregated financial data

* **Prisma Module**

  * Database access layer using Prisma ORM

---
