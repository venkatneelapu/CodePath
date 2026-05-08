# MongoDB Setup Guide for CodePath

## Option 1: MongoDB Atlas (Recommended - Cloud)

### Step 1: Create Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Start free"
3. Sign up with email or Google

### Step 2: Create Organization & Project

1. Create an organization (name: "CodePath")
2. Create a project (name: "codepath-backend")

### Step 3: Create Cluster

1. Click "Build a Cluster"
2. Choose **M0 Shared** (Free tier - perfect for development)
3. Select your preferred region (closest to you)
4. Click "Create Cluster"

### Step 4: Security Setup

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create user:
   - Username: `codepath_user`
   - Password: Generate secure password
   - Role: **Atlas admin** (for development)

### Step 5: Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IPs

### Step 6: Get Connection String

1. Go to "Clusters"
2. Click "Connect"
3. Choose "Drivers"
4. Copy MongoDB URI
5. Replace `<username>` and `<password>`

**Example connection string:**

```
mongodb+srv://codepath_user:YOUR_PASSWORD@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### Step 7: Add to .env.local

```
MONGODB_URI=mongodb+srv://codepath_user:YOUR_PASSWORD@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

---

## Option 2: MongoDB Community (Local)

### Step 1: Download

- **Windows**: [Download MSI](https://www.mongodb.com/try/download/community)
- **Mac**: `brew install mongodb-community`
- **Linux**: [Installation guides](https://docs.mongodb.com/manual/administration/install-on-linux/)

### Step 2: Install

Follow platform-specific instructions

### Step 3: Start MongoDB

**Windows:**

```bash
mongod
```

**Mac/Linux:**

```bash
brew services start mongodb-community
```

### Step 4: .env.local

```
MONGODB_URI=mongodb://localhost:27017/codepath
```

### Step 5: Verify Connection

```bash
mongosh
# Connect to 'codepath' database
use codepath
# Show collections
show collections
```

---

## Option 3: Docker (Containerized Local)

### Step 1: Create docker-compose.yml

```yaml
version: "3.8"
services:
  mongodb:
    image: mongo:latest
    container_name: codepath-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: codepath_user
      MONGO_INITDB_ROOT_PASSWORD: codepath_password
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Step 2: Start Container

```bash
docker-compose up -d
```

### Step 3: .env.local

```
MONGODB_URI=mongodb://codepath_user:codepath_password@localhost:27017/codepath?authSource=admin
```

### Step 4: Stop Container

```bash
docker-compose down
```

---

## Verify Setup

### Test Connection

```bash
# Create test-db.js
const { MongoClient } = require('mongodb');

async function test() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const admin = client.db().admin();
    const status = await admin.ping();
    console.log('✅ Connected to MongoDB:', status);
  } finally {
    await client.close();
  }
}

test();
```

### Run Test

```bash
node test-db.js
```

---

## Database Management Tools

### MongoDB Compass (GUI)

1. Download from [mongodb.com/products/compass](https://mongodb.com/products/compass)
2. Connect with your URI
3. Browse collections visually

### MongoDB Atlas Web Console

1. Log into [atlas.mongodb.com](https://atlas.mongodb.com)
2. Click "Clusters"
3. Click "Browse Collections"
4. View/edit data directly

### Command Line (mongosh)

```bash
# Connect
mongosh "your_mongodb_uri"

# List databases
show databases

# Use database
use codepath

# List collections
show collections

# Query data
db.users.find()

# Count documents
db.users.countDocuments()

# Clear collection
db.users.deleteMany({})
```

---

## Next Steps

1. **Initialize Database** - Run initialization script:

   ```bash
   node lib/init-database.js
   ```

2. **Seed Sample Data** - Collections and courses are created

3. **Test Endpoints** - Use Postman or cURL to test API

4. **Enable Monitoring** - Set up MongoDB alerts in Atlas

---

## Troubleshooting

### Connection Refused

- Verify MongoDB is running
- Check firewall settings
- Confirm MONGODB_URI is correct
- Check network access (if using Atlas)

### Authentication Failed

- Verify username/password
- Check special characters are URL-encoded
- Ensure user exists in correct database
- Verify IP is whitelisted (Atlas)

### Too Many Connections

- Check connection pooling
- Restart MongoDB
- Reduce concurrent connections

### Performance Issues

- Add indexes (handled in init script)
- Monitor queries with Compass
- Scale cluster size if needed (Atlas)

---

## Production Recommendations

### Security

- Enable authentication (always)
- Use dedicated read-only user for apps
- Whitelist specific IPs
- Enable encryption at rest (Atlas Pro)
- Use VPN/Private endpoints

### Backups

- Enable automated backups (Atlas)
- Set 30-day retention
- Test restore procedures
- Store backups geographically separate

### Monitoring

- Set up alerts for:
  - Connection errors
  - High memory usage
  - Slow queries
  - CPU throttling
- Use MongoDB Charts for analytics

### Scaling

- Monitor growth metrics
- Plan capacity 6 months ahead
- Use sharding for >200GB data
- Consider read replicas for scaling reads

---

## Further Reading

- [MongoDB Official Docs](https://docs.mongodb.com/)
- [Atlas Best Practices](https://docs.atlas.mongodb.com/)
- [Node.js Driver Guide](https://www.mongodb.com/docs/drivers/node/)
- [Performance Tuning](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)
