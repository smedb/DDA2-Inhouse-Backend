const request = require('supertest');
const mockingoose = require('mockingoose');
const app = require('../../app');
const userSchema = require('../../app/models/user');


userController = jest.mock('../../app/controllers/userController', () => ({
  create: jest.fn(),
  getUsers: jest.fn(),
  getUser: jest.fn(),
}));

describe('Integration test /users POST', () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("Should fail because email is null", () =>
      request(app)
          .post('/users')
          .send({  
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
          })
          .expect(400)
          .then(response => expect(response.body.message).toMatch('email field is empty.'))
    );
    
    it("Should fail because email is not a string", () =>
      request(app)
          .post('/users')
          .send({  
            firstName: 'John',
            lastName: 'Doe',
            email: 12123,
            password: 'password123'
          })
          .expect(400)
          .then(response => expect(response.body.message).toMatch('email field is not a string.'))
    );

    it("Should fail because email is not an email", () =>
      request(app)
          .post('/users')
          .send({  
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe',
            password: 'password123'
          })
          .expect(400)
          .then(response => expect(response.body.message).toMatch('email field is not an email.'))
    );

    it("Should fail because firstName is null", () =>
      request(app)
          .post('/users')
          .send({  
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123'
          })
          .expect(400)
          .then(response => expect(response.body.message).toMatch('firstName field is empty.'))
    );

    it("Should fail because firstName is not a string", () =>
      request(app)
          .post('/users')
          .send({  
            firstName: 1212,
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123'
          })
          .expect(400)
          .then(response => expect(response.body.message).toMatch('firstName field is not a string.'))
    );

    it("Should fail because lastName is null", () =>
      request(app)
          .post('/users')
          .send({  
            firstName: 'John',
            email: 'johndoe@example.com',
            password: 'password123'
          })
          .expect(400)
          .then(response => expect(response.body.message).toMatch('lastName field is empty.'))
    );

    it("Should fail because lastName is not a string", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 1212,
          email: 'johndoe@example.com',
          password: 'password123'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('lastName field is not a string.'))
    );

    it("Should fail because password is null", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('password field is empty.'))
    );

    it("Should fail because password is not a string", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: 12313
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('password field is not a string.'))
    );

    it("Should fail because immovables is empty", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313"
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('immovables field is empty.'))
    );

    it("Should fail because immovables is not a string", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: 1
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('immovables field is not a string.'))
    );

    it("Should fail because immovables has not a valid value", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '0-2'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('immovables should be one of these values: 0, 1-2, >2'))
    );

    it("Should fail because monthlyIncome is empty", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('monthlyIncome field is empty.'))
    );

    it("Should fail because monthlyIncome is not a string", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2',
          monthlyIncome: 123132
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('monthlyIncome field is not a string.'))
    );

    it("Should fail because monthlyIncome has not a valid value", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2',
          monthlyIncome: '>500'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('monthlyIncome should be one of these values: <500, <1000, >1000'))
    );


    it("Should fail because employmentSituation is empty", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2',
          monthlyIncome: '>1000'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('employmentSituation field is empty.'))
    );

    it("Should fail because employmentSituation is not a string", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2',
          monthlyIncome: '>1000',
          employmentSituation: 1
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('employmentSituation field is not a string.'))
    );

    it("Should fail because employmentSituation has not a valid value", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2',
          monthlyIncome: '>1000',
          employmentSituation: 'employed'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('employmentSituation should be one of these values: employee, self-employed, unemployed'))
    );

    it("Should fail because hasTesla is empty", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2',
          monthlyIncome: '>1000',
          employmentSituation: 'employee'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('hasTesla field is empty.'))
    );

    it("Should fail because hasTesla is not a string", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2',
          monthlyIncome: '>1000',
          employmentSituation: 'employee',
          hasTesla: 1
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('hasTesla field is not a string.'))
    );

    it("Should fail because hasTesla has not a valid value", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          immovables: '1-2',
          monthlyIncome: '>1000',
          employmentSituation: 'employee',
          hasTesla: 'u'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('hasTesla should be one of these values: no, yes'))
    );

    it("Should success creating a user", async () => {
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
      const createdUser = {  
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        immovables: '>2',
        monthlyIncome: '>1000',
        employmentSituation: 'employee',
        hasTesla: 'yes'
      };
      mockingoose(userSchema).toReturn(createdUser, 'save');
      return await request(app)
        .post('/users')
        .send(userData)
        .expect(201)
        .then(response => expect(response.body.firstName).toMatch('John'))
    });
});

describe('Integration tests /users GET', () => {

  it("Should success retrieving users", async () => {
    const users = [{  
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    },
    {  
      firstName: 'Maria',
      lastName: 'Doe',
      email: 'mariadoe@example.com',
      password: 'password123'
    },
  ];
    mockingoose(userSchema).toReturn(users, 'find');
    return await request(app)
      .get('/users')
      .send()
      .expect(200)
      .then(response => expect(response.body[0].firstName).toMatch('John'))
  });

  it("Should success searching one user", async () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    };
    mockingoose(userSchema).toReturn(user, 'findOne');
    return await request(app)
      .get('/users/1')
      .send()
      .expect(200)
      .then(response => expect(response.body.firstName).toMatch('John'))
  });
})