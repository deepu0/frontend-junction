const fs = require('fs');
const path = require('path');
const env = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1]?.trim();
const url = get('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = get('SUPABASE_SERVICE_ROLE_KEY');

(async () => {
  const { createClient } = require('@supabase/supabase-js');
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Find all users whose public.users.user_role = 'admin', then sync app_metadata.role
  const { data: adminRows, error } = await admin
    .from('users')
    .select('id, email, user_role')
    .eq('user_role', 'admin');

  if (error) { console.log('Error reading users:', error.message); return; }
  if (!adminRows?.length) { console.log('No admin rows in public.users'); return; }

  console.log(`Found ${adminRows.length} admin(s) in public.users. Syncing app_metadata.role...`);

  for (const row of adminRows) {
    const { data, error: updErr } = await admin.auth.admin.updateUserById(row.id, {
      app_metadata: { role: 'admin' },
    });
    if (updErr) console.log(`  ✗ ${row.email}: ${updErr.message}`);
    else console.log(`  ✓ ${row.email}: app_metadata.role = ${JSON.stringify(data.user.app_metadata?.role)}`);
  }
})();
