# Backend Specification Workflow

## Purpose
Create comprehensive backend specifications including API endpoints, database schema, services architecture, authentication, data flow, and deployment configuration. This specification serves as the technical blueprint for backend implementation, providing detailed documentation for data models, API design, business logic, security, and infrastructure requirements.

## Variables
- `{documentation_dir}` - Base directory for project documentation (e.g., `.bmad/docs`)
- `{documentation_language}` - Language for documentation output (e.g., English, Spanish)
- `{project_name}` - Name of the project being specified

## Instructions

### Step 1: Define Data Models
1. Identify entities from PRD and architecture specification
2. For each entity, define:
   - Fields (name, type, constraints)
   - Relationships (one-to-one, one-to-many, many-to-many)
   - Indexes (for query optimization)
   - Validation rules
   - Default values
   - Timestamps (created_at, updated_at)
3. Define database schema:
   - Tables/Collections
   - Foreign keys/References
   - Indexes
   - Constraints (unique, not null, check)

### Step 2: Design API Endpoints
1. Design RESTful API structure (or GraphQL schema if applicable)
2. For each endpoint, specify:
   - HTTP Method (GET, POST, PUT, PATCH, DELETE)
   - Path/Route
   - Path parameters
   - Query parameters
   - Request body schema
   - Response schema (success and error)
   - Status codes
   - Authentication/Authorization requirements
   - Rate limiting
   - Pagination (if applicable)

### Step 3: Define Business Logic Services
1. Identify service layers:
   - User service
   - Authentication service
   - Payment service
   - Notification service
   - Additional domain-specific services
2. For each service, specify:
   - Public methods
   - Input parameters
   - Return values
   - Error handling
   - Dependencies
   - Transaction requirements

### Step 4: Authentication & Authorization
1. **Authentication**:
   - Strategy (JWT, OAuth, Session-based)
   - Token format and expiration
   - Refresh token mechanism
   - Password hashing algorithm
   - Social login providers (if any)
2. **Authorization**:
   - Role-based access control (RBAC)
   - Permission system
   - Resource ownership validation
   - API endpoint permissions matrix

### Step 5: Define Data Validation
1. Input validation rules:
   - Required fields
   - Data types
   - Format validation (email, phone, URL)
   - Length constraints
   - Custom business rules
2. Output sanitization:
   - Remove sensitive data
   - Format transformations
   - Null handling

### Step 6: Error Handling Strategy
1. Error response format:
   - Error code
   - Error message
   - Error details/field errors
   - Request ID (for tracking)
2. Error categories:
   - Validation errors (400)
   - Authentication errors (401)
   - Authorization errors (403)
   - Not found errors (404)
   - Conflict errors (409)
   - Server errors (500)

### Step 7: Define External Integrations
1. For each third-party service:
   - Service name and purpose
   - API endpoints used
   - Authentication method
   - Request/response formats
   - Error handling
   - Retry strategy
   - Rate limits
   - Webhook endpoints (if receiving data)

### Step 8: Specify Background Jobs
1. For each async task:
   - Job name and purpose
   - Trigger (cron schedule, event-driven)
   - Input parameters
   - Processing logic
   - Error handling and retry policy
   - Logging requirements

### Step 9: Define Caching Strategy
1. What to cache:
   - Frequently accessed data
   - Expensive computations
   - External API responses
2. Cache configuration:
   - Cache store (Redis, in-memory, CDN)
   - TTL (time-to-live)
   - Cache keys
   - Invalidation strategy

### Step 10: Logging and Monitoring
1. **Logging**:
   - Log levels (debug, info, warn, error)
   - What to log (requests, errors, business events)
   - Log format (JSON structured logs)
   - Sensitive data exclusion
2. **Monitoring**:
   - Health check endpoints
   - Metrics to track (latency, error rate, throughput)
   - Alerting thresholds

### Step 11: Document Performance Considerations
1. Database optimization:
   - Indexes on foreign keys and frequently queried fields
   - Query optimization strategies
   - N+1 query prevention
2. API optimization:
   - Pagination defaults and limits
   - Rate limiting per endpoint
   - Caching strategies

### Step 12: Document Security Best Practices
1. Implement security measures:
   - SQL injection prevention (parameterized queries)
   - XSS prevention (input sanitization, CSP)
   - CSRF protection
   - Password storage (bcrypt with adequate rounds)
   - Token security (httpOnly, secure cookies)
   - HTTPS enforcement
   - Server-side validation
   - Rate limiting for brute force prevention

### Step 13: Define Testing Strategy
1. Specify testing requirements:
   - Unit tests (services, utilities, validators)
   - Integration tests (API endpoints with test database)
   - E2E tests (critical user flows)
   - Load tests (expected traffic scenarios)
   - Security tests (OWASP top 10)
2. Set coverage targets (minimum 80%)

### Step 14: Define Deployment Configuration
1. Document environment variables
2. Specify database migration strategy
3. Define rollback procedures
4. Document deployment prerequisites

## Workflow

### Prerequisites
Before starting this workflow, ensure:
- Architecture spec exists in `{documentation_dir}/technical/architecture.md`
- PRD exists in `{documentation_dir}/product/PRD.md`
- Tech stack defined in `{documentation_dir}/technical/tech-stack.md`
- Project initialized with workflow-init

### Inputs Required
- Architecture specification (system design, data models)
- PRD (features, business requirements)
- Tech stack (chosen backend technologies)
- UX flows (to understand data requirements)

### Execution Flow
1. **Data Layer** (Steps 1): Define all data models and database schema
2. **API Layer** (Step 2): Design all API endpoints with complete specifications
3. **Business Logic Layer** (Steps 3): Define service architecture
4. **Security Layer** (Steps 4-6): Specify authentication, authorization, validation, and error handling
5. **Integration Layer** (Steps 7-9): Define external integrations, background jobs, and caching
6. **Operations Layer** (Steps 10-14): Document logging, monitoring, performance, security, testing, and deployment

### Output Structure
Generate `{documentation_dir}/technical/backend-spec.md` with the following sections:

1. **Data Models** - Interface definitions for each entity with relationships, indexes, and validation
2. **Database Schema** - Complete table definitions with columns, constraints, and SQL for relationships/indexes
3. **API Endpoints** - Full endpoint documentation organized by resource with request/response schemas
4. **Business Logic Services** - Service class definitions with method signatures and error handling
5. **Authentication & Authorization** - Strategy details, JWT payload, and permissions matrix
6. **Data Validation** - Input validation rules and output sanitization strategies
7. **Error Handling** - Error response format and examples for each error type
8. **External Integrations** - Configuration and error handling for each third-party service
9. **Background Jobs** - Job schedules, processing logic, and retry policies
10. **Caching Strategy** - Cache configuration and invalidation rules
11. **Logging and Monitoring** - Log format, what to log/exclude, health checks, and metrics
12. **Performance Considerations** - Database indexes, query optimization, pagination, rate limiting
13. **Security Best Practices** - Security measures for common vulnerabilities
14. **Testing Strategy** - Test types and coverage targets
15. **Deployment Configuration** - Environment variables, migration strategy, rollback procedures

### Validation Checklist
Before completing, verify:
- [ ] All data models defined with relationships and constraints
- [ ] Database schema includes indexes for performance
- [ ] All API endpoints documented with request/response schemas
- [ ] Authentication and authorization clearly specified
- [ ] Error handling covers all error cases
- [ ] External integrations include retry and error handling
- [ ] Background jobs have retry policies
- [ ] Caching strategy defined for performance
- [ ] Logging excludes sensitive data
- [ ] Security best practices followed

## Report

### Completion Report Format
Upon completing the backend specification, provide a structured report:

1. **Specification Overview**:
   - Total number of data models defined
   - Total number of API endpoints documented
   - Number of service layers specified
   - External integrations count

2. **Key Technical Decisions**:
   - Authentication strategy chosen
   - Database type and schema approach
   - Caching solution selected
   - Background job framework

3. **Security Measures**:
   - Authentication/authorization approach
   - Input validation strategy
   - Sensitive data handling
   - Rate limiting configuration

4. **Performance Optimizations**:
   - Database indexing strategy
   - Caching approach
   - API pagination defaults

5. **Output Location**:
   - File path: `{documentation_dir}/technical/backend-spec.md`
   - File size and line count

6. **Next Steps**:
   - Review specification with team for completeness
   - Use for database migration creation
   - Use for API client/SDK generation
   - Reference during epic/story breakdown
   - Implement following standards in `.bmad/standards/backend/`

### Example Report Template
```
Backend Specification Complete
==============================

Overview:
- Data Models: 8 entities defined
- API Endpoints: 24 endpoints documented
- Services: 6 service layers specified
- External Integrations: 3 services configured

Technical Decisions:
- Authentication: JWT with refresh tokens (15min access, 7-day refresh)
- Database: PostgreSQL with full schema and indexes
- Caching: Redis for user profiles and expensive queries
- Background Jobs: Node-cron for scheduled tasks

Security:
- bcrypt password hashing (10 rounds)
- Role-based access control (RBAC)
- Input validation on all endpoints
- Rate limiting per endpoint

Performance:
- 12 database indexes defined
- Caching strategy for 3 high-traffic endpoints
- Default pagination: 20 items, max 100

Output: {documentation_dir}/technical/backend-spec.md (682 lines)

Next Steps:
1. Team review scheduled
2. Database migration files to be created
3. API client generation ready
4. Epic breakdown can proceed
```
