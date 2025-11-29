# 🔌 CareNexus Microservice Connection Guide

## ✅ Frontend Updated - API Service Multi-Service Support

Your frontend API service has been updated to **automatically route requests to the correct microservice**:

### Smart Routing Logic
```typescript
// In api.service.ts
private getBaseUrl(endpoint: string): string {
  if (endpoint.startsWith('/auth')) {
    return 'http://localhost:8082/api';  // Auth Service
  }
  return 'http://localhost:8081/api';    // Direct Service
}
```

### Request Flow Example
```
Frontend Request: authService.login({email, password})
         ↓
API Call: post('/auth/login', data)
         ↓
Routing Logic: Detects '/auth' prefix
         ↓
Target: http://localhost:8082/api/auth/login ✅
         ↓
Auth Service responds with JWT token
         ↓
Frontend stores token & updates UI
```

---

## 🚀 Starting the Microservices

### Step 1: Navigate to Backend Directory
```bash
cd /Users/cosy/Documents/CareNexus/direct
```

### Step 2: Start Docker Services
```bash
# Start all services (Auth, Direct, MySQL, Kafka, Zookeeper)
docker-compose up -d

# Watch the startup logs (optional)
docker-compose logs -f
```

### Step 3: Verify Services Are Running
```bash
# Check all containers
docker-compose ps

# Expected output:
# CONTAINER                STATUS              PORTS
# carenexus-zookeeper      Up (healthy)        29181->2181/tcp
# carenexus-kafka          Up (healthy)        9092->9092/tcp
# carenexus-mysql          Up (healthy)        3307->3306/tcp
# carenexus-auth-service   Up (healthy)        8082->8082/tcp
# carenexus-direct-service Up (healthy)        8081->8081/tcp
# carenexus-adminer        Up                  8083->8080/tcp
```

---

## 🧪 Testing Connection

### Test Auth Service (Port 8082)
```bash
# Test login endpoint
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "password123"
  }'

# Expected Response:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": 1,
#     "email": "doctor@test.com",
#     "fullName": "Dr. Smith",
#     "role": "DOCTOR"
#   }
# }
```

### Test Direct Service (Port 8081)
```bash
# Get doctors list (requires JWT token)
TOKEN="<paste_accessToken_from_auth_response>"

curl -X GET http://localhost:8081/api/doctors \
  -H "Authorization: Bearer $TOKEN"

# Expected Response:
# [
#   {
#     "id": 1,
#     "name": "Dr. John Smith",
#     "specialization": "Cardiology",
#     "email": "john@hospital.com"
#   }
# ]
```

### Check Database (Adminer UI)
```
URL: http://localhost:8083
Server: mysql-db
Username: appuser
Password: apppassword
Database: carenexus_auth (or carenexus_direct)
```

---

## 🔌 Frontend & Backend Connection Flow

```
┌─────────────────────────────────────────┐
│       Frontend (localhost:4200)          │
│    Angular + Ionic 8 + MobileService   │
└─────────────┬───────────────────────────┘
              │
              ├─ authService.login()
              │
              └─→ apiService.post('/auth/login', data)
                        ↓
                  getBaseUrl('/auth/login')
                        ↓
           ┌───────────────────────┐
           │ Endpoint starts with  │
           │    '/auth' ?          │
           │      YES! ✅          │
           └───────────┬───────────┘
                       │
         ┌─────────────v──────────────┐
         │  http://localhost:8082/api │
         │    (Auth Service - Java)   │
         │  ├─ /auth/login            │
         │  ├─ /auth/register         │
         │  ├─ /auth/refresh          │
         │  └─ JWT Token Generation   │
         └──────────────┬──────────────┘
                        │
         ┌──────────────v──────────────┐
         │   MySQL Database (3307)     │
         │   ├─ carenexus_auth table   │
         │   └─ Stores users & tokens  │
         └────────────────────────────┘

┌─────────────────────────────────────────┐
│  Other Requests (doctors, patients)     │
│  apiService.get('/doctors')             │
└─────────────┬───────────────────────────┘
              │
              └─→ getBaseUrl('/doctors')
                        ↓
           ┌───────────────────────┐
           │ Endpoint starts with  │
           │    '/auth' ?          │
           │      NO, use default  │
           └───────────┬───────────┘
                       │
         ┌─────────────v──────────────┐
         │  http://localhost:8081/api │
         │   (Direct Service - Java)  │
         │  ├─ /doctors              │
         │  ├─ /patients             │
         │  ├─ /appointments         │
         │  └─ /messages             │
         └──────────────┬──────────────┘
                        │
         ┌──────────────v──────────────┐
         │   MySQL Database (3307)     │
         │  ├─ carenexus_direct table  │
         │  └─ Stores business logic   │
         └────────────────────────────┘
```

---

## 📋 API Endpoint Reference

### Auth Service (Port 8082)
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| POST | `/api/auth/register` | Register new user | ❌ No |
| POST | `/api/auth/login` | Login & get JWT | ❌ No |
| POST | `/api/auth/refresh` | Refresh expired token | ❌ No |

### Direct Service (Port 8081)
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| GET | `/api/doctors` | List all doctors | ✅ Yes |
| POST | `/api/doctors` | Create doctor | ✅ Yes |
| GET | `/api/patients` | List all patients | ✅ Yes |
| POST | `/api/patients` | Create patient | ✅ Yes |
| GET | `/api/appointments` | List appointments | ✅ Yes |
| POST | `/api/appointments` | Create appointment | ✅ Yes |
| GET | `/api/messages` | Get messages | ✅ Yes |
| POST | `/api/messages` | Send message | ✅ Yes |

---

## 🛠 Troubleshooting

### Services Won't Start
```bash
# Check Docker status
docker ps -a

# View logs
docker-compose logs auth-service
docker-compose logs direct-service
docker-compose logs mysql-db

# Restart services
docker-compose restart

# Clean rebuild
docker-compose down -v  # Remove volumes
docker-compose up -d
```

### Can't Connect to Auth Service
```bash
# Check if port 8082 is accessible
curl http://localhost:8082/actuator/health

# Should return: {"status":"UP"}
```

### Can't Connect to Direct Service
```bash
# Check if port 8081 is accessible
curl http://localhost:8081/actuator/health

# Should return: {"status":"UP"}
```

### JWT Token Issues
```bash
# In browser console, check token storage
localStorage.getItem('accessToken')

# Should show: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### CORS Issues
**Solution**: Direct Service should have CORS enabled for localhost:4200

If you see CORS errors:
1. Check backend's CORS configuration
2. Verify `http://localhost:4200` is in allowed origins
3. Restart backend services

---

## 📱 Frontend Development

### Run Frontend Dev Server
```bash
cd /Users/cosy/Documents/CareNexus-Frontend/frontend
npm start

# Navigate to http://localhost:4200
```

### Watch API Requests
```bash
# In browser DevTools → Network tab
# Filter by XHR requests
# You should see:
# POST /api/auth/login → 200 ✅
# GET /api/doctors → 200 ✅
```

---

## ✨ Full System Status

### Services Checklist
- [ ] Docker Desktop running
- [ ] Services started: `docker-compose ps` shows all UP
- [ ] Auth Service responding: `curl http://localhost:8082/actuator/health`
- [ ] Direct Service responding: `curl http://localhost:8081/actuator/health`
- [ ] MySQL accessible on port 3307
- [ ] Kafka event bus running on 9092
- [ ] Frontend running: `http://localhost:4200`

### Frontend Integration Checklist
- [x] API Service configured with multi-service routing
- [x] Auth Service calls routed to port 8082
- [x] Direct Service calls routed to port 8081
- [x] JWT token storage working
- [x] Mobile optimizations in place
- [ ] Test login functionality
- [ ] Test data retrieval after login
- [ ] Test all CRUD operations

---

## 🎯 Next Steps

1. **Start the microservices**
   ```bash
   cd /Users/cosy/Documents/CareNexus/direct
   docker-compose up -d
   ```

2. **Start the frontend**
   ```bash
   cd /Users/cosy/Documents/CareNexus-Frontend/frontend
   npm start
   ```

3. **Test the connection**
   - Open http://localhost:4200
   - Try registering a new user
   - Login with credentials
   - Check browser console for API calls

4. **Verify token flow**
   - After login, check localStorage for `accessToken`
   - Navigate to dashboard
   - Verify API calls include Authorization header

---

**Last Updated**: November 29, 2025
**Status**: ✅ Frontend configured, ready for microservice connection
