const http = require('http');

const data = JSON.stringify({
  language: 'cpp',
  code: '#include <iostream>\nint main() { std::cout << "Direct Mode Verified" << std::endl; return 0; }'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/runs',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${body}`);
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
