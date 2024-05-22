const {
    camelToSnakeCase,
    objectToSnakeCase,
    isBetweenRange,
    getBinaryFromBase64Img
} = require('../../app/helpers/utils');

describe('Utils Helper tests', () => {

    it('should transform camel to snake case correctly', async () => {
      const result = camelToSnakeCase('userDataTest');
      expect(result).toMatch('user_data_test');
    });

    it('should transform object keys to snake case correctly', async () => {
        const userData = { 
            immovables: '>2',
            monthlyIncome: '>1000',
            employmentSituation: 'employee',
            hasTesla: 'yes'
          };
        const result = objectToSnakeCase(userData);
        expect(result).toMatchObject({
            immovables: '>2',
            monthly_income: '>1000',
            employment_situation: 'employee',
            has_tesla: 'yes'
        });
      });

    it('should return true when credit score is in range min limit', async () => {
        const result = isBetweenRange('0-450', 0);
        expect(result).toBe(true);
    });

    it('should return true when credit score is in range max limit', async () => {
        const result = isBetweenRange('0-450', 450);
        expect(result).toBe(true);
    });

    it('should return true when credit score is in range', async () => {
        const result = isBetweenRange('0-450', 300);
        expect(result).toBe(true);
    });

    it('should return false when credit score is not in range', async () => {
        const result = isBetweenRange('0-450', 900);
        expect(result).toBe(false);
    });

    it('should return true when credit score is in range no max', async () => {
        const result = isBetweenRange('901-', 950);
        expect(result).toBe(true);
    });
    
    it('should convert base64 picture to bytes', async () => {
        const result = getBinaryFromBase64Img('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC');
        expect(result).toBeInstanceOf(ArrayBuffer);
    });
});