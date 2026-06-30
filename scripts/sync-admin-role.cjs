// Syncs app_metadata.role='admin' for all users with user_role='admin' in public.users
// Reads credentials from process.env first, then falls back to .env.local if present.
const fs = require('fs');
const path = require('path');

function getEnvVar(key) {
  if (process.env[key]) return process.env[key];
  // Fallback: parse .env.local if it exists
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(new RegExp(`^${key}=(.+)$`, 'm'));
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }
  return null;
}

const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');
const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

(async () => {
  const { data: adminRows, error } = await admin
    .from('users')
    .select('id, email, user_role')
    .eq('user_role', 'admin');

  if (error) { console.error('Error reading users:', error.message); process.exit(1); }
  if (!adminRows?.length) { console.log('No admin rows in public.users'); return; }

  console.log(`Found ${adminRows.length} admin(s). Syncing app_metadata.role...`);

  for (const row of adminRows) {
    const { data, error: updErr } = await admin.auth.admin.updateUserById(row.id, {
      app_metadata: { role: 'admin' },
    });
    if (updErr) console.log(`  ✗ ${row.email}: ${updErr.message}`);
    else console.log(`  ✓ ${row.email}: app_metadata.role = ${JSON.stringify(data.user.app_metadata?.role)}`);
  }
})();
