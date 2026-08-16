# EMI Event Reconstruction System

## Overview

A deterministic event sourcing system for reconstructing EMI payment history from asynchronous financial events.

## Features

- Event ingestion
- Duplicate detection
- State reconstruction
- Audit logging
- Customer balance tracking
- Replay support

## Tech Stack

- React
- Express
- MongoDB
- Node.js

## Setup

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev

## APIs

POST /events

GET /customers/:id/state

GET /customers/:id/audit

## Fixture Data

fixtures/sample-events.json

## Audit Logs

logs/sample-audit.json

## Running Tests

npm test

## Demo Workflow

1. Submit payment
2. Submit duplicate
3. Submit reversal
4. View reconstructed state
5. View audit trail