const { execSync } = require('child_process');
const { predictCreditScore, calculateFraudSituation } = require('../../app/helpers/creditScoreHelper');
const { objectToSnakeCase, isBetweenRange } = require('../../app/helpers/utils');
const { predictMLCreditScore } = require('../../app/services/predictCreditScore');

jest.mock('../../app/helpers/utils', () => ({
  objectToSnakeCase: jest.fn(),
  isBetweenRange: jest.fn()
}));
jest.mock('../../app/services/predictCreditScore', () => ({
  predictMLCreditScore: jest.fn()
}));

describe('CreditScoreHelper tests', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('should predict credit score correctly', async () => {
      const userData = { 
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        immovables: '>2',
        monthlyIncome: '>1000',
        employmentSituation: 'employee',
        hasTesla: 'yes'
      };
      objectToSnakeCase.mockReturnValue({
        immovables: '1-2',
        monthly_income: '<500',
        employment_situation: 'employee',
        has_tesla: 'no'
      });
      isBetweenRange.mockReturnValue(true);
      predictMLCreditScore.mockReturnValue(950);

      const result = predictCreditScore(userData);
      expect(result).toMatchObject({creditScore: 950, fraudSituation: 'TRUSTWORTHY'});

    });

    it('should parse data correctly', async () => {
      isBetweenRange.mockReturnValue(true);
      const result = calculateFraudSituation(950);
      expect(result).toMatch('TRUSTWORTHY');
    });
})