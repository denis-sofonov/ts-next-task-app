-- Create a separate database for the end-to-end test suite so it never touches
-- development data. Runs once when the Postgres data volume is first created.
CREATE DATABASE app_test;
