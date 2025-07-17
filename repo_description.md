# Order Processing System Repository Description

## Overview

This repository contains a **Order Processing System Proof of Concept (PoC)** implemented as a microservices-based application. The system demonstrates a modern, scalable architecture for handling e-commerce order processing with real-time status tracking and reliable message processing.

## 🏗️ Architecture & Design Philosophy

The system follows **KISS (Keep It Simple, Stupid) principles**, prioritizing simplicity, low operational costs, and reliability over complex over-engineering. It implements a focused 2-service microservices architecture rather than creating numerous small services, which helps reduce development and operational complexity.

### Core Services

1. **Order Service** (Port 3001)
   - REST API for order management
   - JWT-based authentication (OAuth2 Client Credentials flow)
   - Order creation, validation, and status tracking
   - Real-time customer notifications
   - Redis-based idempotency protection

2. **Delivery Service** (Port 3002)
   - Asynchronous order processing worker
   - Shipment creation and tracking simulation
   - Status update publishing
   - Integration with logistics workflow

### Infrastructure Components

- **PostgreSQL**: Primary database for orders, shipments, and audit logs
- **Redis**: Caching layer for idempotency (24h TTL) and performance
- **ElasticMQ**: Local SQS FIFO queue mock for development
- **Docker Compose**: Infrastructure orchestration

## 🚀 Technology Stack

### Runtime & Framework
- **Node.js** with **TypeScript** for type safety
- **Express.js** for REST API development
- **Passport.js** for authentication middleware

### Data & Messaging
- **PostgreSQL 15** for persistent data storage
- **Redis 7** for caching and session management
- **AWS SQS FIFO** queues (via ElasticMQ locally) for reliable message ordering
- **@aws-sdk/client-sqs** for SQS integration

### Development & Testing
- **Mocha + Chai + Sinon** for comprehensive unit testing
- **ESLint + TypeScript** for code quality
- **Nodemon** for development hot-reloading
- **Docker** for consistent development environments

### Additional Libraries
- **winston** for structured logging
- **helmet** for security headers
- **cors** for cross-origin requests
- **opossum** for circuit breaker pattern
- **axios-retry** for resilient HTTP calls
- **uuid** for unique identifier generation

## 📁 Project Structure

```
OrderProcessingSystemRepo/
├── src/
│   ├── shared/                 # Shared utilities and types
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Common utilities
│   ├── order-service/         # Order API service
│   │   ├── middleware/        # Authentication & validation
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   └── server.ts         # Service entry point
│   └── delivery-service/      # Delivery worker service
│       ├── middleware/        # Message processing
│       ├── routes/           # Health endpoints
│       ├── services/         # Delivery logic
│       └── server.ts         # Service entry point
├── tests/                     # Unit tests (mirrors src/ structure)
├── demo/                      # Demo scripts and API examples
├── scripts/                   # System management scripts
├── docker/                    # Docker configurations
└── docs/                      # Additional documentation
```

## 🔄 Data Flow & Message Processing

The system implements an **event-driven architecture** with asynchronous message processing:

1. **Authentication**: Client obtains JWT token via OAuth2 Client Credentials
2. **Order Creation**: Client creates order via REST API with JWT authorization
3. **Message Publishing**: Order Service publishes `ORDER_CREATED` event to SQS FIFO queue
4. **Asynchronous Processing**: Delivery Service consumes messages and processes shipments
5. **Status Updates**: Delivery Service publishes status updates back to Order Service
6. **Customer Notifications**: Real-time updates via WebSocket/Server-Sent Events

## 🛠️ Key Features

### Security & Authentication
- JWT-based authentication with configurable expiration
- OAuth2 Client Credentials flow
- Helmet.js security headers
- Input validation and sanitization
- Redis-based idempotency protection

### Reliability & Resilience
- SQS FIFO queues for message ordering and deduplication
- Circuit breaker pattern for external service calls
- Automatic retry mechanisms with exponential backoff
- Health check endpoints for monitoring
- Structured logging with Winston

### Development Experience
- Comprehensive management scripts (`manage-system.sh`)
- Interactive demo with expected outputs
- Extensive unit test coverage
- Hot-reloading development mode
- Docker-based infrastructure setup
- Detailed API documentation with curl examples

### Monitoring & Operations
- Health check endpoints for all services
- Comprehensive system status monitoring
- Structured logging with different levels
- Real-time log viewing capabilities
- Database and infrastructure health validation

## 🎯 Management & Operations

The repository includes sophisticated tooling for system management:

### Primary Management Script
- `./scripts/manage-system.sh` - Unified system management
  - `up` - Start all services
  - `down` - Stop all services  
  - `restart` - Restart all services
  - `status` - Check service status
  - `logs` - View all logs
  - `demo` - Run interactive demo

### Utility Scripts
- `./scripts/health-check.sh` - Comprehensive health inspection
- `./scripts/setup-database.sh` - Database initialization
- `./scripts/start-services.sh` - Legacy startup script

## 📚 Documentation

The repository includes extensive documentation:

- **README.md** - Quick start guide and overview
- **SYSTEM_DESIGN.md** - Complete architecture and design decisions
- **IMPLEMENTATION_SUMMARY.md** - Detailed implementation guide and features
- **DEMO_GUIDE.md** - Complete demo walkthrough with expected outputs
- **MANUAL_E2E_TESTING_GUIDE.md** - End-to-end testing procedures
- **demo/curl-examples.md** - Manual API testing instructions

## 🧪 Testing Strategy

- **Unit Tests**: Comprehensive coverage with Mocha, Chai, and Sinon
- **Integration Testing**: Via interactive demo scripts
- **API Testing**: Curl examples and automated demo scenarios
- **Health Monitoring**: Automated health checks for all components

## 🎮 Demo & Examples

The repository includes a complete demo system:
- Interactive demo script with real API calls
- Expected output validation
- Comprehensive curl examples for manual testing
- Real-time order processing visualization
- Status tracking and notifications demonstration

## 💡 Design Decisions & Rationale

### Technology Choices
- **AWS SQS over Kafka/RabbitMQ**: Lower operational cost and complexity for target scale
- **PostgreSQL over NoSQL**: ACID compliance and relational data requirements
- **Redis for caching**: High performance and TTL support for idempotency
- **TypeScript**: Type safety and better developer experience
- **Docker Compose**: Simplified local development environment

### Architecture Decisions  
- **2-service architecture**: Balance between separation of concerns and operational simplicity
- **FIFO queues**: Ensures message ordering for critical business operations
- **Event-driven design**: Loose coupling and scalability
- **Shared types**: Code reuse and type consistency across services

## 🚀 Quick Start

1. **Start the system**: `./scripts/manage-system.sh up`
2. **Run the demo**: `./scripts/manage-system.sh demo`
3. **Check health**: `./scripts/health-check.sh`
4. **View logs**: `./scripts/manage-system.sh logs`
5. **Stop the system**: `./scripts/manage-system.sh down`

This repository represents a production-ready foundation for an order processing system that can be easily extended and scaled according to business requirements.