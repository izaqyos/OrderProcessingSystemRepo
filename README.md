# Order Processing System PoC

A microservices-based order processing system with SQS FIFO queues, JWT auth, and real-time notifications.

## 📚 Documentation

- 📋 **[System Design Document](SYSTEM_DESIGN.md)** - Complete architecture and design decisions
- 🚀 **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Detailed implementation guide and features
- 📖 **[Demo Guide](demo/curl-examples.md)** - API examples and testing instructions
- 🗺️ **[Documentation Map](DOCUMENTATION_MAP.md)** - How all docs connect together

## Architecture

- **Order Service**: Auth + order creation + customer notifications
- **Delivery Service**: Shipment processing + status updates  
- **Infrastructure**: PostgreSQL + Redis + SQS FIFO (ElasticMQ)

> 🏗️ **Design Philosophy**: This 2-service architecture follows KISS principles, prioritizing simplicity and low operational costs. See [System Design](SYSTEM_DESIGN.md) for detailed rationale.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# One-command setup - starts everything
./scripts/start-services.sh

# Run interactive demo
./demo/demo.sh
```

### Option 2: Manual Development Setup
```bash
# 1. Setup infrastructure
npm run docker:up
cp env.example .env

# 2. Install dependencies
npm install

# 3. Setup database
./scripts/setup-database.sh

# 4. Run services in development mode
npm run dev:order    # Order service on :3001
npm run dev:delivery # Delivery service on :3002
```

### Testing
```bash
# Run unit tests
npm test

# Run linting
npm run lint

# Run integration demo
./demo/demo.sh
```

> 💡 **See [Implementation Summary](IMPLEMENTATION_SUMMARY.md)** for detailed setup instructions and troubleshooting.

## API Endpoints

### Auth
- `POST /auth/token` - Get JWT token

### Orders
- `POST /orders` - Create order (requires JWT)
- `GET /orders/:id` - Get order status

### Health
- `GET /health` - Service health check

## Queue Management

- **ElasticMQ UI**: http://localhost:9325
- **Queues**: `orders-queue.fifo`, `delivery-status-queue.fifo`

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express + Passport.js
- **Database**: PostgreSQL
- **Cache**: Redis  
- **Queues**: SQS FIFO (ElasticMQ for local dev)
- **Testing**: Mocha + Sinon + Chai
- **Linting**: ESLint + TypeScript

> 🔧 **Technology Rationale**: Each choice optimizes for the specific requirements. See [System Design](SYSTEM_DESIGN.md) for detailed technology decisions and [Implementation Summary](IMPLEMENTATION_SUMMARY.md) for feature implementation details.

## 📁 Project Structure

```
OrderProcessingSystemRepo/
├── src/
│   ├── shared/                 # Shared utilities and types
│   ├── order-service/         # Order API service
│   └── delivery-service/      # Delivery worker service
├── demo/                      # Demo scripts and examples
├── scripts/                   # Setup and utility scripts
├── docker-compose.yml         # Infrastructure setup
├── README.md                  # This file
├── SYSTEM_DESIGN.md          # Architecture documentation
└── IMPLEMENTATION_SUMMARY.md  # Implementation details
```

> 📖 **See [Implementation Summary](IMPLEMENTATION_SUMMARY.md)** for detailed code organization and architecture patterns.

---

## 📚 Next Steps

- **🏗️ Architecture**: Read the [System Design Document](SYSTEM_DESIGN.md) for complete architectural decisions
- **🚀 Implementation**: Check the [Implementation Summary](IMPLEMENTATION_SUMMARY.md) for detailed features and setup
- **🎯 Demo**: Run `./demo/demo.sh` for a complete end-to-end demonstration
- **📖 API Testing**: See [curl examples](demo/curl-examples.md) for manual API testing
