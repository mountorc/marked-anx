#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './examples/demo-element.html';
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const port = 8080;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Demo element page: http://localhost:${port}/examples/demo-element.html`);
  
  // 自动打开浏览器
  try {
    const url = `http://localhost:${port}/examples/demo-element.html`;
    if (process.platform === 'win32') {
      execSync(`start ${url}`);
    } else if (process.platform === 'darwin') {
      execSync(`open ${url}`);
    } else {
      execSync(`xdg-open ${url}`);
    }
    console.log('Browser opened automatically');
  } catch (error) {
    console.log('Please open your browser and navigate to:', `http://localhost:${port}/examples/demo-element.html`);
  }
});

// 处理服务器关闭
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});