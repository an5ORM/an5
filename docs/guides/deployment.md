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

For spreadsheet-backed apps, point `DATABASE_URL` at a `googlesheets://` connection
string instead (the adapter auto-detects the scheme):

```ini
DATABASE_URL=googlesheets://spreadsheetId;clientEmail=sa@project.iam.gserviceaccount.com;privateKey=url-encoded-key;sheetMapping=users:Users,orders:Orders
```

When using a service account, deploy its private key as a secret (e.g. an App Service
environment variable, Secret Manager, or Vault) rather than committing it to source.

### Connection Pooling

```typescript
// Uses DATABASE_URL from the environment; pool sizing is handled by the database adapter
const db = new An5ORM();
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

The migration commands support schema/database comparison, SQL generation, dry-run SQL previews, pending-file apply tracking, latest-migration rollback, multi-step rollback, and rollback through a named applied file when each file contains a `-- migrate:down` section. See [Feature Status]({{ '/guides/feature-status/' | relative_url }}) for current gaps.

### Push Schema

```bash
npm run db:push   # from an5Orm/
npm run db:migrate:apply
npm run db:migrate:rollback
```

### Pull Schema (Reverse)

```bash
npm run db:pull   # from an5Orm/
```

### Manual Migration

```typescript
import { An5ORM } from '@an5/orm';

async function migrate() {
  const db = new An5ORM();  // Uses DATABASE_URL from the environment
  
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
// Uses DATABASE_URL from the environment; set LOG_LEVEL=debug for query logging
const db = new An5ORM();
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
// Uses DATABASE_URL from the environment; timeouts are configured via the adapter
const db = new An5ORM();
```

**Memory Issues:**
```typescript
// Uses DATABASE_URL from the environment; pool sizing is handled by the adapter
const db = new An5ORM();
```

**Slow Queries:**
```typescript
// Uses DATABASE_URL from the environment; set LOG_LEVEL=debug for slow-query logging
const db = new An5ORM();
```

## Best Practices

1. **Use connection pooling** - Essential for production performance
2. **Enable monitoring** - Track query performance and errors
3. **Implement health checks** - For load balancers and orchestrators
4. **Use migrations** - Version control your schema changes
5. **Test with production data** - Use realistic data volumes
6. **Backup regularly** - Automated database backups
