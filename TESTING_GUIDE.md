# 🧪 CareNexus Frontend - Comprehensive Testing Guide

## Prerequisites
- Frontend running: http://localhost:4200/ ✅
- Backend running: http://localhost:8081/ ✅
- MySQL running: localhost:3307 ✅
- Clear browser cookies/cache (optional)

---

## Test 1: User Registration 📝

**Goal:** Create a new test account and verify registration flow

**Steps:**
1. Go to http://localhost:4200/
2. Should redirect to `/login`
3. Click "Create an account" link
4. Fill registration form:
   ```
   Full Name: Alice Johnson
   Email: alice.johnson@test.local
   Password: Testing@123
   Role: PATIENT
   ```
5. Click "Create Account"
6. **Expected:** Success → Auto-login → Redirect to `/dashboard`

**Verification:**
- ✅ Page loads without errors
- ✅ Form validation works (try submitting empty form)
- ✅ Password minimum 6 chars enforced
- ✅ Auto-login after registration
- ✅ Redirects to dashboard
- ✅ User name shows in header

---

## Test 2: Dashboard Overview 🏠

**Goal:** Verify dashboard displays user info and quick stats

**Steps:**
1. You should be on `/dashboard`
2. Look for:
   - User greeting with name
   - Stats cards (appointments count, messages count)
   - Quick action buttons (Find Doctors, My Appointments, Messages)
   - Recent appointments list
   - Recent messages section

**Verification:**
- ✅ Header shows "Welcome, Alice Johnson"
- ✅ Stats cards display (may be empty for new user)
- ✅ Three quick action buttons visible
- ✅ No errors in console

---

## Test 3: Header Navigation 🎯

**Goal:** Test header component functionality

**Steps:**
1. Look at top header with purple gradient
2. See "CareNexus" logo
3. Verify navigation links: Dashboard, Doctors, Appointments, Messages
4. Click on user button (right side)
5. See dropdown with: Email, Profile, Settings, Logout

**Verification:**
- ✅ Header is sticky (stays at top when scrolling)
- ✅ All nav links clickable
- ✅ Active link is highlighted
- ✅ User dropdown appears on click
- ✅ Logout button visible in dropdown

---

## Test 4: Doctor Management - Browse 👨‍⚕️

**Goal:** Test doctor listing and search functionality

**Steps:**
1. Click "Find Doctors" or navigate to `/doctors`
2. Should see list of doctor cards with:
   - Doctor name
   - Specialization
   - License number
   - Consultation fee
3. Test search:
   - Type "cardio" in search box
   - Should filter doctors by name
4. Test filter:
   - Select specialization from dropdown
   - Should filter by specialty
5. Test pagination:
   - See page numbers at bottom
   - Click "Next" if available

**Verification:**
- ✅ Doctor list loads without errors
- ✅ Search filters in real-time
- ✅ Specialization filter works
- ✅ Pagination buttons work
- ✅ Each doctor card shows all info

---

## Test 5: Doctor Detail Page 👨‍⚕️ Profile

**Goal:** View full doctor profile

**Steps:**
1. Click "View Profile" on any doctor card
2. Should see:
   - Doctor avatar (icon)
   - Full professional info
   - Specialization
   - License number
   - Consultation fee
   - Professional bio (if available)
   - Action buttons: "Book Appointment", "Send Message"
   - Additional info cards: Availability, Qualifications, Reviews
3. Click back button or "Back to Doctors" link
4. Should return to doctor list

**Verification:**
- ✅ Page loads doctor details from API
- ✅ All fields display correctly
- ✅ Back navigation works
- ✅ Action buttons are visible

---

## Test 6: Appointment Booking 📅

**Goal:** Schedule an appointment with a doctor

**Steps:**
1. From doctor detail page, click "Book Appointment"
2. Should see booking form with:
   - Doctor name displayed at top
   - Date input field
   - Time input field
   - Notes textarea (optional)
   - "Confirm Appointment" button
3. Fill in appointment:
   ```
   Date: Select tomorrow's date
   Time: 14:00 (2:00 PM)
   Notes: Check-up for regular health checkup
   ```
4. Click "Confirm Appointment"
5. **Expected:** Success message → Redirect to `/appointments`

**Verification:**
- ✅ Form displays doctor info at top
- ✅ Date/time inputs work
- ✅ Form validation enforces required fields
- ✅ Submit shows loading state
- ✅ Success message appears
- ✅ Appointment appears in list

---

## Test 7: Manage Appointments 📋

**Goal:** View, cancel, and reschedule appointments

**Steps:**
1. Navigate to `/appointments`
2. Should see appointment list with:
   - Doctor name
   - Appointment date & time
   - Status badge (SCHEDULED, COMPLETED, CANCELLED)
   - Action buttons: Cancel, Reschedule
3. Test pagination if multiple appointments
4. Click "Cancel" on an appointment
5. Confirm cancellation dialog
6. **Expected:** Appointment removed or status changes to CANCELLED

**Verification:**
- ✅ Appointments load from API
- ✅ Status badges color-coded
- ✅ Cancel button works
- ✅ Confirmation dialog appears
- ✅ Appointment updates/removes after cancel
- ✅ Pagination works if multiple appointments

---

## Test 8: Messaging System 💬

**Goal:** Test conversation list and messaging

**Steps:**
1. Navigate to `/messages`
2. Should see conversation list with:
   - Doctor name/avatar
   - Last message preview
   - Timestamp
   - Unread badge (if applicable)
3. Click on a conversation (or recent message from dashboard)
4. Should open chat view with:
   - Conversation header with doctor name
   - Message history (sent/received)
   - Message input box
   - Send button
5. Type message: "Hello, I have a question about my prescription"
6. Press Enter or click Send
7. **Expected:** Message appears in conversation

**Verification:**
- ✅ Conversation list loads
- ✅ Clicking conversation opens chat
- ✅ Message history displays
- ✅ Message input works
- ✅ Send button submits message
- ✅ New message appears in chat
- ✅ Back button returns to list

---

## Test 9: User Profile 👤

**Goal:** Edit personal and medical information

**Steps:**
1. Click user button in header → Select "Profile"
2. OR navigate to `/profile`
3. Should see profile in view mode showing:
   - Full name
   - Age, Gender, Phone
   - Address, Emergency Contact
   - Medical History, Allergies
4. Click "✏️ Edit Profile" button
5. Should enter edit mode:
   - All fields become editable
   - Form controls appear
   - Save & Cancel buttons appear
6. Edit some fields:
   ```
   Age: 28
   Phone: +1-555-123-4567
   Allergies: Penicillin, Tree nuts
   ```
7. Click "💾 Save Changes"
8. **Expected:** Success message → Exit edit mode → Values saved

**Verification:**
- ✅ Profile loads in view mode
- ✅ Edit button toggles edit mode
- ✅ Form fields are editable
- ✅ Form validation works (age 1-150)
- ✅ Save button submits data
- ✅ Success message appears
- ✅ Values persist in view mode

---

## Test 10: Settings Page ⚙️

**Goal:** Test settings and preferences

**Steps:**
1. Click user button → Select "Settings"
2. OR navigate to `/settings`
3. Should see multiple sections:
   - **Notifications:** Email, SMS, Appointments, Messages toggles
   - **Preferences:** Theme, Language, Time Format dropdowns
   - **Privacy:** Profile visibility, Show email/phone toggles
   - **Security:** Change password, 2FA buttons
   - **Data:** Export data button
   - **Sessions:** Logout, Logout all devices buttons
   - **Danger Zone:** Delete account button

4. Test notifications:
   - Toggle "Email Notifications" on/off
   - Toggle "SMS Notifications" on/off
5. Test preferences:
   - Change theme to "Dark"
   - Change language
   - Change time format
6. Click "💾 Save All Settings"
7. **Expected:** Success message

**Verification:**
- ✅ All sections load
- ✅ Toggle switches work
- ✅ Dropdown selects work
- ✅ Save button works
- ✅ Success message appears
- ✅ All buttons clickable (may show alerts)

---

## Test 11: Logout & Re-login 🚪

**Goal:** Verify logout and session management

**Steps:**
1. Click user button in header
2. Click "🚪 Logout"
3. **Expected:** Redirect to `/login`
4. Verify you're logged out:
   - Cannot access `/dashboard` (redirect to login)
   - Try going to http://localhost:4200/dashboard directly
   - Should redirect back to login
5. Login again with credentials:
   ```
   Email: alice.johnson@test.local
   Password: Testing@123
   ```
6. Click "Sign in"
7. **Expected:** Redirect to `/dashboard`

**Verification:**
- ✅ Logout clears token
- ✅ Protected routes redirect to login
- ✅ Login works with saved credentials
- ✅ JWT token generated
- ✅ Dashboard accessible after login

---

## Test 12: Error Handling 🚨

**Goal:** Verify error messages and handling

**Steps:**
1. Try to login with wrong password:
   ```
   Email: alice.johnson@test.local
   Password: WrongPassword
   ```
2. Click "Sign in"
3. **Expected:** Error message appears

4. Try to register with existing email:
   - Go to `/register`
   - Use email: alice.johnson@test.local
   - Submit form
   - **Expected:** Error message

5. Test validation errors:
   - Go to `/schedule-appointment/1`
   - Try to submit form without date/time
   - **Expected:** Field error messages

**Verification:**
- ✅ Wrong credentials show error
- ✅ Duplicate email shows error
- ✅ Form validation shows field errors
- ✅ Error messages are clear
- ✅ Error dismissal works (if applicable)

---

## Test 13: Responsive Design 📱

**Goal:** Verify mobile responsiveness

**Steps:**
1. Open browser DevTools (F12)
2. Click device toolbar (mobile view)
3. Test different screen sizes:
   - iPhone 12 (390px)
   - iPad (768px)
   - Desktop (1920px)

4. On each size, verify:
   - Header is readable
   - Navigation works
   - Buttons are clickable
   - Forms are usable
   - No horizontal scrolling
   - Text is readable (not too small)

**Verification:**
- ✅ Layout adapts to screen size
- ✅ Touch targets are large enough
- ✅ No overflow/horizontal scroll
- ✅ Header responsive
- ✅ Forms stack properly on mobile

---

## Test 14: Loading States & Spinners ⏳

**Goal:** Verify loading indicators work

**Steps:**
1. Go to `/doctors` with slow network (DevTools > Network > Slow 3G)
2. Should see loading spinner while fetching
3. Go to `/appointments`
4. Should see loading spinner while fetching
5. Try booking appointment (should show loading on submit button)

**Verification:**
- ✅ Loading spinner appears during fetch
- ✅ Spinner shows message
- ✅ Submit buttons show loading state
- ✅ Spinner disappears when done

---

## Test 15: Browser Console 🔍

**Goal:** Verify no errors in browser console

**Steps:**
1. Open DevTools Console (F12 → Console tab)
2. Go through each page
3. Check for errors (red X icon)
4. Warnings are OK, but no critical errors

**Pages to check:**
- /login
- /register
- /dashboard
- /doctors
- /doctor/1
- /appointments
- /schedule-appointment/1
- /messages
- /profile
- /settings

**Verification:**
- ✅ No 404 errors for assets
- ✅ No CORS errors
- ✅ No TypeScript/Angular errors
- ✅ No undefined variable errors

---

## Summary Checklist ✅

- [ ] Registration works
- [ ] Auto-login after registration
- [ ] Dashboard loads
- [ ] Header navigation works
- [ ] Doctor browsing works
- [ ] Doctor search works
- [ ] Doctor filter works
- [ ] Doctor detail page loads
- [ ] Appointment booking works
- [ ] Appointment list works
- [ ] Appointment cancel works
- [ ] Messaging works
- [ ] Profile editing works
- [ ] Settings work
- [ ] Logout works
- [ ] Re-login works
- [ ] Error messages display
- [ ] Form validation works
- [ ] Responsive design works
- [ ] Loading states work
- [ ] No console errors

---

## 🐛 Issue Reporting Template

If you find a bug, document it:

```
**Bug Title:** [Short description]

**Steps to Reproduce:**
1. Go to [page]
2. Click [button/link]
3. See [result]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Browser:** [Chrome/Firefox/Safari]
**Screen Size:** [Mobile/Tablet/Desktop]
**Error Message:** [If any]
```

---

## Performance Notes 📊

- **First load:** Should be < 3 seconds
- **Page navigation:** Should be < 500ms
- **API calls:** Should complete < 1 second (on fast connection)
- **Search/filter:** Should be real-time with no lag

---

## Next Steps After Testing

1. **If all tests pass:** App is production-ready ✅
2. **If bugs found:** Fix issues and re-test
3. **If performance issues:** Optimize and re-test
4. **Deploy:** Build production bundle and deploy to server

---

