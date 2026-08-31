```markdown
# Database & Data Lake Schemas Document

### 1. In-Memory WebSockets Stream Schema (`Sub-4ms Payload`)
Emitted over `wss://localhost:8080` whenever MOSDAC drops a new 15-minute frame:

```json
{
  "$schema": "[http://json-schema.org/draft-07/schema#](http://json-schema.org/draft-07/schema#)",
  "title": "SatelliteRealtimeFrame",
  "type": "object",
  "properties": {
    "event": { "type": "string", "enum": ["NEW_SATELLITE_FRAME", "BUFFER_INIT"] },
    "latency_ms": { "type": "string" },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": { "type": "string", "format": "date-time" },
        "datasetId": { "type": "string" },
        "resolution_km": { "type": "number" },
        "channels": {
          "type": "object",
          "properties": {
            "TIR1_brightness_temp_kelvin": { "type": "array", "items": { "type": "number" } },
            "water_vapor": { "type": "array", "items": { "type": "number" } }
          }
        },
        "coordinates": {
          "type": "object",
          "properties": {
            "lat": { "type": "number" },
            "lon": { "type": "number" }
          }
        }
      }
    }
  }
}

2. S3 Data Lake Hive Partitioning Schema
Path: s3://cyclone-data-lake/curated/basin={basin}/year={year}/storm_id={storm_id}/processing_mode={processing_mode}/

SQL
-- Hive Metastore DDL for Parquet Data Storage
CREATE EXTERNAL TABLE IF NOT EXISTS cyclone_lake.satellite_model_predictions (
    record_timestamp TIMESTAMP,
    satellite_source STRING,
    vortex_center_lat DOUBLE,
    vortex_center_lon DOUBLE,
    estimated_msw_knots FLOAT,
    imd_category STRING,
    rapid_intensification_flag BOOLEAN,
    model_confidence_score FLOAT
)
PARTITIONED BY (
    basin STRING,
    year INT,
    storm_id STRING,
    processing_mode STRING -- 'realtime' or 'batch'
)
STORED AS PARQUET
LOCATION 's3://cyclone-data-lake/curated/'
TBLPROPERTIES ("parquet.compress"="SNAPPY");
3. PostgreSQL + PostGIS Spatial Schema
SQL
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE cyclone_tracks (
    id SERIAL PRIMARY KEY,
    storm_id VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processing_mode VARCHAR(20) CHECK (processing_mode IN ('realtime', 'batch')),
    wind_speed_knots NUMERIC(5,2),
    pressure_hpa NUMERIC(6,2),
    geom GEOMETRY(Point, 4326), -- Geographic spatial point
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cyclone_geom ON cyclone_tracks USING GIST(geom);