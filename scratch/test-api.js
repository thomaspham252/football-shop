const http = require('http');

http.get('http://localhost:8080/api/product/1', (res) => {
  let data = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("Product Name:", json.productName);
      console.log("Variants Colors:");
      json.variants.forEach(v => {
        console.log(`- ID ${v.variantId}: ${v.color} (Hex: ${Buffer.from(v.color, 'utf8').toString('hex')})`);
      });
    } catch (e) {
      console.error("Error parsing JSON:", e.message);
      console.log("Raw Data:", data);
    }
  });
}).on('error', (err) => {
  console.error("Error:", err.message);
});
