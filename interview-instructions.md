# Corner Health Interview Assignment

## Context
This assignment is meant to provide a taste of the kind of work you'll do as part of the Corner Health team. The assignment should take 1–3 hours and has a few components:
- **Coding assignment**: Build a function that checks a patient's insurance eligibility at the time of appointment booking and logs the result.
- **Write-up**: Explain your approach, suggest third-party eligibility APIs we could use in production, and reflect on future product scoping.
- After you've submitted the assignment, we'd like to schedule ~45 min to go over your work and explore some product scenarios together.

## Intro
Corner Health helps nurse practitioners launch and operate their own primary care practices—without needing to hire staff or manage complex back-office operations.

One key friction point for providers today is insurance eligibility checks. This is when a practice needs to see if a patient is "in-network or out of network" with the insurance that our providers accept. Currently, our team manually verifies whether a patient has active insurance coverage before the appointment (often via Availity or similar portals), to ensure clean billing.

We want to automate this process at the point of booking. That way, providers can be confident before the visit even starts that the patient's insurance is active & patients aren't surprised later by unexpected bills.

This exercise focuses on the first step of that automation.

## Coding Assignment (~2–3 hours)

Your task is to build a small web app that:

### 1. Listens for a newly booked appointment:
In production we have a webhook endpoint that receives this webhook payload containing a resource ID, a resource type, and an event name when a new appointment is created. Your app should have an endpoint that listens for for the following JSON payload:

```json
{
    "resource_id": "[any appointment ID]", // see below for test appointment IDs
    "resource_id_type": "Appointment",
    "event_type": "appointment.created"
}
```

### 2. For each new appointment:
- Pull the appointment, the patient, and the patient's insurance information for this appointment via Healthie's API.
- Send a request to an external insurance eligibility API (details below) to check for active coverage.

### 3. When you get the results:
- Send them to the provider in a Chat message (the appointment's provider can be found in appointment.provider)

### Assumptions:
- All patients have one primary insurance plan.
- Some patients have insurance information at the time of booking - some don't (those who don't can automatically return N/A)
- You'll be querying Healthie's API for appointment and patient insurance details.

## Mocked Insurance Eligibility API

Use this mock API to simulate an eligibility check:

```
POST https://mock-eligibility-checker-uvqk.vercel.app/check

Request body: (JSON)
{
  "payer_id": "string",
  "member_id": "string",
  "date_of_birth": "YYYY-MM-DD"
}

Response: (JSON)
{
  "eligible": true | false | "N/A"
}
```

**Eligibility Rules:**
- member_id starting with a letter (e.g., "ABC12345") → eligible: true
- member_id starting with a number (e.g., "12345678") → eligible: false
- Empty string member_id (e.g., "") → eligible: "N/A"
- Other cases (e.g., starting with special characters like '#') use a deterministic hashing algorithm

## Technical Guidance

### Stack
- Our internal stack is Node.js & TypeScript, but feel free to use what you are comfortable with.

### Test Data
You can use the following appointment IDs to simulate the webhook event:
- Invalid insurance: 151774676
- Valid insurance: 151775538
- No insurance: 151776075

### Healthie API Configuration
- **API URL**: https://api.gethealthie.com/graphql
- **API key**: `gh_live_DvzsaNq3BheLpz3rRoeGJGRdbDH1OpF9Jc1rUxuGy8b5rKcuOX1iZKgisWCVclMK`

Note: do not try to use this key in Healthie's GraphQL API explorer; it is not connected to the same service that this API key belongs to. Instead, you can plug the API key into this Netlify app to explore the API.

### Example Axios client setup:
```javascript
const apiClient = axios.create({
    baseURL: 'https://api.gethealthie.com/graphql',
    headers: {
        Authorization: `Basic ${process.env.HEALTHIE_API_KEY}`,
        AuthorizationSource: "API",
        "Content-Type": "application/json",
    },
});
```

### Patient Insurance Query
Patient insurance information is stored in the policies object. Example query:

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    dob
    full_name
    policies {
      id
      priority_type
      num # this is `member_id` for the eligibility check
      insurance_plan {
        payer_id # this is `payer_id` for the eligibility check
        payer_name
      }
    }
  }
}
```

### Relevant Docs:
- Appointments: https://docs.gethealthie.com/guides/scheduling/appointments/
- User info: https://docs.gethealthie.com/reference/2024-06-01/objects/user
- Chat: https://docs.gethealthie.com/guides/chat/