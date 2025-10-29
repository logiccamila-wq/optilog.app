-- ============================================
-- PERFORMANCE OPTIMIZATION - ADD MISSING INDEXES
-- ============================================
-- This script adds indexes to commonly queried columns to improve query performance

-- Trips table indexes (if table exists)
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_driver_name ON trips(driver_name);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_plate ON trips(vehicle_plate);
CREATE INDEX IF NOT EXISTS idx_trips_customer_name ON trips(customer_name);

-- Trip Events indexes
CREATE INDEX IF NOT EXISTS idx_trip_events_trip_id ON trip_events(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_events_date ON trip_events(event_date DESC);

-- Trip Expenses indexes  
CREATE INDEX IF NOT EXISTS idx_trip_expenses_trip_id ON trip_expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_expenses_date ON trip_expenses(expense_date DESC);

-- Trip Checklists indexes
CREATE INDEX IF NOT EXISTS idx_trip_checklists_trip_id ON trip_checklists(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_checklists_date ON trip_checklists(checklist_date DESC);

-- Trip Messages indexes
CREATE INDEX IF NOT EXISTS idx_trip_messages_trip_id ON trip_messages(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_messages_created_at ON trip_messages(created_at ASC);

-- GPS Tracking indexes
CREATE INDEX IF NOT EXISTS idx_gps_tracking_trip_id ON gps_tracking(trip_id);
CREATE INDEX IF NOT EXISTS idx_gps_tracking_timestamp ON gps_tracking(timestamp DESC);

-- Fiscal Documents indexes
CREATE INDEX IF NOT EXISTS idx_fiscal_docs_status ON fiscal_documents_summary(status);
CREATE INDEX IF NOT EXISTS idx_fiscal_docs_type ON fiscal_documents_summary(document_type);
CREATE INDEX IF NOT EXISTS idx_fiscal_docs_type_status ON fiscal_documents_summary(document_type, status);

-- Service Orders indexes
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_vehicle_id ON service_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_mechanic_id ON service_orders(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_created_at ON service_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_orders_composite ON service_orders(status, vehicle_id, mechanic_id);

-- Vehicle Alerts indexes (already exists in fleet management but adding if missing)
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_status ON vehicle_alerts(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_due_date ON vehicle_alerts(due_date);

-- Customers/Drivers indexes
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_drivers_name ON drivers(name);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);

-- CTEs indexes
CREATE INDEX IF NOT EXISTS idx_ctes_status ON ctes(status) WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ctes');
CREATE INDEX IF NOT EXISTS idx_ctes_issue_date ON ctes(issue_date DESC) WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ctes');

COMMENT ON INDEX idx_trips_status IS 'Optimizes filtering trips by status';
COMMENT ON INDEX idx_trips_created_at IS 'Optimizes ordering trips by creation date';
COMMENT ON INDEX idx_service_orders_composite IS 'Composite index for common multi-column filters';
