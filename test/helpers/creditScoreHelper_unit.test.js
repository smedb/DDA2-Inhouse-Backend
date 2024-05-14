const { execSync } = require('child_process');
const { mapUserQuestionsToMLModel, predictCreditScore, calculateFraudSituation } = require('../../app/helpers/creditScoreHelper');
const { objectToSnakeCase, isBetweenRange } = require('../../app/helpers/utils');

jest.mock('../../app/helpers/utils', () => ({
  objectToSnakeCase: jest.fn(),
  isBetweenRange: jest.fn()
}));
jest.mock("child_process", () => ({
  execSync: jest.fn()
}));

describe('CreditScoreHelper tests', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('should parse data correctly', async () => {
      const userData = {
        immovables: '1-2',
        monthly_income: '<500',
        employment_situation: 'employee',
        has_tesla: 'no'
    };
      const mappedData = {
        'immovables_0': 0,
        'immovables_1-2': 1,
        'immovables_>2': 0,
        'monthly_income_<500': 1,
        'monthly_income_<1000': 0,
        'monthly_income_>1000': 0,
        'employment_situation_employee': 1,
        'employment_situation_self-employed': 0,
        'employment_situation_unemployed': 0,
        'has_tesla_no': 1,
        'has_tesla_yes': 0
      }
      const result = mapUserQuestionsToMLModel(userData);
      expect(result).toMatchObject(mappedData);
    });

    // it('should predict credit score correctly', async () => {
    //   const userData = { 
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'johndoe@example.com',
    //     password: 'password123',
    //     immovables: '>2',
    //     monthlyIncome: '>1000',
    //     employmentSituation: 'employee',
    //     hasTesla: 'yes'
    //   };
    //   objectToSnakeCase.mockReturnValue({
    //     immovables: '1-2',
    //     monthly_income: '<500',
    //     employment_situation: 'employee',
    //     has_tesla: 'no'
    //   });
    //   isBetweenRange.mockReturnValue(true);
    //   execSync.mockReturnValue("950")

    //   const result = predictCreditScore(userData);
    //   expect(result).toMatchObject({creditScore: 950, fraudSituation: 'TRUSTWORTHY'});

    // });

    it('should parse data correctly', async () => {
      isBetweenRange.mockReturnValue(true);
      const result = calculateFraudSituation(950);
      expect(result).toMatch('TRUSTWORTHY');
    });
})