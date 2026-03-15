import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function testMetadata() {
  try {
    const formData = new FormData();
    // Assuming there's a test.pdf in the directory or just using a dummy
    // But since I can't easily find a pdf, I'll just check if the endpoint exists
    
    console.log('Testing GET /forms/pdfengines/metadata...');
    const res1 = await fetch('http://127.0.0.1:3000/forms/pdfengines/metadata');
    console.log('GET Status:', res1.status);
    
    console.log('Testing POST /forms/pdfengines/metadata...');
    const res2 = await fetch('http://127.0.0.1:3000/forms/pdfengines/metadata', { method: 'POST' });
    console.log('POST (empty) Status:', res2.status);
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

testMetadata();
