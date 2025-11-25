
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUsers() {
  console.log('Creating Admin and Kitchen users...');

  // 1. Create Admin User
  const adminEmail = 'admin@saitamasushi.be';
  const adminPassword = 'adminpassword123'; // Change this!
  
  const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { role: 'admin', username: 'admin' }
  });

  if (adminError) {
    console.log(`Admin user might already exist or error: ${adminError.message}`);
  } else {
    console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}`);
  }

  // 2. Create Kitchen User
  const kitchenEmail = 'kitchen@saitamasushi.be';
  const kitchenPassword = 'kitchenpassword123'; // Change this!

  const { data: kitchenData, error: kitchenError } = await supabase.auth.admin.createUser({
    email: kitchenEmail,
    password: kitchenPassword,
    email_confirm: true,
    user_metadata: { role: 'kitchen', username: 'keuken' }
  });

  if (kitchenError) {
    console.log(`Kitchen user might already exist or error: ${kitchenError.message}`);
  } else {
    console.log(`✅ Kitchen user created: ${kitchenEmail} / ${kitchenPassword}`);
  }
}

createUsers();
