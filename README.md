# fc-task-backend

This is the backend service for the FC task project, built with NestJS.

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js >= 18.x
- MySQL database running locally

### ⚙️ Environment Configuration

To connect to your local MySQL database and configure JWT secrets:
1. Copy the `.env.sample` file to `.env`:
   ```bash
   cp .env.sample .env
   ```
2. Fill in the values as needed (DB_HOST, DB_PORT, JWT_SECRET, etc.)

### 🧪 Run the App

```bash
npm install
npm run start:dev
```

This will start the app at: `http://localhost:3000`

### 📬 Postman Collection
You can test the API endpoints using Postman by importing the provided Postman collection from the postman-collection folder.

### Steps:
 1. Open Postman.

 2. Click Import and select the FC-Endpoints.postman_collection.json file.

 3. The collection will be loaded and you can interact with the endpoints.

### 📘 API Documentation (Swagger)

Once the app is running, open this link in your browser to view the Swagger UI:

```
http://localhost:3000/api
```

This provides api documentation of available routes and request bodies.