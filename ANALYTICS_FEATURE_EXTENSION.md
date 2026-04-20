# ShebaConnect External Public Analytics Extension

This extension uses external Bangladeshi APIs first, then stores transformed records in MongoDB.

## Created Folder Structure

### Backend

- server/models/publicData.model.js
- server/models/geoData.model.js
- server/models/analytics.model.js
- server/services/dataFetcher.service.js
- server/services/dataProcessor.service.js
- server/controllers/analytics.controller.js
- server/routes/analytics.routes.js
- server/jobs/dataSync.job.js

### Frontend

- client/src/pages/AnalyticsDashboard.jsx
- client/src/components/analytics/ChartCard.jsx
- client/src/components/analytics/AnalyticsLayout.jsx
- client/src/services/analytics.api.js
- client/src/components/NavbarAnalyticsLink.jsx

## Mandatory External API Usage Implemented

The function fetchAndStorePublicData in server/services/dataFetcher.service.js calls:

1. https://bdopenapi.vercel.app/api/geo/divisions
2. https://bdopenapi.vercel.app/api/geo/districts
3. https://bdopenapi.vercel.app/api/geo/upazilas
4. https://bdapis.com/api/v1.2/districts
5. https://bdapis.com/api/v1.2/upazilas
6. https://bangladeshindata.org (via CKAN package search + CSV/JSON dataset resource)

It logs each call with:

console.log("Fetched from external API", url)

## Backend Integration Snippets

Add route registration in your Express app entry:

```js
const analyticsRoutes = require("./routes/analytics.routes");
app.use("/api/analytics", analyticsRoutes);
```

Add cron startup in your server bootstrap:

```js
const { startDataSyncJob } = require("./jobs/dataSync.job");
startDataSyncJob();
```

Optional manual sync trigger on startup:

```js
const { runDataSyncNow } = require("./jobs/dataSync.job");
runDataSyncNow().catch((err) => console.error(err.message));
```

## Frontend Integration Snippets

### Route registration

```jsx
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

<Route
  path="/analytics"
  element={
    <PrivateRoute>
      <AnalyticsDashboard />
    </PrivateRoute>
  }
/>
```

### Navbar integration without editing feature files

Import reusable link component:

```jsx
import NavbarAnalyticsLink from "./components/NavbarAnalyticsLink";
```

Inject inside navbar link list rendering:

```jsx
<NavbarAnalyticsLink
  user={user}
  className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50"
/>
```

The component renders Analytics Dashboard for role user and role admin.

## New API Endpoints

- GET /api/analytics/public-data
- GET /api/analytics/geo
- GET /api/analytics/insights

All endpoints require Bearer token.

## Example MongoDB Stored Documents

### PublicData

```json
{
  "source": "bdopenapi",
  "category": "geo",
  "datasetKey": "bdopenapi-geo",
  "recordsCount": 560,
  "lastUpdated": "2026-04-18T12:00:00.000Z"
}
```

### GeoData

```json
{
  "source": "bdapis",
  "division": "Dhaka",
  "district": "Gazipur",
  "upazila": "Sreepur",
  "lastUpdated": "2026-04-18T12:00:00.000Z"
}
```

### AnalyticsInsights

```json
{
  "type": "external-public-insights",
  "result": {
    "districtUsage": [{ "_id": "Dhaka", "usage": 34 }],
    "categoryBreakdown": [{ "_id": "geo", "totalRecords": 1200, "avgRecords": 400 }],
    "trends": [{ "_id": { "y": 2026, "m": 4, "d": 18 }, "totalRecords": 1200, "avgRecords": 400 }],
    "generatedAt": "2026-04-18T12:00:00.000Z"
  },
  "createdAt": "2026-04-18T12:00:00.000Z"
}
```

## Example API Responses

### GET /api/analytics/public-data

```json
{
  "success": true,
  "source": "mongodb-cache",
  "data": [
    {
      "source": "bangladeshindata.org",
      "category": "population",
      "datasetKey": "open-data-population",
      "recordsCount": 64
    }
  ]
}
```

### GET /api/analytics/geo

```json
{
  "success": true,
  "source": "mongodb-cache",
  "data": [
    {
      "source": "bdopenapi",
      "division": "Dhaka",
      "district": "Narayanganj",
      "upazila": "Rupganj"
    }
  ]
}
```

### GET /api/analytics/insights

```json
{
  "success": true,
  "source": "mongodb-cache",
  "data": {
    "districtUsage": [{ "_id": "Dhaka", "usage": 34 }],
    "categoryBreakdown": [{ "_id": "geo", "totalRecords": 1200 }],
    "trends": [{ "_id": { "y": 2026, "m": 4, "d": 18 }, "totalRecords": 1200 }],
    "generatedAt": "2026-04-18T12:00:00.000Z"
  }
}
```
