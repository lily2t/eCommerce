E-Commerce Application


This is a comprehensive E-Commerce application built using Node.js and Express.js for the backend, along with Sequelize as the ORM for interacting with the database. The application provides endpoints for managing products, categories, memberships, cart items, orders, and initialization of the database with default data.

Table of Contents
Features
Installation
Usage
API Endpoints
References
Features

Products Management: Add, update, delete, and search for products.

Categories Management: Add, update, delete, and retrieve all categories.

Memberships Management: Add, update, delete, and retrieve all memberships.

Cart Management: Add, update, delete, and retrieve cart items for users.

Orders Management: Create, update status, delete, and retrieve all orders.

Database Initialization: Initialize the database with default data including roles, admin user, memberships, and products fetched from an external API.

Search Functionality: Search for products based on search term, category, and brand.

Installation

Clone the repository:

git clone https://github.com/yourusername/e-commerce-app.git

Navigate to the project directory:

cd e-commerce-app

Install dependencies:

npm install

Set up the database configuration in .env.

Start the server:

npm start

Usage

Once the server is running, 

Initialization

POST /utility/init:  or 
http://localhost:3000/doc/#/Initialization/post_utility_init  Initialize the database with default data.

you can interact with the API using tools like Postman, swagger on
http://localhost:3000/doc


API Endpoints

Products

POST /products: Add a new product.
GET /products: Get all products.
PUT /products/:productId: Update a product by ID.
DELETE /products/:productId: Soft delete a product by ID.

Categories

POST /categories: Add a new category.
GET /categories: Get all categories.
PUT /categories/:categoryId: Update a category by ID.
DELETE /categories/:categoryId: Delete a category by ID.

Memberships

POST /memberships: Add a new membership.
GET /memberships: Get all memberships.
PUT /memberships/:membershipId: Update a membership by ID.
DELETE /memberships/:membershipId: Delete a membership by ID.

Cart

POST /cart: Add a product to the cart.
GET /cart: Get all cart items for a user.
PUT /cart/:cartItemId: Update a cart item by ID.
DELETE /cart/:cartItemId: Delete a cart item by ID.

Orders

GET /orders: Get all orders (for admin).
PUT /orders/:orderId: Update order status by ID (for admin).
POST /orders: Create a new order.
DELETE /orders/:orderId: Delete an order by ID (for admin).

Search

POST /search: Search for products based on search term, category, and brand.


References

Sequelize Documentation: https://sequelize.org/
Express.js Documentation: https://expressjs.com/
Node.js Documentation: https://nodejs.org/
Swagger Documentation: https://swagger.io/docs/


External Sources

Noroff API: Used to fetch product data during database initialization.
Stack Overflow: Referenced for various coding issues and solutions.
ChatGPT: Referenced for various coding issues.

Technologies used on this application:

Node.js for server-side execution
Express.js as the web application framework for API development
Swagger for API documentation and testing
Axios for handling HTTP requests to external APIs
Crypto for cryptographic operations
Dotenv for managing environment variables from a .env file
EJS as the templating engine
Express-validator for validating incoming request data
Jsonwebtoken for generating and verifying JSON Web Tokens (JWT)
Mysql2 as the MySQL client
Sequelize as the ORM for database management
Swagger-autogen for automating Swagger documentation generation
Swagger-ui-express for serving the Swagger UI for API exploration
Jest for testing JavaScript code
Supertest for HTTP assertion testing