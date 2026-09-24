-- ===================================================================
-- FIX: demote wrongly self-promoted admins (Phase 0 security)
-- Background: useAuth auto-created every new profile with role='admin'.
-- Run in Dashboard > SQL Editor AFTER fixing the code.
--
-- STEPS:
-- 1) Run the SELECT below, review the list.
-- 2) Put YOUR admin email in place of admin@deta.sd (keep the quotes).
-- 3) Run the whole file. Everyone else becomes 'user'.
-- Idempotent: safe to re-run.
-- ===================================================================

-- 1) Review current admins BEFORE changing anything
SELECT id, email, full_name, role, created_at
FROM profiles
WHERE role = 'admin'
ORDER BY created_at;

-- 2) Keep exactly one admin, demote the rest
-- >>> CHANGE THIS EMAIL TO YOURS BEFORE RUNNING <<<
UPDATE profiles
SET role = 'user', updated_at = NOW()
WHERE role = 'admin'
  AND email <> 'admin@deta.sd';

-- 3) Verify: exactly one admin must remain
SELECT id, email, full_name, role
FROM profiles
WHERE role = 'admin';

SELECT 'admin roles fixed' AS status;
