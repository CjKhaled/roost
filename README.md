# Roost Backend API

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 20.18)
- PostgreSQL (version 14.13)
- Git
- Postman (for API testing)

## Getting Started

### 1. Clone the Repository
git clone https://github.com/CjKhaled/roost.git  
cd roost

### 2. Branch Naming Convention
Create a new branch based on the type of work you're doing:

- For bug fixes:  
  git checkout -b fix/feature_name

- For new features or issues:  
  git checkout -b feature/feature_name

### 3. Database Setup

- Install PostgreSQL 14.13 if you haven't already.
- Create a new database:  
  CREATE DATABASE roost;

### 4. Environment Configuration

- Create a .env file in the root directory.
- Add the following configuration:  
  DATABASE_URL_DEV=postgresql://username:password@localhost:5432/roost  
  Replace username, password, and database name with your local machine configuration

### 5. Installation
Install project dependencies:  
npm install

### 6. Starting the Server
Run the development server:  
npm start

### 7. API Testing
Use Postman to interact with the API endpoints. Refer to the routes directory to see what you can do so far.

## Development Workflow

1. Create a new branch following the naming convention.
2. Make your changes.
3. Run npm test to ensure your changes don't break anything else
4. Run npm run lint to adhere to formatting guidelines
5. Submit a pull request.


## Troubleshooting Tests

Sometimes, the changes you make need to change the way a test needs to work. Add whatever changes you made to a test to your Pull Request.
