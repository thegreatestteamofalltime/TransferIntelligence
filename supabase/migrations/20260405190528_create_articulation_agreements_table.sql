/*
  # Create articulation_agreements table

  ## Summary
  Creates a table to store articulation (transfer) agreement metadata for reference
  across the TransferIntelligence platform.

  ## New Tables

  ### articulation_agreements
  Stores structured metadata for each transfer agreement between institutions.

  Columns:
  - `id` (text, primary key) — Unique slug identifier (e.g., "vccs-vsu-gaa-2023")
  - `title` (text) — Full agreement title
  - `type` (text) — Agreement type: "GAA" or "program-specific"
  - `source_system` (text) — Name of the source college system (e.g., VCCS)
  - `source_institutions` (text[]) — Array of specific source institutions covered
  - `target_institution` (text) — Full name of receiving 4-year institution
  - `target_institution_abbreviation` (text) — Short abbreviation (e.g., "VSU")
  - `last_updated` (text) — Human-readable date string (e.g., "March 28, 2023")
  - `effective_date` (date) — Machine-readable effective date
  - `status` (text) — One of: "current", "pending-review", "outdated"
  - `minimum_gpa` (numeric) — Minimum cumulative GPA required for guaranteed admission
  - `minimum_credits_at_source` (integer) — Minimum credits earned at source institution
  - `maximum_transfer_credits` (integer) — Maximum credits that may transfer
  - `testing_required` (boolean) — Whether standardized testing is required
  - `applicable_degrees` (text[]) — Qualifying degree types
  - `course_grade_minimum` (text) — Minimum grade for a course to transfer (e.g., "C")
  - `application_deadlines` (jsonb) — Array of { term, deadline } objects
  - `key_benefits` (text[]) — Array of notable student benefits
  - `sections` (jsonb) — Array of { id, title, summary } section objects
  - `pdf_path` (text) — Path or URL to the official PDF document
  - `created_at` (timestamptz) — Row creation timestamp
  - `updated_at` (timestamptz) — Row last updated timestamp

  ## Security
  - RLS enabled
  - Public read access (agreement data is informational and public-facing)
  - No write access for non-authenticated users

  ## Notes
  1. The table is read-only for anonymous users — agreements are managed by administrators
  2. The `last_updated` field is a human-readable string matching what's shown in the PDF
  3. `sections` and `application_deadlines` use JSONB for flexible schema evolution
*/

CREATE TABLE IF NOT EXISTS articulation_agreements (
  id text PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'GAA',
  source_system text NOT NULL,
  source_institutions text[] NOT NULL DEFAULT '{}',
  target_institution text NOT NULL,
  target_institution_abbreviation text NOT NULL,
  last_updated text NOT NULL,
  effective_date date NOT NULL,
  status text NOT NULL DEFAULT 'current',
  minimum_gpa numeric NOT NULL DEFAULT 2.0,
  minimum_credits_at_source integer NOT NULL DEFAULT 30,
  maximum_transfer_credits integer NOT NULL DEFAULT 90,
  testing_required boolean NOT NULL DEFAULT false,
  applicable_degrees text[] NOT NULL DEFAULT '{}',
  course_grade_minimum text NOT NULL DEFAULT 'C',
  application_deadlines jsonb NOT NULL DEFAULT '[]',
  key_benefits text[] NOT NULL DEFAULT '{}',
  sections jsonb NOT NULL DEFAULT '[]',
  pdf_path text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE articulation_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read articulation agreements"
  ON articulation_agreements FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO articulation_agreements (
  id,
  title,
  type,
  source_system,
  source_institutions,
  target_institution,
  target_institution_abbreviation,
  last_updated,
  effective_date,
  status,
  minimum_gpa,
  minimum_credits_at_source,
  maximum_transfer_credits,
  testing_required,
  applicable_degrees,
  course_grade_minimum,
  application_deadlines,
  key_benefits,
  sections,
  pdf_path
) VALUES (
  'vccs-vsu-gaa-2023',
  'Transfer Agreement with Guaranteed Admission',
  'GAA',
  'Virginia Community College System (VCCS)',
  ARRAY[
    'Brightpoint Community College',
    'Northern Virginia Community College (NOVA)',
    'All VCCS Member Colleges'
  ],
  'Virginia State University',
  'VSU',
  'March 28, 2023',
  '2023-03-28',
  'current',
  2.0,
  30,
  90,
  false,
  ARRAY[
    'Associate of Arts (AA)',
    'Associate of Science (AS)',
    'Associate of Arts & Sciences (AA&S)'
  ],
  'C',
  '[
    {"term": "Fall", "deadline": "June 1"},
    {"term": "Spring", "deadline": "December 1"}
  ]'::jsonb,
  ARRAY[
    'Guaranteed admission to VSU upon meeting requirements',
    'Completion of an AA, AS, or AA&S transfer degree satisfies ALL lower-division general education requirements at VSU',
    'No standardized testing requirements',
    'Up to 90 credits transferable',
    'Applies to students earning an associate degree concurrently with a high school diploma (dual enrollment)',
    'Students with CLEP, IB, AP, or ACE/Joint Services credit are eligible',
    'VSU honors catalog requirements in effect at the time of first VCCS enrollment'
  ],
  '[
    {"id": "section-1", "title": "Definition of Guaranteed Admission Agreement (GAA)", "summary": "An agreement guaranteeing admission to VSU for students who earn a qualifying transfer associate degree and meet academic benchmarks. General admission under the GAA does not guarantee admission to a specific program."},
    {"id": "section-2", "title": "Requirements for Admission", "summary": "Students must earn a qualifying AA, AS, or AA&S degree with a minimum 2.0 GPA, complete at least 30 credits at the VCCS institution, earn a grade of C or higher in all transferring courses, and apply by the published deadlines (Fall: June 1 / Spring: December 1). No standardized testing is required. A maximum of 90 credits may transfer."},
    {"id": "section-3", "title": "Application of Associate Degree to General Education", "summary": "Completion of an AA, AS, or AA&S transfer degree satisfies all lower-division general education requirements at VSU. Additional courses may be required for any general education courses where a grade of D or F was earned."},
    {"id": "section-4", "title": "Dual Enrollment Students", "summary": "The GAA applies to students who earn an associate degree concurrently with a high school diploma through a dual enrollment program."},
    {"id": "section-5", "title": "Credit for Prior Learning", "summary": "Students who complete the associate degree using CLEP, IB, AP, or ACE/Joint Services credit are eligible for the GAA and receive its benefits upon transfer. Official transcripts must be sent to VSU."},
    {"id": "section-6", "title": "Catalog Determination", "summary": "VSU honors the catalog in effect at the time of the student''''s first post-high school enrollment at the VCCS institution. Students have up to four years from their first enrollment under continuous enrollment."},
    {"id": "section-7", "title": "Transfer Guide", "summary": "Major-specific transfer guides are developed and featured at the Transfer Virginia portal (transfervirginia.org). Students should check the Transfer Guidance section to understand whether university admission also guarantees program admission."},
    {"id": "section-8", "title": "Administration of Agreement", "summary": "Administered by the VSU Director of Transfer Student Services and the VCCS Senior Vice Chancellor for Academic and Workforce Programs. The agreement remains in effect until modified or terminated by either party with one year''''s written notice."},
    {"id": "section-9", "title": "Review Clause", "summary": "VSU and VCCS review this agreement and student tracking data every three years to maintain integrity and improve the transfer process. Changes are not applied retroactively."}
  ]'::jsonb,
  '/src/data/agreements/VSU.pdf'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  last_updated = EXCLUDED.last_updated,
  updated_at = now();
