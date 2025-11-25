# Understanding auth.service.ts - Complete Learning Guide

## What is auth.service?

**In simple terms:** A service that handles everything related to user authentication (login, register, logout, tracking who's logged in).

**Think of it like:** A receptionist at a hospital:
- When someone comes in (user registers), receptionist creates their record
- When someone logs in, receptionist checks credentials and gives them a badge (JWT token)
- That badge must be shown for every request (to get treatment)
- When someone leaves (logs out), receptionist invalidates their badge

---

## Why Do We Need It?

### **Without auth.service:**
```
Component A calls API to login
  ↓
Component B needs to know if user logged in
  ↓
Component C also needs to know
  ↓
PROBLEM: No central place tracking user status!
         Each component has its own copy of user data
         If user logs in Component A, Component B doesn't know!
```

### **With auth.service:**
```
Component A calls auth.service.login()
  ↓
auth.service saves user + token
  ↓
auth.service announces: "User logged in!"
  ↓
Component B listens: "Oh! User logged in"
Component C listens: "Oh! User logged in"
  ↓
All components automatically updated!
```

---

## Key Concepts Before We Build

### **1. RxJS Observable (The most important!)**

**What is it?** A stream of data that arrives over time.

**Why?** API calls take time. We can't just `let user = getUser()` because the data hasn't arrived yet!

```typescript
// ❌ WRONG - Data hasn't arrived yet!
let user = api.get('/user');
console.log(user);  // undefined!

// ✅ CORRECT - Wait for data to arrive
api.get('/user').subscribe(user => {
  console.log(user);  // Now we have data!
});
```

**Visual explanation:**
```
Subscribe to a stream:
────────────────────────────────────────► time

              (waiting...)
                    ↓
            (data arrives)
                    ↓
            (execute code)
```

**Example:**
```typescript
// Think of it like ordering food:
api.getDoctors().subscribe(doctors => {
  // Code here runs when doctors data arrives
  console.log(doctors);  // [{ id: 1, name: 'Dr. John' }, ...]
});
// This line runs immediately (before data arrives!)
console.log('Request sent!');
```

**Output:**
```
Request sent!
[{ id: 1, name: 'Dr. John' }, ...]
```

---

### **2. BehaviorSubject (Tracking State)**

**What is it?** A special Observable that:
1. Always has a current value
2. Broadcasts that value to all subscribers
3. When value changes, all subscribers are notified

**Why?** To track "who is logged in" across the entire app.

```typescript
// Create a BehaviorSubject to track current user
private currentUserSubject = new BehaviorSubject<any>(null);
public currentUser$ = this.currentUserSubject.asObservable();
// null means no one logged in yet

// Later, when user logs in:
this.currentUserSubject.next({ id: 1, email: 'john@test.com' });
// All subscribers get notified!

// In components, subscribe to see current user:
this.auth.currentUser$.subscribe(user => {
  console.log('Current user:', user);
  // Runs immediately with current user
  // Also runs whenever user changes!
});
```

**Visual flow:**
```
BehaviorSubject: { id: 1, email: 'john@test.com' }
       ↓
       ├→ Component A gets notified
       ├→ Component B gets notified
       ├→ Component C gets notified
       └→ Component D gets notified

Later, user logs out:
BehaviorSubject: null
       ↓
       ├→ Component A gets notified
       ├→ Component B gets notified
       ├→ Component C gets notified
       └→ Component D gets notified
```

---

### **3. tap() Operator (Side Effects)**

**What is it?** A way to do something with data WITHOUT changing the data.

```typescript
// Without tap:
this.api.post('/login', credentials)
  .subscribe(response => {
    // Save data
    this.storage.setAccessToken(response.accessToken);
    // Return data to component
    return response;
  });

// With tap (cleaner):
this.api.post('/login', credentials)
  .pipe(
    tap(response => {
      // Save data (side effect)
      this.storage.setAccessToken(response.accessToken);
      // Data passes through unchanged
    })
  )
  .subscribe(response => {
    // Component receives data unchanged
  });
```

---

## What Will auth.service.ts Contain?

### **Private Variables (Internal State)**

```typescript
// Track current user
private currentUserSubject = new BehaviorSubject<any>(null);

// Track if user is authenticated
private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
```

**Why private?** Components shouldn't directly change these. They should go through methods.

### **Public Observables (What components can listen to)**

```typescript
// Components can listen to current user changes
public currentUser$ = this.currentUserSubject.asObservable();

// Components can listen to authentication status changes
public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
```

**Why `$` at the end?** Convention to indicate "this is an Observable" (not required, just helpful).

### **Methods (What components can call)**

```typescript
// Register new user
register(data: RegisterRequest): Observable<AuthResponse> {
  return this.apiService.post('/auth/register', data)
    .pipe(
      tap(response => this.handleAuthResponse(response))
    );
}

// Login existing user
login(data: LoginRequest): Observable<AuthResponse> {
  return this.apiService.post('/auth/login', data)
    .pipe(
      tap(response => this.handleAuthResponse(response))
    );
}

// Logout user
logout(): void {
  this.storageService.clear();
  this.currentUserSubject.next(null);
  this.isAuthenticatedSubject.next(false);
}

// Check if currently logged in
isAuthenticated(): boolean {
  return this.isAuthenticatedSubject.value;
}

// Get current user
getCurrentUser(): any {
  return this.currentUserSubject.value;
}

// Refresh token when expired
refreshToken(): Observable<AuthResponse> {
  const refreshToken = this.storageService.getRefreshToken();
  return this.apiService.post('/auth/refresh', { refreshToken })
    .pipe(
      tap(response => this.handleAuthResponse(response))
    );
}
```

---

## Complete Flow: User Registers

Let's trace through what happens when user registers:

### **Step 1: User fills registration form**
```
Component (RegisterComponent):
├─ User enters: email, password, fullName, role
├─ Clicks "Register" button
└─ Calls: this.auth.service.register({email, password, fullName, role})
```

### **Step 2: auth.service.register() is called**
```
auth.service:
├─ Calls: this.apiService.post('/auth/register', data)
│  └─ This returns Observable (doesn't execute yet!)
├─ Pipes through tap() to handle response
│  └─ When response arrives, calls handleAuthResponse()
└─ Returns Observable to component
```

### **Step 3: Component subscribes to Observable**
```
Component:
├─ Receives Observable from register()
├─ Calls .subscribe(response => {})
│  └─ Now the chain executes!
└─ Waits for data...
```

### **Step 4: HTTP request is sent**
```
Network:
├─ POST http://localhost:8081/api/auth/register
├─ Body: {email, password, fullName, role}
└─ Waiting for backend...
```

### **Step 5: Backend validates and creates user**
```
Spring Boot Backend:
├─ Receives registration request
├─ Validates data
├─ Creates user in database
├─ Generates JWT token
├─ Returns: {accessToken, refreshToken, user}
└─ Response sent back
```

### **Step 6: Response arrives at frontend**
```
api.service (HTTP layer):
├─ Receives response
├─ Passes to tap() operator
└─ Passes to subscribe()
```

### **Step 7: tap() executes handleAuthResponse()**
```
handleAuthResponse(response):
├─ Save tokens: storage.setAccessToken(response.accessToken)
├─ Save user: storage.setUser(response.user)
├─ Update currentUserSubject: next(response.user)
│  └─ All subscribers get notified!
├─ Update isAuthenticatedSubject: next(true)
│  └─ All subscribers get notified!
└─ Return response unchanged
```

### **Step 8: Component receives response**
```
Component.subscribe():
├─ Response available
├─ Shows success message
├─ Redirects to dashboard
└─ Done!
```

### **Step 9: All components notified**
```
Component A listens to currentUser$:
├─ Gets notified: "User logged in!"
├─ Updates header: Shows "Hi John"
└─ Done!

Component B listens to isAuthenticated$:
├─ Gets notified: "User authenticated!"
├─ Shows dashboard content
└─ Done!

Component C listens to currentUser$:
├─ Gets notified: "User logged in!"
├─ Enables menu items
└─ Done!
```

---

## Visual Code Structure

```typescript
@Injectable({
  providedIn: 'root'  // ← Creates one instance for entire app
})
export class AuthService {

  // ═══════════════════════════════════════════════════
  // PART 1: STATE (Track current user and auth status)
  // ═══════════════════════════════════════════════════

  private currentUserSubject = new BehaviorSubject<any>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // ═══════════════════════════════════════════════════
  // PART 2: OBSERVABLES (What components listen to)
  // ═══════════════════════════════════════════════════

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // ═══════════════════════════════════════════════════
  // PART 3: CONSTRUCTOR (Initialize services)
  // ═══════════════════════════════════════════════════

  constructor(
    private apiService: ApiService,           // ← For HTTP calls
    private storageService: StorageService    // ← For token/user storage
  ) {
    this.initializeAuth();  // ← Check if user already logged in
  }

  // ═══════════════════════════════════════════════════
  // PART 4: INITIALIZATION (Restore user if already logged in)
  // ═══════════════════════════════════════════════════

  private initializeAuth(): void {
    // When app starts, check if user is already logged in
    const user = this.storageService.getUser();
    const isLoggedIn = this.storageService.isLoggedIn();

    if (isLoggedIn && user) {
      // User was previously logged in, restore session
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  // ═══════════════════════════════════════════════════
  // PART 5: PUBLIC METHODS (What components call)
  // ═══════════════════════════════════════════════════

  register(data: RegisterRequest): Observable<AuthResponse> {
    // Return Observable so component can subscribe
    return this.apiService.post('/auth/register', data)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post('/auth/login', data)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.apiService.post('/auth/refresh', { refreshToken })
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  // ═══════════════════════════════════════════════════
  // PART 6: PRIVATE HELPER (Handle auth response)
  // ═══════════════════════════════════════════════════

  private handleAuthResponse(response: AuthResponse): void {
    // Save tokens and user
    this.storageService.setAccessToken(response.accessToken);
    this.storageService.setRefreshToken(response.refreshToken);
    this.storageService.setUser(response.user);

    // Notify all subscribers
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }
}
```

---

## How Components Use This Service

### **Example 1: Login Component**
```typescript
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login(email: string, password: string) {
    // Call auth service
    this.authService.login({ email, password })
      .subscribe(
        (response) => {
          // Success - user logged in
          console.log('Login successful!');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          // Error - show message
          console.log('Login failed:', error);
        }
      );
  }
}
```

### **Example 2: Header Component (Listening to user changes)**
```typescript
export class HeaderComponent {
  currentUser$ = this.authService.currentUser$;  // ← Observable

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
```

**In template:**
```html
<div *ngIf="currentUser$ | async as user">
  <!-- Shows when user is logged in -->
  Welcome, {{ user.fullName }}!
  <button (click)="logout()">Logout</button>
</div>

<div *ngIf="!(currentUser$ | async)">
  <!-- Shows when user is NOT logged in -->
  Please login first
</div>
```

### **Example 3: Guard (Protecting routes)**
```typescript
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): boolean {
    // Only allow access if user is logged in
    if (this.authService.isAuthenticated()) {
      return true;  // Allow
    } else {
      return false;  // Deny - redirect to login (done by router)
    }
  }
}
```

---

## Key Points to Remember

1. **BehaviorSubject** = Central place to track state
2. **Observable** = Stream of data that arrives over time
3. **tap()** = Do something with data without changing it
4. **subscribe()** = "Listen for data and execute code when it arrives"
5. **Dependency Injection** (constructor) = Services available everywhere
6. **@Injectable** with `providedIn: 'root'` = Single instance for entire app

---

## Questions to Ask Before We Build

Before I write the code, ask yourself:

1. **Do you understand BehaviorSubject?** (Most important!)
2. **Do you understand why we need tap()?**
3. **Do you understand the flow: register → API call → response → update state → notify components?**
4. **Do you understand why components subscribe to currentUser$?**

**If yes to all → We can build!**
**If no to any → Ask questions below!**

---

## Ready?

Do you understand this? Any questions before I create the actual code?
