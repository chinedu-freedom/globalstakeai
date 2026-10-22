const https = require('https');

async function testWithdrawalFlow() {
    console.log("=== Starting Withdrawal Flow Test ===");
    
    // 1. Register a test user
    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: "Password123!",
        phoneNumber: `+1${Math.floor(Math.random() * 1000000000)}`,
        country: "US"
    };
    
    console.log(`\n[1] Registering test user: ${testUser.username}`);
    
    const regRes = await fetch(`${window.API_BASE || "https://api.blockvextrade.com"}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
    });
    
    const regData = await regRes.json();
    console.log("Registration Response:", regData.message || regData);
    
    // Get the auth cookie from response headers
    const cookies = regRes.headers.get('set-cookie');
    if (!cookies) {
        console.log("Failed to get authentication cookie. Exiting test.");
        return;
    }
    
    // 2. Fetch Dashboard Stats
    console.log("\n[2] Fetching initial dashboard stats to check Available Profit...");
    const statsRes = await fetch(`${window.API_BASE || "https://api.blockvextrade.com"}/api/users/dashboard-stats`, {
        headers: { 'Cookie': cookies }
    });
    const statsData = await statsRes.json();
    console.log("Dashboard Stats:", statsData.data);
    
    // 3. Attempt to withdraw $50 (Should Fail due to 0 earnings)
    console.log("\n[3] Attempting to withdraw $50 with $0 Available Profit...");
    const withdrawRes = await fetch(`${window.API_BASE || "https://api.blockvextrade.com"}/api/users/withdrawals`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Cookie': cookies
        },
        body: JSON.stringify({
            amount: 50,
            walletAddress: "bc1qtest12345",
            crypto: "BTC"
        })
    });
    
    const withdrawData = await withdrawRes.json();
    console.log("Withdrawal Attempt Response:");
    console.log("Success:", withdrawData.success);
    console.log("Message:", withdrawData.message);
    
    if (!withdrawData.success && withdrawData.message === "Insufficient available profit") {
        console.log("\n✅ TEST PASSED: The system successfully blocked the withdrawal because it strictly requires earnings (Available Profit)!");
    } else {
        console.log("\n❌ TEST FAILED: Unexpected response.");
    }
}

testWithdrawalFlow().catch(console.error);
