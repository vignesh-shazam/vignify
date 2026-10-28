/**
 * Test Admin Login Script
 * 
 * This script tests if the given credentials can log in to the admin panel.
 * Usage: node scripts/test-admin-login.js <email> <password>
 */

const { createClient } = require('@supabase/supabase-js');

async function testLogin() {
  const email = process.argv[2] || 'vigneshazam2@gmail.com';
  const password = process.argv[3] || 'Vignesh@123';
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables are required');
    console.error('Please set them before running this script:');
    console.error('  export NEXT_PUBLIC_SUPABASE_URL=your-project-url');
    console.error('  export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`🔐 Testing login for: ${email}`);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('\nPlease check:');
      console.error('  1. Email and password are correct');
      console.error('  2. User exists in Supabase');
      console.error('  3. User is confirmed (not pending email verification)');
      process.exit(1);
    }

    console.log(`✅ Login successful!`);
    console.log(`   User ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);
    console.log(`   app_metadata:`, data.user.app_metadata);
    console.log(`   user_metadata:`, data.user.user_metadata);

    // Check if user has admin role
    if (data.user.app_metadata?.role === 'admin') {
      console.log(`\n🎉 User has admin role! Access to admin panel is granted.`);
    } else {
      console.log(`\n⚠️  User does NOT have admin role in app_metadata`);
      console.log(`   Current role: ${data.user.app_metadata?.role || 'not set'}`);
      console.log(`\nTo grant admin access, you need to set app_metadata.role = "admin"`);
      console.log(`This can be done via:`);
      console.log(`  1. Supabase Dashboard: Authentication > Users > Edit user > app_metadata`);
      console.log(`  2. Using the setup-admin.js script with SERVICE_ROLE_KEY`);
    }

    // Sign out
    await supabase.auth.signOut();
    console.log(`\n✅ Test completed and signed out`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

testLogin();
