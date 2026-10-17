# Product Catalog

A lightweight React and TypeScript frontend that retrieves product data from a separate ASP.NET Core API. This project demonstrates a typed API response, asynchronous data fetching, and clear loading, empty, and error states.

## Features

- Fetches products from `GET /api/products`
- Displays each product's name and price
- Handles loading, empty-result, and request-error states
- Cancels the in-flight request when the component unmounts
- Uses TypeScript with React 19 and Vite

## Tech stack

- React 19
- TypeScript
- Vite
- ESLint
- ASP.NET Core API (separate project)

## Getting started

### Prerequisites

- Node.js and npm
- The Product API running locally

### Run the frontend

From this directory:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### Configure the API URL

The API URL is currently set in `src/App.tsx`:

```ts
const API_URL = 'http://localhost:5041/api/products'
```

Update it if your API uses a different scheme, host, port, or route.

The frontend expects a JSON array with this shape:

```json
[
  {
    "id": 2,
    "name": "Wireless Mouse",
    "price": 29.99
  }
]
```

## CORS setup

Because the frontend and API run on different origins (for example, ports `5173` and `5041`), the API must allow the frontend's origin. Configure CORS in the **ASP.NET Core API project**, not in this React app. For local Vite development, allow the exact origin shown in your browser:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactDev", policy =>
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("ReactDev");

// Keep the API's existing middleware and endpoint mappings below.
```

If Vite uses a different port, update the origin accordingly. Restart the API after changing its CORS configuration.

## Development commands

```powershell
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## Troubleshooting

- **CORS error in the browser:** Ensure the API allows the frontend's exact origin, including scheme and port.
- **Connection refused or network error:** Start the API and verify that `API_URL` points to its actual address.
- **HTTP error:** Check the API response and confirm that `GET /api/products` is available.
- **Unexpected product data:** Confirm the API returns an array with numeric `id` and `price` fields and a string `name`.

## Project structure

```text
src/
  App.tsx       Product fetching and rendering
  App.css       App-level styles
  index.css     Global styles
  main.tsx      React application entry point
```

