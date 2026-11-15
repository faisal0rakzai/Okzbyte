CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS support_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT NOT NULL UNIQUE,
  submission_key TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  country TEXT,
  phone TEXT,
  department TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  website TEXT,
  consent_at TIMESTAMPTZ NOT NULL,
  attachment_name TEXT,
  attachment_type TEXT,
  attachment_data BYTEA,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS support_inquiries_created_idx ON support_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS support_inquiries_department_idx ON support_inquiries(department);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  product_service TEXT,
  priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Low','Normal','High','Critical')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Assigned','In Progress','Waiting for Customer','Resolved','Closed')),
  assigned_to TEXT,
  attachment_name TEXT,
  attachment_type TEXT,
  attachment_data BYTEA,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS support_tickets_email_idx ON support_tickets(email);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON support_tickets(status);
CREATE INDEX IF NOT EXISTS support_tickets_created_idx ON support_tickets(created_at DESC);

CREATE TABLE IF NOT EXISTS support_ticket_events (
  id BIGSERIAL PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('status','customer_message','admin_reply','internal_note','assignment','priority')),
  body TEXT,
  old_value TEXT,
  new_value TEXT,
  administrator_email TEXT,
  visible_to_customer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS support_ticket_events_idx ON support_ticket_events(ticket_id, created_at);
REVOKE ALL ON support_inquiries, support_tickets, support_ticket_events FROM PUBLIC;
