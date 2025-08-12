const fetch = require('node:fetch');

async function testConversion() {
  try {
    console.log('Testing USD → COP conversion...');
    
    const response = await fetch('http://localhost:3000/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'USD',
        to: 'COP',
        amount: 100
      })
    });
    
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ SUCCESS: USD→COP conversion working!');
      console.log(`Rate: ${result.rate}, Source: ${result.source}, Amount converted: ${result.converted} COP`);
    } else {
      console.log('❌ FAILED: API returned error');
    }
    
  } catch (error) {
    console.error('❌ FAILED: Network or other error:', error.message);
  }
}

testConversion();
