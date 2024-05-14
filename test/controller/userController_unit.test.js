const userController = require('../../app/controllers/userController');
const { predictCreditScore } = require('../../app/helpers/creditScoreHelper');
const userSchema = require('../../app/models/user');

  jest.mock('../../app/helpers/creditScoreHelper', () => ({
    predictCreditScore: jest.fn().mockReturnValue({
      creditScore: 950,
      fraudSituation: 'FRAUD',
    }),
  }));

describe('User Controller', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    userSchema.find = jest.fn().mockResolvedValue([
      {  
        _id: '507f191e810c19729de860ea',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
    },
    {  
        _id: '507f191e810c19729de860eb',
        firstName: 'John2',
        lastName: 'Doe2',
        email: 'johndoe2@example.com',
        password: 'password2123'
    }
    ]);
    userSchema.findOne = jest.fn().mockResolvedValue({  
      _id: '507f191e810c19729de860eb',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123'
  })
  });

  it('should create a new user', async () => {
    const userData = { 
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        immovables: '>2',
        monthlyIncome: '>1000',
        employmentSituation: 'employee',
        hasTesla: 'yes',
        creditScore: 950,
        fraudSituation: 'FRAUD'
    };
    const createdUser = { 
        _id: 1, 
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        immovables: '>2',
        monthlyIncome: '>1000',
        employmentSituation: 'employee',
        hasTesla: 'yes',
        creditScore: 950,
        fraudSituation: 'FRAUD'
    };
    predictCreditScore.mockReturnValue({creditScore: 950, fraudSituation: 'FRAUD'}); 
    const req = { body: userData };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const saveMock = jest.fn().mockResolvedValue(createdUser);
    jest.spyOn(userSchema.prototype, 'save').mockImplementation(saveMock);

    await userController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should handle create user error and return 500', async () => {
    const userData = {  
        name: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
    };
    predictCreditScore.mockImplementationOnce(() => Promise.resolve({creditScore: 950, fraudSituation: 'TRUSTWORTHY'}));
    const saveMock = jest.fn().mockRejectedValue({});
    jest.spyOn(userSchema.prototype, 'save').mockImplementation(saveMock);

    const req = { body: userData };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });


  it('should get all users', async () => {
    const users = [
        {  
            _id: '507f191e810c19729de860ea',
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123'
        },
        {  
            _id: '507f191e810c19729de860eb',
            firstName: 'John2',
            lastName: 'Doe2',
            email: 'johndoe2@example.com',
            password: 'password2123'
        }
    ];

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle get users error and return 500', async () => {
    userSchema.find = jest.fn().mockImplementationOnce(() => Promise.reject({message: "error"}))
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should get a user by ID', async () => {
    const req = { params: { userId: '507f191e810c19729de860eb' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle get user by ID error and return 500', async () => {
    userSchema.findOne = jest.fn().mockImplementationOnce(() => Promise.reject({message: "error"}))

    const req = { params: { userId: '507f191e810c19729de860eb' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});