/**
 * Setup Admin User Script
 * 
 * This script sets the admin role for a user in Supabase.
 * Usage: node scripts/setup-admin.js <email>
 * 
 * Requirements:
 * - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment
 * - The user must already exist in Supabase
 */

const { createClient } = require('@supabase/supabase-js');

async function setupAdmin() {
  const email = process.argv[2] || 'vigneshazam2@gmail.com';
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
    console.error('Please set them before running this script:');
    console.error('  export SUPABASE_URL=your-project-url');
    console.error('  export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log(`🔧 Setting admin role for user: ${email}`);

  try {
    // Get the user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      process.exit(1);
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      console.error('Please create the user first via Supabase Dashboard or sign up through the app');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);
    console.log(`   Current app_metadata:`, user.user_metadata);

    // Update user metadata to add admin role
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'admin'
        }
      }
    );

    if (updateError) {
      console.error('❌ Error updating user:', updateError.message);
      process.exit(1);
    }

    console.log(`✅ Successfully set admin role for ${email}`);
    console.log(`   Updated app_metadata:`, updatedUser.user.user_metadata);
    console.log(`\n🎉 You can now log in to the admin panel at http://localhost:3001/admin/login`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

setupAdmin();
