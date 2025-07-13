# Chronologicon-engine-backend

This backend is built for ArchaeoData Inc.'s Chronologicon Engine, designed to ingest, analyze, and expose historical event data via structured API endpoints.

## Tech Stack

- Node.js
- Express.js
- MSSQL

## Setup

1. Clone the repository
    ```bash
    git clone https://github.com/AbbasNajmi18/chronologicon-engine-backend.git
    ```
2. Install dependencies
    ```bash
    npm install
    ```
3. Create a database
    Create a database named 'chronologicon' in your MSSQL server using the schema.sql file
    ```bash
    sqlcmd -S localhost -U your_username -P your_password -i scripts/schema.sql
    ```
    OR You can manually run the schema.sql file using SQL Server Management Studio (SSMS)

4. Configure the database connection
    ```bash
    Update your username and password in db.js
    ```
5. Test the connection
    ```bash
    node test-db.js
    ```
6. Run the server
    ```bash
    npm start
    ```
## API Endpoints

### The Chronologicon Engine
1. Ingest Events
    Description: Ingests a raw .txt data file with historical event records.
    ```bash
    POST /api/events/ingest
    ```
    Request Body:
    You can use sample event file from data/events.txt  
    ```json
    {
        "filePath": "path/to/your/events.txt"
    }
    ```
    Curl command:
    ```bash
    curl -X POST http://localhost:3000/api/events/ingest \
    -H "Content-Type: application/json" \
    -d '{"filePath": "path/to/your/events.txt"}'
    ```
    Response:
    ```json
    {
    "status": "Ingestion initiated",
    "jobId": "ingest-job-85217be1-f553-4d57-9ddb-fbc8aab8228d",
    "message": "Check /api/events/ingestion-status/ingest-job-85217be1-f553-4d57-9ddb-fbc8aab8228d for updates."
    }
    ```

2. Get Ingestion Status
    Description: Gets the status of an ingestion job.
    ```bash
    GET /api/events/ingestion-status/{jobId}
    ```
    Request Parameters:
    ```json
    {
        "jobId": "ingest-job-85217be1-f553-4d57-9ddb-fbc8aab8228d"
    }
    ```
    Curl command:
    ```bash
    curl -X GET http://localhost:3000/api/events/ingestion-status/ingest-job-85217be1-f553-4d57-9ddb-fbc8aab8228d
    ```
    Response(200 OK - Processing):
    ```json
    {
        "jobId": "ingest-job-5dcb28df-f546-40bd-8775-ef2cbf603d18",
        "status": "COMPLETED",
        "processedLines": 4,
        "errorLines": 2,
        "totalLines": 5,
        "errors": ["Line 1: Invalid date format","Line 2: Invalid date format"],
        "startTime": "2025-07-12T11:35:41.981Z",
        "endTime": null
    }
    ```
    Response(200 OK - Completed):
    ```json
    {
        "jobId": "ingest-job-5dcb28df-f546-40bd-8775-ef2cbf603d18",
        "status": "COMPLETED",
        "processedLines": 5,
        "errorLines": 0,
        "totalLines": 5,
        "errors": [],
        "startTime": "2025-07-12T11:35:41.981Z",
        "endTime": "2025-07-12T11:35:42.131Z"
    }
3. Get Timeline 
   Description : Given a rootEventId, it returns the entire
    hierarchical timeline, including all its direct and indirect child & parent events,
    presented as a nested JSON structure.
    ```bash
    GET /api/events/timeline/{rootEventId}
    ```
    Request Parameters:
    ```json
    {
        "rootEventId": "6BC34A20-39E6-4667-A6FF-35D650F4C345"
    }
    ```
    Curl command:
    ```bash
    curl -X GET http://localhost:3000/api/events/timeline/6BC34A20-39E6-4667-A6FF-35D650F4C345
    ```
    Response:
    ```json
    {
    "event_id": "6BC34A20-39E6-4667-A6FF-35D650F4C345",
    "event_name": "Team Expansion",
    "description": "Hired 5 new researchers",
    "start_date": "2023-03-01T09:00:00.000Z",
    "end_date": "2023-03-01T09:30:00.000Z",
    "duration_minutes": 30,
    "parent_event_id": null,
    "metadata": "{\"source\": \"HR report\"}",
    "children": [
        {
            "event_id": "08D1EF80-89DE-4AB3-B1B7-7D42DB2E1100",
            "event_name": "Research Portal Launch",
            "description": "Beta version live",
            "start_date": "2023-02-01T10:00:00.000Z",
            "end_date": "2023-02-01T12:00:00.000Z",
            "duration_minutes": 120,
            "parent_event_id": "6BC34A20-39E6-4667-A6FF-35D650F4C345",
            "metadata": "{\"source\": \"release_notes\"}",
            "children": [
                {
                    "event_id": "6FDF6FFC-ED77-94FA-407E-A7B86ED9E59D",
                    "event_name": "Founding of ArchaeoData",
                    "description": "Initial establishment of the company",
                    "start_date": "2023-01-01T10:00:00.000Z",
                    "end_date": "2023-01-01T11:30:00.000Z",
                    "duration_minutes": 90,
                    "parent_event_id": "08D1EF80-89DE-4AB3-B1B7-7D42DB2E1100",
                    "metadata": "{\"source\": \"internal\"}",
                    "children": []
                }
            ]
        }
    ]
    }
    ```
4. Search 

    Description : Allows searching for events based on various criteria. Supports partial string matching for event_name (case-insensitive), date range filtering (start_date_after, end_date_before), pagination, and sorting.
    ```bash
    GET /api/events/search?name=Team&start_date_after=2023-01-01T09:00:00.000Z&end_date_before=2023-03-01T09:30:00.000Z&sortBy=start_date&sortOrder=asc&page=1&limit=5
    ```
    Request Parameters:
    ```json
    {
    "name": "Team",
    "start_date_after": "2023-01-01T09:00:00.000Z",
    "end_date_before": "2023-03-01T09:30:00.000Z",
    "sortBy": "start_date",
    "sortOrder": "asc",
    "page": 1,
    "limit": 5
    }
    ```
    Curl command:
    ```bash
    curl -X GET http://localhost:3000/api/events/search \
    -H "Content-Type: application/json" \
    -d '{"name": "Team", "start_date_after": "2023-01-01T09:00:00.000Z", "end_date_before": "2023-03-01T09:30:00.000Z", "sortBy": "start_date", "sortOrder": "asc", "page": 1, "limit": 5}'
    ```
    Response:
    ```json
    {
    "totalEvents": 1,
    "page": 1,
    "limit": 5,
    "events": [
        {
            "event_id": "6BC34A20-39E6-4667-A6FF-35D650F4C345",
            "event_name": "Team Expansion"
        }
    ]
    }
    ```
5. Overlapping events

    Description : Returns a list of all distinct event pairs that have overlapping
    timeframes.
    ```bash
    GET /api/insights/overlapping-events?startDate=2023-01-01T00:00:00Z&endDate=2023-01-20T00:00:00Z
    ```
    Curl command:
    ```bash
    curl -X GET http://localhost:3000/api/insights/overlapping-events?startDate=2023-01-01T00:00:00Z&endDate=2023-01-20T00:00:00Z
    ```
    Scenario 1: Overlapping events found
    Response:
    ```json
        [
        {
            "overlappingEventPairs": [
                {
                    "event_id": "11111111-1111-1111-1111-111111111111",
                    "event_name": "Event A",
                    "start_date": "2023-01-01T09:00:00.000Z",
                    "end_date": "2023-01-01T10:00:00.000Z"
                },
                {
                    "event_id": "22222222-2222-2222-2222-222222222222",
                    "event_name": "Event B",
                    "start_date": "2023-01-01T09:30:00.000Z",
                    "end_date": "2023-01-01T10:15:00.000Z"
                }
            ],
            "overlap_duration_minutes": 30
        },
        {
            "overlappingEventPairs": [
                {
                    "event_id": "22222222-2222-2222-2222-222222222222",
                    "event_name": "Event B",
                    "start_date": "2023-01-01T09:30:00.000Z",
                    "end_date": "2023-01-01T10:15:00.000Z"
                },
                {
                    "event_id": "6FDF6FFC-ED77-94FA-407E-A7B86ED9E59D",
                    "event_name": "Founding of ArchaeoData",
                    "start_date": "2023-01-01T10:00:00.000Z",
                    "end_date": "2023-01-01T11:30:00.000Z"
                }
            ],
            "overlap_duration_minutes": 15
        },
        {
            "overlappingEventPairs": [
                {
                    "event_id": "55555555-5555-5555-5555-555555555555",
                    "event_name": "Event E",
                    "start_date": "2023-01-15T09:00:00.000Z",
                    "end_date": "2023-01-15T10:00:00.000Z"
                },
                {
                    "event_id": "66666666-6666-6666-6666-666666666666",
                    "event_name": "Event F",
                    "start_date": "2023-01-15T09:45:00.000Z",
                    "end_date": "2023-01-15T10:30:00.000Z"
                }
            ],
            "overlap_duration_minutes": 15
        }
    ]
    ```
    Scenario 2: No Overlapping events found
    Response:
    ```json
    []
    ```

### The "Temporal Gap Finder"

Description : Given a list of HistoricalEvent objects within a specified date range, identifies the largest continuous
"gap" in recorded events within that timeframe.

```bash
GET /api/insights/temporal-gaps?startDate=2023-01-01T00:00:00Z&endDate=2023-01-20T00:00:00Z
```
Curl command:
```bash
curl -X GET http://localhost:3000/api/insights/temporal-gaps?startDate=2023-01-01T00:00:00Z&endDate=2023-01-20T00:00:00Z
```
Scenario 1: Gap Found
Response:
```json
    [
    {
        "overlappingEventPairs": [
            {
                "event_id": "11111111-1111-1111-1111-111111111111",
                "event_name": "Event A",
                "start_date": "2023-01-01T09:00:00.000Z",
                "end_date": "2023-01-01T10:00:00.000Z"
            },
            {
                "event_id": "22222222-2222-2222-2222-222222222222",
                "event_name": "Event B",
                "start_date": "2023-01-01T09:30:00.000Z",
                "end_date": "2023-01-01T10:15:00.000Z"
            }
        ],
        "overlap_duration_minutes": 30
    },
    {
        "overlappingEventPairs": [
            {
                "event_id": "22222222-2222-2222-2222-222222222222",
                "event_name": "Event B",
                "start_date": "2023-01-01T09:30:00.000Z",
                "end_date": "2023-01-01T10:15:00.000Z"
            },
            {
                "event_id": "6FDF6FFC-ED77-94FA-407E-A7B86ED9E59D",
                "event_name": "Founding of ArchaeoData",
                "start_date": "2023-01-01T10:00:00.000Z",
                "end_date": "2023-01-01T11:30:00.000Z"
            }
        ],
        "overlap_duration_minutes": 15
    },
    {
        "overlappingEventPairs": [
            {
                "event_id": "55555555-5555-5555-5555-555555555555",
                "event_name": "Event E",
                "start_date": "2023-01-15T09:00:00.000Z",
                "end_date": "2023-01-15T10:00:00.000Z"
            },
            {
                "event_id": "66666666-6666-6666-6666-666666666666",
                "event_name": "Event F",
                "start_date": "2023-01-15T09:45:00.000Z",
                "end_date": "2023-01-15T10:30:00.000Z"
            }
        ],
        "overlap_duration_minutes": 15
    }
]
```
Scenario 2: No Gap Found

```bash
GET /api/insights/temporal-gaps?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T00:00:00Z
```
Curl command:
```bash
curl -X GET http://localhost:3000/api/insights/temporal-gaps?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T00:00:00Z
```
Response (200 OK NO GAP FOUND):
```json
{
  "largestGap": null,
  "message": "No significant temporal gaps found within the specified range, or too few events."
}
```
### The "Event Influence Spreader"

Description : : Calculates the shortest temporal path (minimum total duration) between a source and a target event, following parent-child relationships.

Scenario 1: Path Found

```bash
GET /api/insights/event-influence-spreader?sourceEventId=11111111-1111-1111-1111-111111111111&targetEventId=33333333-3333-3333-3333-333333333333
```
Curl command:
```bash
curl -X GET http://localhost:3000/api/insights/event-influence-spreader?sourceEventId=11111111-1111-1111-1111-111111111111&targetEventId=33333333-3333-3333-3333-333333333333
```
Response (200 OK PATH FOUND):
```json
{
    "sourceEventId": "11111111-1111-1111-1111-111111111111",
    "targetEventId": "33333333-3333-3333-3333-333333333333",
    "shortestPath": [
        {
            "event_id": "11111111-1111-1111-1111-111111111111",
            "event_name": "Event A",
            "duration_minutes": 60
        },
        {
            "event_id": "22222222-2222-2222-2222-222222222222",
            "event_name": "Event B",
            "duration_minutes": 45
        },
        {
            "event_id": "33333333-3333-3333-3333-333333333333",
            "event_name": "Event C",
            "duration_minutes": 30
        }
    ],
    "totalDurationMinutes": 135,
    "message": "Shortest temporal path found from source to target event."
}
```
Scenario 2: Path Not Found
```bash
GET /api/insights/event-influence-spreader?sourceEventId=33333333-3333-3333-3333-333333333333&targetEventId=11111111-1111-1111-1111-111111111111
```

Curl command:
```bash
curl -X GET http://localhost:3000/api/insights/event-influence-spreader?sourceEventId=33333333-3333-3333-3333-333333333333&targetEventId=11111111-1111-1111-1111-111111111111
```
Response (200 OK PATH NOT FOUND):
```json
{
    "sourceEventId": "33333333-3333-3333-3333-333333333333",
    "targetEventId": "11111111-1111-1111-1111-111111111111",
    "shortestPath": [],
    "totalDurationMinutes": 0,
    "message": "No temporal path found from source to target event."
}
```
## Design Choices

### Overall Design:
- Layered architecture:  routes → controllers → services → models → DB
- Clear separation of concerns
- Scalable and maintainable code

### 1. Event Ingestion

- Line-by-line parsing: So one bad line doesn't crash the entire job
- Validation: To ensure we don't insert invalid data
- Async processing: So we don't block the main thread

### 2. Get Timeline -  Recursive Timeline Fetch

- Recursive strategy: Followed recursive approach to fetch children events

### 3. Overlapping events 

- Filter by data - Only data specified in the given range is considered

### 4. Flexible Event search

- Dynamic SQL generation: Based on optional filters
- Pagination & offset support
- Case-insensitive partial matching: LIKE %name% with LOWER()

### 5. Gap finder

- Sorting strategy - Events are sorted by start_date for a linear comparison
- Edge case handling - If no events or too few events are found in the given range, returns appropriate message

### 6. Event Influence Spreader

- BFS strategy - Followed Breadth First Search approach to find the shortest path between source and target event



