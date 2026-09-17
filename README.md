# Food Store Calculator

A small NestJS API for calculating food orders with bundle and member discounts.

## Tech Stack

- Node.js 20.11 or later, npm, TypeScript
- NestJS, class-validator, class-transformer
- Jest and Supertest for service and HTTP tests
- Prettier for formatting

## Installation

```sh
npm install
```

## Running the Application

```sh
npm run start:dev
```

The default port is 3000; set `PORT` to override it.

To build and run:

```sh
npm run build
npm run start:prod
```

## Running Tests

```sh
npm test
```

Tests cover discount rules, mixed orders, empty orders, quantity limits, and request validation.

To check formatting:

```sh
npm run format:check
```

## API

### POST /calculator

Send an `application/json` request:

```json
{
  "items": {
    "red": 1,
    "green": 2,
    "orange": 5
  },
  "isMember": true
}
```

Response (`200 OK`; amounts in THB):

```json
{
  "subtotal": 730,
  "bundleDiscount": 28,
  "memberDiscount": 70.2,
  "total": 631.8
}
```

Both fields are required. `items` uses lowercase menu keys and non-negative integer quantities. `isMember` must be a JSON boolean; strings and numbers are not coerced. Invalid requests return `400 Bad Request` through NestJS's standard validation and JSON parsing.

The supported technical input limit is 1,000,000 per menu item to keep monetary arithmetic within JavaScript's safe integer range for the current menu; this is not a store business rule.

## Business Rules

| Item key | Price (THB/set) | Bundle eligible |
| -------- | --------------: | --------------- |
| red      |              50 | No              |
| green    |              40 | Yes             |
| blue     |              30 | No              |
| yellow   |              50 | No              |
| pink     |              80 | Yes             |
| purple   |              90 | No              |
| orange   |             120 | Yes             |

Each pair of the same eligible item receives 5% off both sets. For Orange quantities 1, 2, 3, and 5, respectively 0, 2, 2, and 4 sets receive the discount. Unpaired sets remain full price.

Members receive 10% off the amount after bundle discounts. Orange x2 with membership costs 240 − 12 − 22.80 = 205.20 THB.

## Assumptions

1. Bundle discounts are calculated separately for each eligible menu item; different menu types cannot form a pair.
2. Bundle discounts are applied before the member discount.
3. Member discount is calculated from the amount remaining after bundle discounts.
4. Calculations use integer satang (100 satang = 1 THB). The combined bundle discount and then the member discount are each rounded half up to the nearest satang. Responses use THB numbers without fixed trailing zeros.
5. Zero and omitted quantities contribute nothing. An empty `items` object returns all zeros.

## Project Structure

`src/calculator/` contains the module, HTTP controller, calculation service, DTO, menu configuration, types, and service tests. The controller delegates calculations to the service. Menu prices and bundle eligibility live in `constants/menu.constant.ts`; the DTO validates item keys against this configuration. `AppModule` registers the global ValidationPipe, and `test/` contains HTTP integration tests.
