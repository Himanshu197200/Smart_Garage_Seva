# Smart Garage Seva

**Smart Garage Seva** is an all-in-one, comprehensive automotive service platform custom-built to organize and digitize the unstructured Indian garage sector. It transitions garages from paper-based job cards to a highly scalable, AI-assisted digital workflow. 

With deep integrations for Role-Based Access Control (Admins, Mechanics, and Customers), Inventory Management, Service Job Lifecycles, and Predictive Maintenance, it streamlines garage operations end-to-end.

---

## Key Features

### Multi-Tier Role-Based Architecture
- **Admin**: Full access to garage operations, mechanic assignments, global inventory management, and oversight.
- **Mechanic**: Access to assigned service jobs, ability to update job status, utilize inventory parts, and clock maintenance progress.
- **Customer**: Access to their personal garage dashboard to track their registered vehicles, view real-time service job progress, and receive AI-driven maintenance recommendations.

### Vehicle & Service Job Management
- **State Machine Integration**: Service jobs follow a strict, robust State Machine pattern (`Check-in` → `Diagnosis` → `In Progress` → `Quality Check` → `Completed`).
- **Real-Time Tracking**: Customers can remotely view the exact stage of their vehicle's repair.
- Mechanics can link specific parts from the inventory to a job, automatically deducting stock.

### Inventory Control
- Track auto parts, oils, and spares centrally.
- Add, update, and monitor stock levels.
- Automated **Low Stock Alerts** trigger when inventory dips below minimum defined thresholds.

### Predictive Maintenance & Notifications
- Based on the Observer and Strategy design patterns.
- Evaluates a vehicle's specific mileage, age, and service history to dynamically recommend future maintenance (e.g., Oil Changes, Brake Inspections).
- Populates the user's **Notifications** center with categorized alerts (Recommendation, Job Update, Inventory Alert).

### Global Theming (Dark Mode Ecosystem)
- Includes a meticulously engineered Light / OLED Dark Mode (`#000000`) system.
- State is preserved globally via `localStorage`.
- Deeply overrides Material UI (MUI) components natively inside the dashboard (Cards, Tables, Drawers, TextFields) alongside custom CSS styling for public landing pages.

---

## Technology Stack

### Frontend (User Interface)
- **Framework**: React 18 
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI) v5
- **Icons**: Lucide React & MUI Icons
- **State/API**: Context API & Axios

### Backend (Server & Database)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Architecture**: Service-Controller pattern with distinct Design Pattern implementations (State, Observer, Singleton, Strategy).

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Himanshu197200/Smart_Garage_Seva.git
cd Smart_Garage_Seva

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
You will need to create `.env` files in both the `backend` and `frontend` directories.

**`backend/.env`**
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smart-garage
JWT_SECRET=your_super_secret_jwt_key_here
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Run the Application
```bash
# Terminal 1: Start Backend Server (from /backend)
npm run dev

# Terminal 2: Start Frontend Application (from /frontend)
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## Production Deployment Guide

The project is structured to deploy the Backend to **Render** and the Frontend to **Vercel**.

### Backend (Render)
1. Inside Render, create a new **Web Service**.
2. Connect the Git repository and set the Root Directory to `backend`.
3. Set the Environment to `Node`.
4. **Build Command**: `npm install --include=dev && npm run build` *(Crucial: ensures TypeScript types compile successfully in production).*
5. **Start Command**: `npm start`
6. Enter all Environment Variables (including the production `MONGO_URI` and a secure `JWT_SECRET`).
7. Ensure your MongoDB Atlas Network Access is set to allow IPs from `0.0.0.0/0` (or Render's specific static outbound IPs if applicable).

### Frontend (Vercel)
1. Inside Vercel, import the GitHub repository.
2. Set the Root Directory to `frontend`.
3. The Vite framework will be automatically detected.
4. **Environment Variables**: Add `VITE_API_URL` pointing to your deployed Render URL (e.g., `https://smart-garage-seva.onrender.com/api`).
5. Vercel utilizes the provided `vercel.json` file automatically to ensure React Router SPA rewrites format correctly (routing everything to index.html to prevent 404s).
6. Deploy!

---

## Repository Architecture

```text
Smart_Garage_Seva/
├── backend/                  # Node.js / Express API
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Mongoose Schemas
│   │   ├── routes/           # Express Routers
│   │   ├── services/         # Core business logic
│   │   ├── patterns/         # Gang of Four Design Patterns (Observer, State, Strategy)
│   │   └── index.ts          # Server entry point
│   ├── tests/                # Jest testing suites
│   └── package.json
│
├── frontend/                 # React / Vite SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components & layouts
│   │   ├── contexts/         # React Context (Auth)
│   │   ├── pages/            # Application views (Public Landing, Internal Auth/Dashboard)
│   │   ├── services/         # Axios API clients mapped to backend routes
│   │   ├── styles/           # CSS files (including global Dark Mode overrides)
│   │   └── main.tsx          # React DOM mounting & routing wrapper
│   ├── vercel.json           # SPA Routing rules for deployment
│   └── package.json
└── README.md
```

## License
This project is proprietary software built to revolutionize the Indian automotive garage space.