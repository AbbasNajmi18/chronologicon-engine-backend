IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'chronologicon')
BEGIN
    CREATE DATABASE chronologicon;
END
GO

USE chronologicon;
GO

IF OBJECT_ID('historical_events', 'U') IS NOT NULL
    DROP TABLE historical_events;
GO

CREATE TABLE historical_events (
    event_id UNIQUEIDENTIFIER PRIMARY KEY,
    event_name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NULL,
    start_date DATETIME2 NOT NULL,
    end_date DATETIME2 NOT NULL,
    duration_minutes AS DATEDIFF(MINUTE, start_date, end_date) PERSISTED,
    parent_event_id UNIQUEIDENTIFIER NULL,
    metadata NVARCHAR(MAX) NULL,
    CONSTRAINT FK_ParentEvent FOREIGN KEY (parent_event_id) REFERENCES historical_events(event_id)
);
GO

CREATE INDEX idx_start_date ON historical_events(start_date);
CREATE INDEX idx_end_date ON historical_events(end_date);
GO
