const request = require('supertest');
const app = require('../../app');

describe('Integration test /health_check GET', () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("Should respond hello world", () =>
      request(app)
          .get('/health_check')
          .send()
          .expect(200)
          .then(response => expect(response.text).toBe('Hello World!'))
    );
});