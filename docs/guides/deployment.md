---
layout: page
title: Deployment
description: Deploy your an5 ORM application to production
---

# Deployment

Deploy an5 ORM applications to various environments.

## Production Checklist

Before deploying:

- [ ] Set `DATABASE_URL` environment variable
- [ ] Configure connection pooling
- [ ] Enable HTTPS for database connections
- [ ] Set appropriate log level
- [ ] Configure backup strategy
- [ ] Test with production-like data

## Environment Setup

### Environment Variables

```ini
# Production database
DATABASE_URL=sqlserver://your-server.database.windows.net:1433;database=proddb;user=admin;password=secure-password;encrypt=true

# Logging
LOG_LEVEL=warn

# Disable debug features
NODE_ENV=production
```

### Connection Pooling

```typescript
const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  pool: {
    min: 10,
    max: 50,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 30000
  }
});
```

## Deployment Options

### Azure App Service

1. **Create App Service**
   ```bash
   az webapp create --resource-group myRG --plan myPlan --name myApp
   ```

2. **Configure Settings**
   ```bash
   az webapp config appsettings set \
     --resource-group myRG \
     --name myApp \
     --settings DATABASE_URL="sqlserver://..."
   ```

3. **Deploy**
   ```bash
   az webapp deployment source config-local-git \
     --resource-group myRG \
     --name myApp
   
   git push azure main
   ```

### AWS Elastic Beanstalk

1. **Initialize**
   ```bash
   eb init -p node.js my-app
   ```

2. **Create Environment**
   ```bash
   eb create production
   ```

3. **Set Environment Variables**
   ```bash
   eb setenv DATABASE_URL="sqlserver://..."
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### Docker

**Dockerfile:**
```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=sqlserver://db:1433;database=mydb;user=sa;password=yourpassword
    depends_on:
      - db

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=yourpassword
    volumes:
      - mssql-data:/var/opt/mssql

volumes:
  mssql-data:
```

### Kubernetes

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

## Database Migrations

### Push Schema

```bash
npm run db:push
```

### Pull Schema (Reverse)

```bash
npm run db:pull
```

### Manual Migration

```typescript
import { An5ORM } from 'an5-orm';

async function migrate() {
  const db = new An5ORM({
    connectionString: process.env.DATABASE_URL
  });
  
  // Run migrations
  await db.$executeRaw`CREATE TABLE IF NOT EXISTS users (...)`;
  
  await db.$disconnect();
}

migrate().catch(console.error);
```

## Monitoring

### Health Check Endpoint

```typescript
app.get('/health', async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: 'healthy' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});
```

### Query Logging

```typescript
const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  logging: {
    queries: process.env.NODE_ENV === 'development',
    slow: true,
    slowThreshold: 1000
  }
});
```

### Metrics

Track these metrics:

- Query response times
- Connection pool usage
- Error rates
- Slow query count

## Security

### Connection Security

```ini
# Use encrypted connection
DATABASE_URL=sqlserver://server:1433;database=db;encrypt=true;trustServerCertificate=false
```

### Environment Variables

- Never hardcode credentials
- Use secret management (Azure Key Vault, AWS Secrets Manager)
- Rotate credentials regularly

### Network Security

- Use VNet/VPC for database access
- Restrict IP whitelist
- Use private endpoints

## Troubleshooting

### Common Issues

**Connection Timeout:**
```typescript
// Increase timeout
const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  pool: {
    acquireTimeoutMillis: 60000
  }
});
```

**Memory Issues:**
```typescript
// Limit pool size
const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  pool: {
    max: 10
  }
});
```

**Slow Queries:**
```typescript
// Enable slow query logging
const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  logging: {
    slow: true,
    slowThreshold: 500
  }
});
```

## Best Practices

1. **Use connection pooling** - Essential for production performance
2. **Enable monitoring** - Track query performance and errors
3. **Implement health checks** - For load balancers and orchestrators
4. **Use migrations** - Version control your schema changes
5. **Test with production data** - Use realistic data volumes
6. **Backup regularly** - Automated database backups
