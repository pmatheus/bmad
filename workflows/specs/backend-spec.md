# Backend Specification Workflow

## Purpose
Create comprehensive backend specifications including API endpoints, database schema, services architecture, authentication, and data flow.

## Prerequisites
- Architecture spec exists in `{documentation_dir}/technical/architecture.md`
- PRD exists in `{documentation_dir}/product/PRD.md`
- Tech stack defined in `{documentation_dir}/technical/tech-stack.md`
- Project initialized with workflow-init

## Inputs
- Architecture specification (system design, data models)
- PRD (features, business requirements)
- Tech stack (chosen backend technologies)
- UX flows (to understand data requirements)

## Process

### Step 1: Define Data Models
1. Identify entities from PRD and architecture
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
1. RESTful API design (or GraphQL schema)
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
   - etc.

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

## Output Structure

Generate `{documentation_dir}/technical/backend-spec.md` with the following structure:

```markdown
# Backend Specification - [Project Name]

## 1. Data Models

### User Model
```typescript
interface User {
  id: string;                    // UUID, primary key
  email: string;                 // Unique, indexed
  password_hash: string;         // bcrypt hash
  name: string;
  role: 'user' | 'admin';       // Enum
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;            // Soft delete
}
```

**Relationships**:
- Has many: Posts, Comments
- Belongs to: Organization (optional)

**Indexes**:
- Primary: id
- Unique: email
- Index: role, created_at

**Validation**:
- email: Valid email format, max 255 chars
- name: Min 2 chars, max 100 chars
- password: Min 8 chars, at least one uppercase, one number

### [Other Models]
[Repeat for each entity]

## 2. Database Schema

### Tables

#### users
| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| id | UUID | PRIMARY KEY | gen_random_uuid() | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | | |
| password_hash | VARCHAR(255) | NOT NULL | | |
| name | VARCHAR(100) | NOT NULL | | |
| role | ENUM | NOT NULL | 'user' | |
| created_at | TIMESTAMP | NOT NULL | NOW() | |
| updated_at | TIMESTAMP | NOT NULL | NOW() | |
| deleted_at | TIMESTAMP | NULL | | Soft delete |

**Indexes**:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

#### [Other Tables]
[Repeat for each table]

### Relationships
```sql
-- Posts belong to User
ALTER TABLE posts ADD CONSTRAINT fk_posts_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Comments belong to User and Post
ALTER TABLE comments ADD CONSTRAINT fk_comments_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT fk_comments_post
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
```

## 3. API Endpoints

### Authentication

#### POST /api/auth/register
**Description**: Register a new user

**Request Body**:
```typescript
{
  email: string;     // Valid email
  password: string;  // Min 8 chars
  name: string;      // Min 2 chars
}
```

**Success Response (201)**:
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  },
  token: string;      // JWT token
  expires_at: string; // ISO 8601
}
```

**Error Responses**:
- 400: Validation error (email invalid, password weak, etc.)
- 409: Email already exists

**Rate Limit**: 5 requests per minute per IP

---

#### POST /api/auth/login
**Description**: Login existing user

**Request Body**:
```typescript
{
  email: string;
  password: string;
}
```

**Success Response (200)**:
```typescript
{
  user: { ...},
  token: string;
  expires_at: string;
}
```

**Error Responses**:
- 400: Validation error
- 401: Invalid credentials

**Rate Limit**: 10 requests per minute per IP

---

### Users

#### GET /api/users/:id
**Description**: Get user by ID

**Authentication**: Required (JWT)
**Authorization**: Any authenticated user can view public profile, only user/admin can view full profile

**Path Parameters**:
- `id`: string (UUID)

**Success Response (200)**:
```typescript
{
  user: {
    id: string;
    email: string;      // Only if requesting own profile or admin
    name: string;
    role: string;
    created_at: string;
  }
}
```

**Error Responses**:
- 401: Unauthorized (no token)
- 403: Forbidden (trying to access restricted fields)
- 404: User not found

---

[Continue for all API endpoints...]

## 4. Business Logic Services

### UserService

```typescript
class UserService {
  /**
   * Create a new user
   * @throws ValidationError if data invalid
   * @throws ConflictError if email exists
   */
  async createUser(data: CreateUserDTO): Promise<User>;

  /**
   * Get user by ID
   * @throws NotFoundError if user doesn't exist
   */
  async getUserById(id: string): Promise<User>;

  /**
   * Update user
   * @throws NotFoundError if user doesn't exist
   * @throws ValidationError if data invalid
   */
  async updateUser(id: string, data: UpdateUserDTO): Promise<User>;

  /**
   * Soft delete user
   * @throws NotFoundError if user doesn't exist
   */
  async deleteUser(id: string): Promise<void>;
}
```

### AuthService

```typescript
class AuthService {
  /**
   * Register new user and return JWT token
   * @throws ValidationError if data invalid
   * @throws ConflictError if email exists
   */
  async register(data: RegisterDTO): Promise<AuthResponse>;

  /**
   * Login user and return JWT token
   * @throws UnauthorizedError if credentials invalid
   */
  async login(email: string, password: string): Promise<AuthResponse>;

  /**
   * Verify JWT token and return user
   * @throws UnauthorizedError if token invalid/expired
   */
  async verifyToken(token: string): Promise<User>;

  /**
   * Refresh access token
   * @throws UnauthorizedError if refresh token invalid
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse>;
}
```

[Continue for all services...]

## 5. Authentication & Authorization

### Authentication Strategy
- **Type**: JWT (JSON Web Tokens)
- **Algorithm**: HS256
- **Access Token Expiry**: 15 minutes
- **Refresh Token Expiry**: 7 days
- **Token Storage**: httpOnly cookies (web), secure storage (mobile)
- **Password Hashing**: bcrypt, 10 rounds

### JWT Payload
```typescript
{
  sub: string;        // User ID
  email: string;
  role: string;
  iat: number;        // Issued at
  exp: number;        // Expiration
}
```

### Authorization Matrix

| Endpoint | Anonymous | User | Admin |
|----------|-----------|------|-------|
| POST /auth/register | ✓ | ✓ | ✓ |
| POST /auth/login | ✓ | ✓ | ✓ |
| GET /users/:id | ✗ | ✓ (own) | ✓ (all) |
| PUT /users/:id | ✗ | ✓ (own) | ✓ (all) |
| DELETE /users/:id | ✗ | ✓ (own) | ✓ (all) |
| GET /admin/* | ✗ | ✗ | ✓ |

## 6. Data Validation

### Input Validation Rules

**User Creation/Update**:
```typescript
{
  email: {
    type: 'string',
    format: 'email',
    maxLength: 255,
    required: true
  },
  password: {
    type: 'string',
    minLength: 8,
    pattern: /^(?=.*[A-Z])(?=.*[0-9])/,  // At least one uppercase, one number
    required: true  // Only on creation
  },
  name: {
    type: 'string',
    minLength: 2,
    maxLength: 100,
    required: true
  }
}
```

### Output Sanitization
- Remove `password_hash` from all user responses
- Remove `deleted_at` unless admin
- Format dates to ISO 8601
- Null values for optional fields instead of undefined

## 7. Error Handling

### Error Response Format
```typescript
{
  error: {
    code: string;           // Machine-readable code
    message: string;        // Human-readable message
    details?: object;       // Additional context
    field_errors?: {        // Validation errors
      [field: string]: string[];
    };
    request_id: string;     // For tracking
    timestamp: string;      // ISO 8601
  }
}
```

### Error Examples

**Validation Error (400)**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "field_errors": {
      "email": ["Invalid email format"],
      "password": ["Password must be at least 8 characters"]
    },
    "request_id": "req_123abc",
    "timestamp": "2025-01-18T10:30:00Z"
  }
}
```

**Authentication Error (401)**:
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "request_id": "req_456def",
    "timestamp": "2025-01-18T10:30:00Z"
  }
}
```

## 8. External Integrations

### Email Service (SendGrid/AWS SES)
**Purpose**: Send transactional emails

**Configuration**:
- API Key: Environment variable `EMAIL_API_KEY`
- From Address: noreply@example.com
- Rate Limit: 100 emails/second

**Email Types**:
- Welcome email (on registration)
- Password reset email
- Email verification

**Error Handling**:
- Log failures
- Retry 3 times with exponential backoff
- Dead letter queue for persistent failures

### Payment Gateway (Stripe)
**Purpose**: Process payments

**Configuration**:
- API Key: Environment variable `STRIPE_SECRET_KEY`
- Webhook Secret: Environment variable `STRIPE_WEBHOOK_SECRET`

**Webhooks**:
- `POST /api/webhooks/stripe`: Receive payment events
- Verify signature
- Handle events: payment_intent.succeeded, payment_intent.failed

## 9. Background Jobs

### Job: Daily Report Generation
**Schedule**: Daily at 2:00 AM UTC (cron: `0 2 * * *`)

**Process**:
1. Fetch data for previous day
2. Generate report
3. Send email to admins
4. Store report in database

**Retry**: 3 attempts with 5-minute delay
**Timeout**: 10 minutes
**Logging**: Log start, completion, errors

### Job: Cleanup Expired Tokens
**Schedule**: Every hour (cron: `0 * * * *`)

**Process**:
1. Delete refresh tokens older than 7 days
2. Delete password reset tokens older than 1 hour

**Retry**: None (not critical)

## 10. Caching Strategy

### Cache Configuration
- **Store**: Redis
- **Connection**: Redis URL from environment

### Cached Data

**User Profile**:
- Key: `user:profile:{user_id}`
- TTL: 15 minutes
- Invalidate on: user update, user delete

**API Responses** (for expensive queries):
- Key: `api:{endpoint}:{query_hash}`
- TTL: 5 minutes
- Invalidate on: related data change

## 11. Logging and Monitoring

### Logging
**Format**: JSON structured logs

**Example Log Entry**:
```json
{
  "level": "info",
  "timestamp": "2025-01-18T10:30:00Z",
  "message": "User login successful",
  "user_id": "123",
  "email": "user@example.com",
  "ip": "192.168.1.1",
  "request_id": "req_123abc"
}
```

**What to Log**:
- All API requests (method, path, status, duration)
- Authentication attempts
- Database queries (in development only)
- Errors with stack traces
- Business events (user created, payment processed)

**Excluded from Logs**:
- Passwords (hashed or plain)
- Tokens
- Credit card numbers

### Monitoring

**Health Check**:
- Endpoint: `GET /health`
- Response: `{ "status": "ok", "timestamp": "..." }`

**Metrics**:
- Request rate (requests/second)
- Error rate (errors/total requests)
- Response time (p50, p95, p99)
- Database connection pool status
- Cache hit rate

**Alerts**:
- Error rate > 1% for 5 minutes
- Response time p95 > 500ms for 5 minutes
- Database connections > 80% of pool

## 12. Performance Considerations

- **Database Indexes**: All foreign keys and frequently queried fields
- **Query Optimization**: Use `EXPLAIN` to analyze slow queries
- **N+1 Query Prevention**: Use eager loading/joins
- **Pagination**: Default page size 20, max 100
- **Rate Limiting**: Per endpoint, per user/IP
- **Caching**: Cache expensive queries and computations

## 13. Security Best Practices

- **SQL Injection**: Use parameterized queries/ORMs
- **XSS**: Sanitize all user input, use Content Security Policy
- **CSRF**: Use CSRF tokens for state-changing requests
- **Password Storage**: bcrypt with salt rounds >= 10
- **Token Security**: httpOnly, secure, sameSite cookies
- **HTTPS Only**: Enforce HTTPS in production
- **Input Validation**: Validate all input on server side
- **Rate Limiting**: Prevent brute force and DOS

## 14. Testing Strategy

- **Unit Tests**: Test services, utilities, validators
- **Integration Tests**: Test API endpoints with test database
- **E2E Tests**: Test critical user flows
- **Load Tests**: Test under expected traffic
- **Security Tests**: OWASP top 10 vulnerabilities

**Coverage Target**: 80% minimum

## 15. Deployment Configuration

**Environment Variables**:
```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
EMAIL_API_KEY=...
STRIPE_SECRET_KEY=...
NODE_ENV=production
PORT=3000
```

**Database Migrations**:
- Use migration tool (Prisma Migrate, TypeORM, etc.)
- Run migrations before deployment
- Rollback strategy in place
```

## Validation Checklist

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

## Output
Write to: `{documentation_dir}/technical/backend-spec.md` (in `{documentation_language}`)

## Next Steps
After completing backend spec:
1. Review with team for completeness
2. Use for database migration creation
3. Use for API client/SDK generation
4. Reference during epic/story breakdown
5. Implement following standards in `.bmad/standards/backend/`
