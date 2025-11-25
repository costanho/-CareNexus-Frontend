# CareNexus Frontend - System Architecture

## 📚 Table of Contents
1. [What We've Built So Far](#what-weve-built-so-far)
2. [System Architecture Overview](#system-architecture-overview)
3. [Layer-by-Layer Explanation](#layer-by-layer-explanation)
4. [Nexus Direct Functionality (MVP)](#nexus-direct-functionality-mvp)
5. [Other Modules Structure](#other-modules-structure)
6. [Data Flow](#data-flow)
7. [Implementation Phases](#implementation-phases)

---

## What We've Built So Far

### 1. **Folder Structure** ✅
We created a **modular architecture** - everything is organized logically:

```
src/app/
├── core/              # Singleton services (used once per app)
├── shared/            # Reusable components (used by many modules)
├── auth/              # Authentication module
├── nexus-direct/      # MVP: Doctor/Patient/Appointment system
├── nexus-connect/     # Future: External providers
├── nexus-urgent/      # Future: Emergency services
├── nexus-proxy/       # Future: Family care management
├── nexus-learn/       # Future: Health education
└── nexus-companion/   # Future: AI chatbot
```

**Why this structure?**
- **Separation of Concerns**: Each module handles its own domain
- **Scalability**: Easy to add new modules without affecting others
- **Reusability**: Shared components used everywhere
- **Maintainability**: Clear organization = easy to find code

---

### 2. **Core Services Created** ✅

#### A. **api.service.ts** - The HTTP Gateway
```
Purpose: All communication with backend goes through this service

Think of it like a translator between frontend and backend:

Frontend Code
    ↓
api.service.get('/doctors')  ← Asks for doctors
    ↓
HTTP GET http://localhost:8081/api/doctors  ← Actual request
    ↓
Backend Returns: [{ id: 1, name: 'Dr. John', ... }]
    ↓
Frontend receives the data and updates UI
```

**Why needed?**
- Centralized place for all API calls
- Easy to modify base URL (dev, staging, production)
- Consistent error handling
- Easier to test

---

#### B. **storage.service.ts** - The Token & User Manager
```
Purpose: Save/retrieve JWT tokens and user data from browser storage

Like a safe for sensitive data:

After User Logs In:
  ↓
Receives: { accessToken: "xyz...", user: {id: 1, email: "user@test.com"} }
  ↓
storage.setAccessToken("xyz...")  ← Save token
storage.setUser({id: 1, email: "user@test.com"})  ← Save user
  ↓
Later when making API calls:
  ↓
token = storage.getAccessToken()  ← Retrieve token
Add to request header: Authorization: Bearer xyz...
```

**Why needed?**
- JWT tokens must persist across page refreshes
- User must stay logged in until they logout
- Safe place to store sensitive data
- Easy logout (clear all data)

---

#### C. **jwt.interceptor.ts** - The Auto Token Attacher
```
Purpose: Automatically add JWT token to EVERY API request

Think of it as a middleware that intercepts all HTTP requests:

Your Code:
  api.get('/doctors')
    ↓
[JWT Interceptor Intercepts]
  ↓
Checks: Do we have a token? Yes? Add it!
  ↓
Actual Request Sent:
  GET /api/doctors
  Headers: {
    Authorization: Bearer xyz...
  }
    ↓
Backend receives token, validates it, returns data
```

**Why needed?**
- No need to manually add token to every request
- Automatic for all requests (except /auth/ endpoints)
- Centralized token management
- Saves code duplication

---

#### D. **auth.service.ts** - The Authentication Manager (Being Created)
```
Purpose: Handle login, register, logout, token refresh

Flow when user registers:
1. User fills form: { email: "john@test.com", password: "pass123", fullName: "John" }
2. auth.register() sends to backend
3. Backend creates user, returns JWT token
4. auth.service stores token + user data
5. auth.service notifies app: "User logged in!"
6. App redirects to dashboard

When user logs out:
1. User clicks logout button
2. auth.logout() clears all stored data
3. App redirects to login page
```

**Why needed?**
- Central place for all auth logic
- Tracks current user across app
- Other components can ask: "Is user logged in?"
- Handles token refresh automatically

---

## System Architecture Overview

### **Complete Flow Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Angular App)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              ANGULAR COMPONENTS (UI Layer)             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │ │
│  │  │ Login Page   │  │ Doctor List  │  │ Appointments  │ │ │
│  │  └──────────────┘  └──────────────┘  └───────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓ (uses)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SERVICES LAYER (Business Logic)           │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           auth.service                           │ │ │
│  │  │ - login()  - register()  - logout()             │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           doctor.service (future)                │ │ │
│  │  │ - getDoctors()  - searchDoctors()               │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │        appointment.service (future)              │ │ │
│  │  │ - bookAppointment()  - getAppointments()        │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓ (uses)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              CORE SERVICES (Infrastructure)           │ │
│  │  ┌──────────────┐  ┌──────────────┐                  │ │
│  │  │ api.service  │  │storage.service                  │ │
│  │  └──────────────┘  └──────────────┘                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓ (uses)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            INTERCEPTORS & GUARDS (Middleware)         │ │
│  │  ┌──────────────┐  ┌──────────────┐                  │ │
│  │  │jwt.interceptor  auth.guard                        │ │
│  │  └──────────────┘  └──────────────┘                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓ (HTTP)
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                    │
│              http://localhost:8081/api                      │
├─────────────────────────────────────────────────────────────┤
│  /auth/register  →  Creates user, returns JWT              │
│  /auth/login     →  Validates credentials, returns JWT     │
│  /doctors        →  Returns list of doctors                │
│  /appointments   →  Manages appointments                   │
│  /patients       →  Manages patients                       │
│  /messages       →  Manages messages                       │
└─────────────────────────────────────────────────────────────┘
                           ↓ (SQL)
┌─────────────────────────────────────────────────────────────┐
│                    MYSQL DATABASE                           │
│              localhost:3307 (carenexus_direct)              │
├─────────────────────────────────────────────────────────────┤
│  - users table (email, password, role)                     │
│  - doctors table (userEmail, name, specialization)         │
│  - patients table (userEmail, name, contact)               │
│  - appointments table (userEmail, doctorId, patientId)    │
│  - messages table (userEmail, senderId, receiverId)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Explanation

### **Layer 1: Presentation Layer (Components)**
```
What: The UI that users see and interact with
Where: src/app/nexus-direct/pages/*, src/app/auth/pages/*
Examples:
  - LoginComponent (email input, password input, submit button)
  - DoctorListComponent (list of doctors, search box)
  - AppointmentComponent (calendar, booking form)

How it works:
1. User enters data in form
2. User clicks "Login" button
3. Component calls auth.service.login(credentials)
4. Service handles the request
5. Component receives response and updates UI
```

### **Layer 2: Service Layer (Business Logic)**
```
What: Logic for managing data and API calls
Where: src/app/*/services/*
Examples:
  - auth.service (login, register, logout)
  - doctor.service (get doctors, search doctors)
  - appointment.service (book appointment, view appointments)

How it works:
1. Component calls service method: doctor.service.getDoctors()
2. Service calls api.service.get('/doctors')
3. API service makes HTTP request to backend
4. Backend returns data
5. Service processes data (if needed)
6. Component receives data via Observable (RxJS)
7. Component displays data in template
```

### **Layer 3: Core Services (Infrastructure)**
```
What: Low-level services that handle HTTP, storage, etc.
Where: src/app/core/services/*
Examples:
  - api.service (HTTP requests)
  - storage.service (localStorage management)

How it works:
- api.service is the ONLY place that talks to backend
- storage.service is the ONLY place that touches localStorage
- jwt.interceptor automatically adds token to requests
```

### **Layer 4: Interceptors & Guards (Middleware)**
```
What: Intercept requests/navigation to add headers or protect routes
Where: src/app/core/interceptors/*, src/app/core/guards/*

jwt.interceptor:
  Every HTTP request → Interceptor checks for token → Adds to request header → Request sent

auth.guard:
  User tries to visit /dashboard → Guard checks if logged in
  If logged in → Allow access
  If not logged in → Redirect to login

error.interceptor (coming soon):
  HTTP Response arrives → Check for errors → Handle errors globally
```

---

## Nexus Direct Functionality (MVP)

### **What is Nexus Direct?**
In-house doctors management. Patients can:
1. Register/Login
2. View available doctors
3. Book appointments with doctors
4. Send messages to doctors
5. View their appointments

### **User Flows**

#### **Flow 1: Register & Login**
```
┌─────────────────────────────────────┐
│  1. User opens app                  │
│     ↓                                │
│  2. See Login Page                  │
│     ↓                                │
│  3. Click "Register"                │
│     ↓                                │
│  4. Fill form:                       │
│     - Full Name                      │
│     - Email                          │
│     - Password                       │
│     - Role (Patient/Doctor)         │
│     ↓                                │
│  5. Click "Register"                │
│     ↓                                │
│  [auth.service.register() sent]     │
│     ↓                                │
│  6. Backend creates user             │
│     ↓                                │
│  7. Backend returns JWT token       │
│     ↓                                │
│  8. Token saved in localStorage     │
│     ↓                                │
│  9. User logged in automatically    │
│     ↓                                │
│  10. Redirected to Dashboard        │
└─────────────────────────────────────┘
```

#### **Flow 2: Browse Doctors**
```
┌─────────────────────────────────────┐
│  1. User in Dashboard                │
│     ↓                                │
│  2. Click "Find Doctor"             │
│     ↓                                │
│  3. See DoctorListComponent         │
│     ↓                                │
│  [doctor.service.getDoctors()]      │
│     ↓                                │
│  [api.service.get('/doctors')]      │
│     ↓                                │
│  [jwt.interceptor adds token]       │
│     ↓                                │
│  Backend: SELECT * FROM doctors     │
│  WHERE userEmail = current_user     │
│     ↓                                │
│  [Returns: [                         │
│    {id: 1, name: "Dr. John", ...},   │
│    {id: 2, name: "Dr. Jane", ...}    │
│  ]]                                  │
│     ↓                                │
│  4. Display doctors in list          │
│     ↓                                │
│  5. User can search/filter           │
└─────────────────────────────────────┘
```

#### **Flow 3: Book Appointment**
```
┌─────────────────────────────────────┐
│  1. User clicks on doctor            │
│     ↓                                │
│  2. See DoctorDetailComponent       │
│     ↓                                │
│  3. Click "Book Appointment"        │
│     ↓                                │
│  4. Fill appointment form:           │
│     - Select date/time              │
│     - Enter reason                  │
│     ↓                                │
│  5. Click "Confirm"                 │
│     ↓                                │
│  [appointment.service.book()]       │
│     ↓                                │
│  [api.service.post('/appointments')] │
│     ↓                                │
│  Backend creates appointment        │
│     ↓                                │
│  6. Success message                 │
│     ↓                                │
│  7. Appointment added to calendar   │
└─────────────────────────────────────┘
```

#### **Flow 4: Message Doctor**
```
┌─────────────────────────────────────┐
│  1. User in dashboard or doctor page│
│     ↓                                │
│  2. Click "Message"                 │
│     ↓                                │
│  3. See MessageComponent            │
│     ↓                                │
│  4. Type message: "How are you?"    │
│     ↓                                │
│  5. Click "Send"                    │
│     ↓                                │
│  [message.service.send()]           │
│     ↓                                │
│  [api.service.post('/messages')]    │
│     ↓                                │
│  Backend saves message               │
│     ↓                                │
│  6. Message appears in chat         │
└─────────────────────────────────────┘
```

### **Database Operations (Backend)**

All these operations enforce multi-tenancy:

```sql
-- Register user
INSERT INTO users (email, password, fullName, role)
VALUES ('john@test.com', 'hashed_password', 'John Doe', 'PATIENT')

-- Get logged-in user's doctors
SELECT * FROM doctors
WHERE userEmail = 'john@test.com'

-- Book appointment
INSERT INTO appointments
(userEmail, doctorId, patientId, appointmentDateTime, reason, status)
VALUES ('john@test.com', 1, 2, '2025-12-01 10:00:00', 'Checkup', 'SCHEDULED')

-- Send message
INSERT INTO messages
(userEmail, senderId, receiverId, content, sentAt)
VALUES ('john@test.com', 2, 1, 'How are you?', NOW())
```

---

## Other Modules Structure

### **Skeleton for Future Modules**

Each module will follow the SAME pattern as Nexus Direct:

```
nexus-connect/ (External Providers)
├── pages/
│   ├── provider-list/
│   ├── provider-detail/
│   └── filter-providers/
├── services/
│   ├── provider.service.ts
│   └── rating.service.ts
└── models/
    └── provider.model.ts

nexus-urgent/ (Emergency Services)
├── pages/
│   ├── emergency-call/
│   ├── ambulance-tracking/
│   └── emergency-history/
├── services/
│   ├── emergency.service.ts
│   └── gps-tracking.service.ts
└── models/
    └── emergency.model.ts

nexus-proxy/ (Family Care)
├── pages/
│   ├── family-members/
│   ├── manage-care/
│   └── payment-tracker/
├── services/
│   ├── proxy.service.ts
│   └── payment.service.ts
└── models/
    └── proxy-user.model.ts

nexus-learn/ (Education)
├── pages/
│   ├── course-list/
│   ├── course-detail/
│   └── video-player/
├── services/
│   ├── course.service.ts
│   └── progress.service.ts
└── models/
    └── course.model.ts

nexus-companion/ (AI Assistant)
├── pages/
│   ├── chatbot/
│   ├── symptom-checker/
│   └── reminders/
├── services/
│   ├── companion.service.ts
│   └── ai.service.ts
└── models/
    └── conversation.model.ts
```

**Key Point**: Each module is INDEPENDENT
- Nexus Direct works without Nexus Connect
- Nexus Connect works without Nexus Urgent
- They communicate via shared APIs only

---

## Data Flow

### **Example: User Logs In**

```
┌──────────────┐
│  LoginPage   │ (Component)
└──────┬───────┘
       │ user.email, user.password
       ↓
┌──────────────────────┐
│  auth.service.login()│ (Service Layer)
└──────┬───────────────┘
       │ Calls api.service.post('/auth/login', credentials)
       ↓
┌─────────────────────────┐
│ api.service (HTTP)      │ (Core Service)
└──────┬──────────────────┘
       │ Makes HTTP POST request
       ↓
┌─────────────────────────┐
│ jwt.interceptor         │ (Middleware)
│ (No JWT needed for auth)│
└──────┬──────────────────┘
       │ Request sent as-is (no token on login)
       ↓
┌─────────────────────────┐
│ Backend: POST /auth/login
│ - Validates credentials
│ - Creates JWT token
│ - Returns: {accessToken, refreshToken, user}
└──────┬──────────────────┘
       │ Response received
       ↓
┌─────────────────────────────┐
│ auth.service.handleResponse()│
└──────┬──────────────────────┘
       │ Saves token & user
       ↓
┌──────────────────────┐
│ storage.service      │
│ localStorage saved:  │
│ - accessToken: "xyz" │
│ - user: {id: 1, ...} │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ LoginPage receives   │
│ Redirects to         │
│ Dashboard            │
└──────────────────────┘
```

---

## Implementation Phases

### **Phase 1: Core Infrastructure** (This Week)
**Goal**: Foundation ready for all features

- [ ] Setup api.service (✅ Done)
- [ ] Setup storage.service (✅ Done)
- [ ] Setup jwt.interceptor (✅ Done)
- [ ] Create auth.service
- [ ] Create auth.guard
- [ ] Create error.interceptor
- [ ] Create routing module

### **Phase 2: Authentication** (This Week)
**Goal**: Users can register and login

- [ ] Build login page
- [ ] Build register page
- [ ] Test with backend API
- [ ] Add loading states
- [ ] Add error messages

### **Phase 3: Nexus Direct MVP** (Next Week)
**Goal**: Core healthcare features working

- [ ] Create doctor.service
- [ ] Build doctor-list page
- [ ] Build doctor-detail page
- [ ] Create appointment.service
- [ ] Build appointment-booking page
- [ ] Build appointments-list page
- [ ] Create message.service
- [ ] Build messages page

### **Phase 4: Shared Components** (Next Week)
**Goal**: Reusable UI components

- [ ] Build header component
- [ ] Build navigation component
- [ ] Build pagination component
- [ ] Build loading spinner
- [ ] Build error message component

### **Phase 5: Styling & Design** (Week After)
**Goal**: Apply your design mockups

- [ ] Setup SCSS variables (colors, fonts, spacing)
- [ ] Apply design to all components
- [ ] Responsive design (mobile, tablet, web)
- [ ] Ionic-specific styling

### **Phase 6: Testing & Polish** (Week After)
**Goal**: Production-ready app

- [ ] Test all features
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Bug fixes

### **Phase 7: Other Modules** (Ongoing)
- Build skeleton for: Connect, Urgent, Proxy, Learn, Companion
- Implement features as needed

---

## Key Concepts to Remember

### **1. Observables (RxJS)**
```
Instead of:
let doctors = getDoctors();  // Wait for response
console.log(doctors);

We use:
doctor.service.getDoctors().subscribe(doctors => {
  console.log(doctors);  // Runs when data arrives
});

Why? Frontend is ASYNC - requests take time!
```

### **2. Services as Singletons**
```
auth.service is created ONCE when app starts
All components use the SAME instance
So currentUser state is shared across entire app

Component A changes user → Component B sees change immediately
```

### **3. HTTP Interceptors**
```
Intercepts all requests/responses:
- Add JWT token automatically
- Handle errors globally
- Log requests for debugging
```

### **4. Guards (Route Protection)**
```
User tries: /dashboard
Guard checks: Is user logged in?
  Yes? → Allow access
  No? → Redirect to login
```

---

## Next Steps

1. **Understand this architecture** - Read through it, ask questions
2. **I'll create auth.service** - Explain each line
3. **I'll create auth.guard** - Protect routes
4. **I'll build login page** - Explain component structure
5. **You ask questions** - We learn together!

---

*This document will be updated as we build. Print it out or keep it open while developing!*
