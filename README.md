# AI-Genius SaaS Platform — Security & Authentication Module
This repository contains the complete implementation of a secure, stateless authentication and authorization subsystem designed for the **AI-Genius** SaaS platform. The system enforces strict Role-Based Access Control (RBAC) and robust token lifecycle management.
Developed as part of the **MA 216 – Web Engineering and AI** coursework at the Faculty of Computing and AI, Air University, Islamabad.
---
## 🚀 Key Features Implemented
1. **Stateless Authentication**: Uses short-lived JSON Web Tokens (JWT) for access validation and long-lived cookies for session preservation.
2. **Secure Token Storage**: 
   - **Access Token (15 mins)**: Kept in-memory by client-side state (protects against XSS).
   - **Refresh Token (7 days)**: Sent in a secure, `httpOnly`, `sameSite=strict` cookie (protects against CSRF).
3. **Bcrypt Password Protection**: Salting and hashing passwords prior to mock database seeding.
4. **Role-Based Access Control (RBAC)**: Custom routing middleware gates endpoints based on target tiers (`Admin`, `Premium_User`, `Free_User`).
5. **Robust Error Pipeline**: Centralized error responses returning structured JSON with compliant HTTP status codes (`401 Unauthorized` / `403 Forbidden`).
---
## 🛠️ Technology Stack
- **Backend**: Node.js, Express.js (v5.x), JsonWebToken, BcryptJS, Cookie-Parser, CORS, Dotenv.
- **Frontend (Optional demo UI)**: React (v18.x), Vite, TailwindCSS, Lucide Icons.
---
## 📋 Available Endpoints & RBAC Gates
|
 Method 
|
 Endpoint 
|
 Required Role 
|
 Description 
|
|
:---
|
:---
|
:---
|
:---
|
|
**
POST
**
|
`/api/auth/login`
|
 Public 
|
 Authenticates credentials; sets refresh cookie & returns access token. 
|
|
**
POST
**
|
`/api/auth/refresh`
|
 Public 
|
 Reads refresh cookie to issue a new short-lived access token. 
|
|
**
POST
**
|
`/api/auth/logout`
|
 Authenticated 
|
 Revokes access and refresh tokens. 
|
|
**
GET
**
|
`/api/ai/free-model`
|
`Free_User`
, 
`Premium_User`
, 
`Admin`
|
 Generates a response using the Lite text generation model. 
|
|
**
POST
**
|
`/api/ai/premium-model`
|
`Premium_User`
, 
`Admin`
|
 Generates high-fidelity image outputs from user prompts. 
|
|
**
DELETE
**
|
`/api/ai/purge-cache`
|
`Admin`
|
 Performs system administrative purge of generation cache. 
|
---
## ⚙️ Quick Start
### 1. Configure Environment Variables
Create a `.env` file in the root directory and specify the configuration options (see `.env.example`):
```env
PORT=5000
JWT_SECRET=specify_a_strong_secret_key_here
JWT_REFRESH_SECRET=specify_a_strong_refresh_secret_key_here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```
### 2. Install Dependencies
Run in the root folder:
```bash
npm install
```
### 3. Run Development Server
```bash
npm run dev
```
The console will boot, database seed scripts will automatically run, and endpoints will listen on `http://localhost:5000`.
---
## 🧪 Testing with Postman
1. Open Postman and click **Import**.
2. Select the `AI-Genius.postman_collection.json` file located in the root of this repository.
3. Use the following seeded accounts for workflow simulation:
   - **Free User**: `free@ai-genius.com` / `free123`
   - **Premium User**: `premium@ai-genius.com` / `premium123`
   - **Admin User**: `admin@ai-genius.com` / `admin123`
