const request = require('supertest');
const express = require('express');
const { logRouter } = require('../../app/routes/logReader'); // Adjust the path as necessary
const fs = require('fs');
const path = require('path');

// Mock the fs module
jest.mock('fs');

const app = express();
app.use('/', logRouter);

describe('GET /', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the contents of the log file', async () => {
    const mockLogData = 'Log file content';
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, mockLogData);
    });

    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.text).toBe(`<pre>${mockLogData}</pre>`);
  });

  it('should return a 500 error if the log file cannot be read', async () => {
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(new Error('File read error'));
    });

    const response = await request(app).get('/');
    
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error reading log file');
  });
});
