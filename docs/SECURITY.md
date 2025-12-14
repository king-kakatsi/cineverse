# Security Policy

## Reporting Security Vulnerabilities

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in CineVerse, please report it responsibly:

### Reporting Process

1. **Email**: Send details to the security team:
   - juppe-styve.hagbe@epitech.eu
   - leroi.kakatsi@epitech.eu

2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if any)

3. **Response Time**:
   - Initial response within 48 hours
   - Status update within 7 days
   - Fix timeline communicated within 14 days

### What to Expect

- Acknowledgment of your report
- Assessment of the vulnerability
- Regular updates on fix progress
- Credit in security advisory (if desired)
- Coordination on public disclosure

## Supported Versions

Security updates are provided for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | Yes                |
| < 1.0   | No                 |

## Security Measures

### Authentication & Authorization

#### Password Security

**Implementation:**
```javascript
import bcrypt from 'bcryptjs';

// Password hashing with bcrypt
const SALT_ROUNDS = 10;
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Password verification
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (recommended)

#### JWT Token Security

**Implementation:**
```javascript
// Token generation with NextAuth.js
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.NEXTAUTH_SECRET,
  { 
    expiresIn: '7d',
    algorithm: 'HS256'
  }
);
```

**Best Practices:**
- Tokens expire after 7 days
- Tokens stored in httpOnly cookies
- CSRF protection enabled
- Secure cookie flag in production

#### Session Management

```javascript
// NextAuth.js configuration
export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
};
```

### Input Validation

#### Server-Side Validation

```javascript
// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

// Password validation
function validatePassword(password) {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain number');
  }
}

// Sanitize user input
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);
```

#### Client-Side Validation

```javascript
// Form validation
const validateForm = (data) => {
  const errors = {};
  
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email required';
  }
  
  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  return errors;
};
```

### Database Security

#### Connection Security

```prisma
// Prisma configuration
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL") // Never hardcode credentials
}
```

**Environment Variables:**
```env
# Secure connection string with SSL
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true"
```

#### Query Protection

```javascript
// Using Prisma prevents SQL injection by default
const user = await prisma.user.findUnique({
  where: { email: userEmail } // Parameterized query
});

// Avoid raw queries when possible
// If necessary, use parameterized queries
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userEmail}
`;
```

#### Data Access Control

```javascript
// Middleware to check user permissions
export async function checkUserAccess(userId, resourceId) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId }
  });
  
  if (resource.userId !== userId) {
    throw new Error('Unauthorized access');
  }
  
  return resource;
}
```

### API Security

#### CORS Configuration

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || 'https://yourdomain.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ];
  }
};
```

#### Request Validation

```javascript
// API route validation
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate data types
    if (typeof body.email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }
    
    // Process request
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
```

### Email Security

#### Email Verification

```javascript
// Generate secure verification token
import crypto from 'crypto';

const verificationToken = crypto.randomBytes(32).toString('hex');

// Store hashed token in database
const hashedToken = crypto
  .createHash('sha256')
  .update(verificationToken)
  .digest('hex');

await prisma.user.update({
  where: { id: userId },
  data: { verificationToken: hashedToken }
});
```

#### Email Templates

```javascript
// Secure email template rendering
import { render } from '@react-email/render';
import VerificationEmail from '@/components/emails/VerificationEmail';

const emailHtml = render(
  <VerificationEmail 
    verificationUrl={sanitizeUrl(verificationUrl)}
    userName={escapeHtml(userName)}
  />
);
```

### Environment Variables

**Never commit sensitive data:**

```bash
# .gitignore
.env
.env.local
.env.production
.env.development
```

**Required security variables:**
```env
# Strong random string for JWT signing
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Database credentials
DATABASE_URL=never-commit-this

# API keys
TMDB_API_KEY=keep-secret
RESEND_API_KEY=keep-secret

# OAuth secrets
GOOGLE_CLIENT_SECRET=never-commit
GITHUB_SECRET=never-commit
...
```

### HTTPS and SSL

**Production configuration:**
```javascript
// Force HTTPS in production
export function middleware(request) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    );
  }
}
```

## Security Checklist

### Deployment Security

- [ ] All environment variables secured
- [ ] HTTPS enabled and enforced
- [ ] Database credentials rotated
- [ ] API keys restricted to production domains
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Rate limiting enabled
- [ ] Error messages sanitized (no stack traces in production)
- [ ] Logging configured without sensitive data
- [ ] Backups enabled and encrypted

### Code Security

- [ ] No hardcoded credentials
- [ ] Input validation on all forms
- [ ] Output encoding to prevent XSS
- [ ] Parameterized database queries
- [ ] Password hashing with bcrypt
- [ ] JWT tokens with expiration
- [ ] CSRF protection enabled
- [ ] File upload validation (if applicable)
- [ ] Dependencies regularly updated
- [ ] Security audit performed (`npm audit`)

### User Security

- [ ] Password requirements enforced
- [ ] Email verification required
- [ ] Account lockout after failed attempts
- [ ] Password reset with secure tokens
- [ ] Session timeout configured
- [ ] Logout functionality working
- [ ] Multi-factor authentication (future)

## Monitoring and Logging

### Security Logging

```javascript
// Log security events
import winston from 'winston';

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'security.log',
      level: 'warn'
    })
  ]
});

// Log failed login attempts
securityLogger.warn('Failed login attempt', {
  email: email,
  ip: request.ip,
  timestamp: new Date().toISOString()
});

// Log suspicious activity
securityLogger.error('Suspicious activity detected', {
  userId: userId,
  action: action,
  timestamp: new Date().toISOString()
});
```

### Security Monitoring

Monitor for:
- Failed authentication attempts
- Unusual API usage patterns
- Database query anomalies
- Unauthorized access attempts
- Suspicious file uploads
- Rate limit violations

## Incident Response

### Response Plan

1. **Detection**: Identify security incident
2. **Containment**: Limit damage and isolate affected systems
3. **Investigation**: Determine scope and impact
4. **Eradication**: Remove threat and vulnerabilities
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Document and improve

### Emergency Contacts

In case of security incident:
- Primary: enagnon.ago@epitech.eu
- Secondary: leroi.kakatsi@epitech.eu

## Security Updates

### Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Update Schedule

- **Dependencies**: Review monthly
- **Security patches**: Apply within 48 hours
- **Critical vulnerabilities**: Apply immediately
- **Framework updates**: Review quarterly

## Compliance

CineVerse follows security best practices including:
- OWASP Top 10 guidelines
- GDPR data protection requirements (if applicable)
- Industry-standard encryption practices
- Secure development lifecycle

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/deployment)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities and acknowledge researchers who help keep CineVerse secure.

---

**Last Updated**: November 2024