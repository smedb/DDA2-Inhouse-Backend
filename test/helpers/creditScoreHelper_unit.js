const { mapUserQuestionsToMLModel } = require('../../app/helpers/creditScoreHelper')

describe('CreditScoreHelper tests', () => {
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
})