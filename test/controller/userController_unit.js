const mockingoose = require('mockingoose');

const userController = require('../../app/controllers/userController');
const userSchema = require('../../app/models/user');

describe('User Controller', () => {
  it('should create a new user', async () => {
    const userData = { 
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
    };
    const createdUser = { 
        _id: 1, 
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
    };
    mockingoose(userSchema).toReturn(createdUser, 'save');
    const req = { body: userData };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
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
    mockingoose(userSchema).toReturn({}, 'save');

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
    mockingoose(userSchema).toReturn(users, 'find');

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle get users error and return 500', async () => {
    mockingoose(userSchema).toReturn(new Error, 'find');

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should get a user by ID', async () => {
    const userId = '507f191e810c19729de860ea';
    const userById = {  
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
    };
    mockingoose(userSchema).toReturn(userById, 'findOne');

    const req = { params: { userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle get user by ID error and return 500', async () => {
    const userId = 'mockUserId';
    mockingoose(userSchema).toReturn(new Error, 'findOne');

    const req = { params: { userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userController.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
