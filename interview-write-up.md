# Insurance Eligibility System - Interview Write-up

## Understanding Insurance Eligibility

#### Standard Eligibility Request

An insurance eligibility check could require some of the following key data points:

```
Required Fields:
- Payer ID: BCBS123
- Member ID: XYZ789456
- Patient: John Doe, DOB: 01/01/1980
- Provider NPI: 1234567890
- Service Date: Today
- Service Type: Office Visit (or specific CPT codes)
```

#### Verification Process

The eligibility verification involves four critical validation steps:

1. **Active Coverage**: Verify policy status and effective dates
2. **Identity Match**: Confirm patient demographics (name, DOB, SSN)
3. **Benefit Details**: Determine coverage specifics, copays, and deductibles
4. **Provider Network**: Validate provider is in-network for the patient's plan

#### Insurance Database Lookups

The verification process queries multiple insurance databases:

- **Member Database**: Verify member ID exists and policy is active
- **Employer/Group Database**: Confirm group coverage status
- **Benefits Database**: Retrieve specific plan coverage details
- **Claims Database**: Check accumulations (deductible progress, etc.)
- **Provider Database**: Verify network participation status

## Solution Design: Automated Eligibility System at Scale

### Target Scale
- **Volume**: 1-10 million requests/day
- **Peak Load**: 50,000-100,000 requests/hour
- **Target**: National clearinghouse/payer level

### Architecture Design

#### Event-Driven Architecture
Given the complexity and processing time of eligibility checks, an asynchronous, event-driven approach is essential.

#### Core Components

**1. Real-Time Notification System**

The notification system provides transparent, real-time feedback to providers during the eligibility verification process.

**Webhook Architecture**
- **Event-driven notifications** sent to provider systems via webhooks
- **Idempotent delivery** with retry logic and exponential backoff
- **Configurable endpoints** per provider with fallback mechanisms

**Milestone-Driven User Experience**
The verification process is broken into clear stages with specific notifications:

```
1. Request Received (immediate)
   → "Eligibility check initiated for [Patient Name]"

2. Insurance Lookup Started (0-5 seconds)
   → "Verifying coverage with [Payer Name]..."

3. Member Verification (5-15 seconds)
   → "Patient identity confirmed" OR "Additional info needed"

4. Benefits Lookup (15-30 seconds)
   → "Retrieving plan details and coverage information..."

5. Provider Network Check (30-45 seconds)
   → "Verifying network status for NPI [Provider NPI]"

6. Final Results (45-60 seconds)
   → "Eligibility verification complete" + detailed results
```

**Interactive Error Handling**
- **Missing information prompts**: Request specific patient details (SSN, alternate ID)
- **Ambiguous matches**: Present multiple patient options for confirmation
- **Payer downtime**: Offer manual verification options or queue for retry
- **Network issues**: Provide estimated resolution times and alternative workflows

**Real-Time Infrastructure**
- **WebSocket connections** for instant browser updates
- **Firebase Realtime Database** Another option besides webhookls
- **pub/sub** for internal event distribution
- **Message persistence** to handle temporary client disconnections

**Delivery Guarantees**
- **At-least-once delivery** with deduplication handling
- **Circuit breaker pattern** for failing webhook endpoints
- **Dead letter queues** for failed notifications
- **Monitoring dashboards** tracking delivery success rates per provider

**2. Queue Management & Scaling**
- **Horizontal scaling** with Kubernetes and load balancing
- **Rate limiting** to respect insurance API constraints
- **Surge handling** for provider-specific traffic spikes
- **Priority queuing** for urgent vs. routine checks

**3. Caching Strategy**
- **Cache insurance plan benefits** and provider network status
- **Avoid caching** member-specific data (claims, personal info)
- **TTL-based expiration** for plan details
- **Regional caching** for performance optimization

**4. Data Security & Compliance**
- **Row-Level Security (RLS)** policies in databases
- **Provider data isolation** - restrict access to their patients only
- **HIPAA compliance** throughout the data pipeline
- **Audit logging** for all eligibility requests and responses

**5. Role-Based Access Control (RBAC)**

The system implements granular access controls based on user roles and their specific information needs in the healthcare workflow.

**Front Desk Staff**
*Purpose: Patient check-in and basic payment collection*

```
Allowed Access:
✓ Coverage active/inactive status
✓ Copay amount for scheduled visit
✓ Insurance card verification status
✓ Basic benefit confirmation
✓ Outstanding patient balances

Restricted Access:
✗ Detailed medical benefits breakdown
✗ Clinical authorization requirements
✗ Complete benefit maximums
✗ Claims history details
```

**Billing Staff**
*Purpose: Accurate claim submission and revenue cycle management*

```
Allowed Access:
✓ Complete benefit details and limitations
✓ Deductible and out-of-pocket status
✓ Coordination of benefits information
✓ Prior authorization requirements
✓ Claim submission requirements
✓ Coverage exclusions and limitations
✓ Historical claims data

Restricted Access:
✗ Clinical notes or medical records
✗ Provider credentialing details
```

**Healthcare Providers (Doctors/Nurses)**
*Purpose: Clinical decision-making and care coordination*

```
Allowed Access:
✓ Coverage confirmation for recommended treatments
✓ Prior authorization alerts and requirements
✓ Referral requirements and constraints
✓ Covered services relevant to their specialty
✓ Network status and referral options
✓ Formulary information (for prescriptions)

Restricted Access:
✗ Detailed financial/billing information
✗ Patient payment history
✗ Administrative cost breakdowns
```

**Patients**
*Purpose: Understanding their coverage and expected costs*

```
Allowed Access:
✓ Personal coverage status
✓ Expected costs (copay, deductible progress)
✓ Services covered for scheduled visits
✓ Digital insurance card access
✓ Simple benefit summary in plain language
✓ Cost estimates for procedures

Restricted Access:
✗ Backend system verification details
✗ Technical error messages or codes
✗ Provider reimbursement rates
✗ System processing logs
```

**Financial Counselors**
*Purpose: Comprehensive financial guidance and payment assistance*

```
Allowed Access:
✓ Complete billing and benefit information
✓ Payment plan eligibility criteria
✓ Financial assistance program options
✓ Detailed cost estimates and breakdowns
✓ Alternative coverage options
✓ Historical payment patterns
✓ Insurance appeal processes

Restricted Access:
✗ Clinical information beyond coverage scope
✗ Other patients' financial information
```

**Technical Implementation**

```typescript
// Role hierarchy and permissions
const RBAC_PERMISSIONS = {
  FRONT_DESK: ['coverage:read', 'copay:read', 'balance:read'],
  BILLING: ['benefits:read', 'claims:read', 'prior_auth:read'],
  PROVIDER: ['coverage:read', 'clinical_benefits:read', 'referrals:read'],
  PATIENT: ['own_coverage:read', 'costs:read', 'simple_benefits:read'],
  FINANCIAL_COUNSELOR: ['*:read', 'payment_plans:read', 'assistance:read']
};
```

**Data Filtering by Role**

- **Field-level encryption** for sensitive financial data
- **Dynamic response filtering** based on user permissions  
- **Audit trails** for all data access with role context
- **Temporary elevated access** for emergency situations with approval workflows

### Key Design Considerations

- **Fault tolerance**: Graceful handling of insurance API downtime
- **Monitoring**: Real-time alerting for system health and API rate limits
- **Data consistency**: Ensure accurate, up-to-date eligibility information
- **Performance**: Sub-second response times for cached data, reasonable wait times for real-time verification

## Eligibility Provider Comparison

### Provider Evaluation

**1. Availity** ⭐ **Recommended**
- **Scale**: 8.8+ million daily transactions, nationwide payer coverage
- **APIs**: REST, FHIR, X12 support with comprehensive documentation
- **Pricing**: Free tier (5 TPS, 500/day) + usage-based premium tiers
- **Strengths**: Industry standard, proven reliability, sandbox environment
- **Limitations**: Transaction limits, premium pricing requires sales contact
- **Outages** https://payernetworkstatus.availity.com/status/ Looks pretty bad at first glance

**2. pVerify** ⭐ **Runner-up**
- **Coverage**: 1,500+ payers including non-EDI and vision providers (VSP)
- **APIs**: 50+ endpoints supporting REST, SOAP, HL7, FHIR, X12 270/271
- **Support**: Dedicated implementation assistance and drop-in UI widgets
- **Strengths**: Specialized features (Medicare tools, insurance discovery)
- **Limitations**: No transparent pricing, lengthy sales process required

**3. Eligible**
- **Focus**: Developer-centric startup with modern API design
- **Documentation**: Clean, tech-focused approach
- **Limitations**: Limited public information, smaller payer network, unclear pricing

### Recommendation Rationale

**Availity** is recommended for most healthcare organizations due to:
- Proven enterprise scale and reliability
- Transparent free tier for development/testing
- Industry-wide adoption and trust
- Comprehensive API standards support
- Strong developer resources and documentation


**pVerify** excels for organizations requiring specialized coverage (vision, non-EDI payers) or needing extensive implementation support during integration.

## 3. Operational Risks

### Common Failure Points

**Data Quality Issues (30% of problems)**
- **Expired insurance cards**: Patients present outdated coverage information
- **Incorrect member IDs**: Wrong or transposed digits in policy numbers  
- **Plan changes**: Employer switches insurance carriers without patient notification
- **Name mismatches**: "Bob vs Robert" discrepancies blocking verification
- **Demographic errors**: Wrong DOB, SSN, or address preventing matches

**API Reliability Problems**
- **Selective payer outages**: BCBS offline while Medicare functions normally
- **Peak hour timeouts**: Morning rush (8-10am) overwhelming systems
- **Rate limiting**: Most payers restrict to 100-1,000 requests/minute
- **Regional failures**: Geographic API clusters experiencing localized issues

**Timing and Workflow Conflicts**
- **Late appointment changes**: Rescheduling after eligibility verification completed
- **Emergency care scenarios**: Urgent patients requiring immediate treatment
- **Retroactive coverage**: Insurance activated after service delivery
- **Batch processing delays**: Overnight verification jobs failing or running late

### Risk Mitigation Strategies

**Proactive Monitoring**
```
Alert Thresholds:
- Response time > 5 seconds
- Failure rate > 5% for any payer
- Queue depth exceeding normal patterns
```

**Backup and Fallback Systems**
- **90-day eligibility cache**: Retain historical verification data as fallback
- **Overnight batch processing**: Pre-verify next day's appointment schedule
- **Manual override workflows**: Clear escalation paths for urgent situations
- **Last-known coverage display**: Show cached data with prominent timestamp warnings

**Pattern Recognition and Adaptation**
- **Historical failure tracking**: Identify recurring payer outage patterns
- **Predictive scheduling**: Avoid known problem windows (e.g., "United down Tuesdays 2am")
- **Load balancing**: Distribute verification requests across time windows
- **Payer-specific retry logic**: Customize approaches based on individual payer reliability

### Operational Philosophy

**Design for Failure**
Healthcare IT systems fail constantly - treat failure as the default state, not an exception. The primary goal is maintaining patient flow when technology doesn't cooperate.

**Staff Training and Procedures**
- **Manual backup processes**: Everyone knows who to call and what information to collect
- **Manager override authority**: Clear escalation for time-sensitive situations  
- **Patient communication scripts**: Standardized explanations for coverage uncertainties
- **Documentation requirements**: Capture manual verification details for billing compliance

## 4.  Roadmap
I would proably start with a way to handle claims. If insurance claims get denied this could create an extreme stress on provider and their patients so I think thats something I would probably care about handling very early on.

Once we feel prepared to handle cases where things go wrong, then next would be having a way to actual distribute funds whether its copay, insurance payments, etc. A dedicated portal to handling Settlement and Accounting. Managing payments through insurance providers and distributing those funds seems like it would be a major pain point. Potentially building out our custom ledger to provide complete transparency into where funds are going.