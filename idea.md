# Smart Garage & Predictive Maintenance Platform

---

## 1. Problem Statement

Most small and medium-sized garages still operate in a reactive manner. Vehicles are typically serviced only after a breakdown or when the customer reports an issue. This approach leads to unexpected vehicle failures, inefficient use of mechanics, poor service planning, and weak inventory control.

Additionally, many garages do not maintain structured digital records, making it difficult to track service history or provide timely maintenance reminders.

As a result, both individual vehicle owners and fleet managers experience unnecessary downtime and higher maintenance costs. There is a clear need for a system that can digitize garage operations and support preventive maintenance.

---

## 2. Proposed Solution

The Smart Garage & Predictive Maintenance Platform is a full-stack application designed to streamline garage operations and introduce intelligent, rule-based preventive maintenance.

The system enables:
- structured service job workflows
- efficient mechanic assignment
- inventory tracking with real-time updates
- cost estimation and billing
- automated notifications
- predictive maintenance recommendations

The primary focus of this project is to demonstrate **strong backend engineering**, **clean architecture**, and **realistic domain modeling**.

---

## 3. Objectives

- Design and implement a scalable garage management backend  
- Enforce a controlled service job lifecycle  
- Implement smart mechanic assignment logic  
- Manage inventory with low-stock alerts  
- Generate automated service reminders  
- Build a rule-based recommendation engine  
- Follow software engineering best practices  
- Demonstrate strong use of OOP and SOLID principles  

---

## 4. Target Users

- **Garage Admin** — manages overall operations  
- **Mechanic** — handles assigned service jobs  
- **Customer** — registers vehicles and tracks services  
- **Fleet Manager (Future Scope)** — manages multiple vehicles  

---

## 5. Key Features

### 5.1 Authentication and Role Management

- JWT-based authentication  
- Role-based access control (ADMIN, MECHANIC, CUSTOMER)  
- Secure password hashing (bcrypt)  
- Protected API routes  

---

### 5.2 Garage Management

- Manage garage profile  
- Associate users and mechanics with garage  
- Configure working hours and contact details  
- Designed for future multi-branch expansion  

---

### 5.3 Vehicle Management

- Register vehicles  
- Update vehicle mileage  
- Maintain service history  
- Link vehicles to owners  

---

### 5.4 Service Job Workflow (Core Module)

Each service request follows a strict lifecycle:

CREATED → ASSIGNED → IN_PROGRESS → COMPLETED → DELIVERED


Features include:
- job creation  
- mechanic assignment  
- controlled state transitions  
- cost estimation and billing  
- service timeline tracking  

---

### 5.5 Mechanic Assignment System

Mechanics are modeled as users with role = `MECHANIC`.

Each mechanic includes:
- skills (`skills: string[]`)  
- availability (`isAvailable: boolean`)  

Jobs are assigned based on:
- skill compatibility  
- availability  

This approach avoids unnecessary entity complexity and follows clean OOP design.

---

### 5.6 Inventory Management

Inventory stores all spare parts data per garage.

Each item includes:
- part name  
- part number  
- quantity  
- unit price  
- low stock threshold  

Features:
- real-time stock tracking  
- low stock alerts  
- inventory updates after service  

---

### 5.6.1 Job Part Usage Tracking

Parts used in service jobs are tracked using a **JobPartUsage** entity.

This enables:
- accurate parts consumption tracking  
- cost calculation  
- inventory consistency  

This design models a **many-to-many relationship** between:
- ServiceJob ↔ Inventory  

---

### 5.7 Predictive Maintenance Recommendation Engine

The system includes a rule-based engine that analyzes:

- mileage since last service  
- vehicle age  
- service history  

Based on these inputs, it generates recommendations such as:
- oil change reminders  
- brake inspection alerts  
- periodic maintenance suggestions  

The system is designed to support future ML-based enhancements.

---

### 5.8 Notification System

Notifications include:
- service reminders  
- job status updates  
- low inventory alerts  
- recommendation alerts  

Notifications are:
- stored in the database  
- user-specific  

They are triggered by:
- service job updates  
- inventory events  
- recommendation engine  

Background jobs automatically generate notification alerts.

---

### 5.9 Automated Background Jobs

Scheduled jobs (node-cron) handle:

- daily scan for service-due vehicles  
- automatic recommendation generation  
- periodic inventory checks  

This demonstrates asynchronous backend processing.

---

## 6. System Architecture

The backend follows a layered architecture:

Routes → Controllers → Services → Models → Database


### Key Principles:

- clear separation of concerns  
- reusable business logic in services  
- modular and scalable structure  
- clean API design  

---

## 7. Database Design (High Level)

Primary entities:

- User  
- Garage  
- Vehicle  
- ServiceJob  
- Inventory  
- JobPartUsage  
- Notification  

The database is normalized and relationship-driven to model real-world garage operations accurately.

---

## 8. OOP and SOLID Design Principles

The system follows strong object-oriented design:

### OOP Concepts:
- encapsulation via service layer  
- abstraction through layered architecture  
- modular and reusable components  
- controlled state transitions  

### SOLID Principles:

- **Single Responsibility Principle**  
  Controllers, services, and models have distinct roles  

- **Open/Closed Principle**  
  Services are extendable without modifying core logic  

- **Liskov Substitution Principle**  
  Consistent behavior across components  

- **Interface Segregation Principle**  
  Focused and minimal service responsibilities  

- **Dependency Inversion Principle**  
  Controllers depend on service abstractions  

---

## 9. Tech Stack

### Backend

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- JWT Authentication  
- bcrypt  
- node-cron  
- dotenv  
- Morgan  

### Frontend

- React.js  
- React Router  
- Axios  
- Material UI  
- CSS  

---

## 10. Expected Outcomes

The system will:

- digitize garage operations  
- reduce unexpected vehicle failures  
- improve mechanic utilization  
- maintain complete service history  
- provide structured inventory tracking  
- demonstrate strong backend engineering  

---

## 11. Conclusion

This project goes beyond a basic CRUD system by modeling real-world garage workflows, enforcing controlled service processes, and introducing preventive maintenance intelligence.

It emphasizes:
- backend architecture quality  
- clean code practices  
- scalable design  
- real-world applicability  

The platform is designed to evolve into a more advanced intelligent maintenance system in the future.