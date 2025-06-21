# Corner Health Interview

A NestJS-based healthcare insurance eligibility verification system that processes appointment webhooks and automatically notifies providers about patient insurance status through personalized messages.

## Overview

This application integrates with Healthie's API to:
- **Process Appointment Webhooks**: Automatically handles appointment creation events
- **Verify Insurance Eligibility**: Checks patient insurance coverage in real-time
- **Send Provider Notifications**: Delivers personalized messages to healthcare providers about insurance status
- **Admin Management**: Provides endpoints to retrieve and manage conversation history

### Key Features
- 🏥 **Healthcare Integration**: Seamless Healthie API integration
- 📧 **Automated Messaging**: Personalized insurance status notifications
- 🔄 **Webhook Processing**: Asynchronous event handling

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Healthie API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd corner_health_interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   HEALTHIE_API_KEY=your_healthie_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

5. **Access the API**
   Navigate to [http://localhost:3000/api](http://localhost:3000/api) to view the Swagger documentation

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload

# Testing
npm test                   # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Generate coverage report

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## API Endpoints

### Webhooks
- `POST /webhook` - Process appointment creation events

### Admin
- `GET /admin/conversation/:id` - Retrieve conversation details

### Eligibility
- `POST /check` - Manual insurance eligibility check (Mocked/Simulated API)

## Architecture

```
src/
├── admin/           # Admin conversation management
├── eligibility/     # Insurance eligibility checking
├── healthie/        # Healthie API integration
├── ingress/         # Webhook event processing
└── insurance/       # Insurance verification workflow
```

## Testing

Run the test suite to verify everything is working:

```bash
# All tests
npm test

# Specific test suites
npm test -- src/admin
npm test -- src/insurance
npm test -- src/eligibility
