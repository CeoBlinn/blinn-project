# Blinn Backend Service

This is the backend service for the Blinn credit card rewards optimization app. It provides APIs for optimizing credit card rewards based on spending patterns.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:3000.

## API Documentation

### Optimize Credit Cards

Endpoint: `POST /api/v1/optimize`

Optimizes credit card recommendations based on spending patterns.

Request body:
```json
{
  "categories": [
    {
      "name": "Dining",
      "amount": 500,
      "frequency": "monthly"
    },
    {
      "name": "Travel",
      "amount": 5000,
      "frequency": "annual"
    }
  ]
}
```

Response:
```json
{
  "optimizedCards": [
    {
      "id": "chase-sapphire",
      "name": "Chase Sapphire Preferred",
      "rewards": [
        {
          "category": "Dining",
          "amount": 180
        },
        {
          "category": "Travel",
          "amount": 250
        }
      ],
      "features": [
        "No foreign transaction fees",
        "60,000 point sign-up bonus",
        "Primary rental car insurance"
      ]
    }
  ],
  "potentialRewards": [
    {
      "category": "Dining",
      "amount": 180
    },
    {
      "category": "Travel",
      "amount": 250
    }
  ]
}
```

## Development

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the TypeScript project
- `npm start`: Start the production server
- `npm test`: Run tests 