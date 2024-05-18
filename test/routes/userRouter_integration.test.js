const request = require('supertest');
const app = require('../../app');
const userSchema = require('../../app/models/user');
const { predictCreditScore } = require('../../app/helpers/creditScoreHelper');
const {validateToken} = require('../../app/middlewares/validateToken');

  jest.mock('../../app/helpers/creditScoreHelper', () => ({
    predictCreditScore: jest.fn().mockReturnValue({
      creditScore: 950,
      fraudSituation: 'FRAUD',
    }),
  }));

  jest.mock('../../app/middlewares/validateToken', () => ({
    validateToken: jest.fn()
  }));

describe('Integration test /users POST', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
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
      });
      userSchema.findOneAndUpdate = jest.fn().mockResolvedValue({
        _id: '507f191e810c19729de860eb',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        approved: 'APPROVED'
      })
  });

  describe('Validations', () => {
  
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

    it("Should fail because picture is null", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('picture field is empty.'))
    );

    it("Should fail because picture is not a string", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          picture: 12313
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('picture field is not a string.'))
    );

    it("Should fail because immovables is empty", () =>
      request(app)
        .post('/users')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: "12313",
          picture: 'picture'
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
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
          picture: 'picture',
          immovables: '1-2',
          monthlyIncome: '>1000',
          employmentSituation: 'employee',
          hasTesla: 'u'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('hasTesla should be one of these values: no, yes'))
    );

        
  })
    it("Should success creating a user", async () => {
      const userData = {  
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        picture: 'picture',
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
        picture: 'picture',
        immovables: '>2',
        monthlyIncome: '>1000',
        employmentSituation: 'employee',
        hasTesla: 'yes'
      };
      predictCreditScore.mockReturnValue({creditScore: 950, fraudSituation: 'FRAUD'}); 
      const saveMock = jest.fn().mockResolvedValue(createdUser);
      jest.spyOn(userSchema.prototype, 'save').mockImplementation(saveMock);
      return await request(app)
        .post('/users')
        .send(userData)
        .expect(201)
        .then(response => expect(response.body.firstName).toMatch('John'))
    });
});

describe('Integration tests /users/unapproved GET', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    // const verify = jest.spyOn(jwt, 'verify');
    // verify.mockReturnValue(({ verified: 'true' }));
});
 
  it.only("Should success retrieving users", async () => {
    validateToken.mockReturnValue(true)
    // verify.mockReturnValue(({ verified: 'true' }));
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
    return await request(app)
        .get('/users/unapproved')
        .set({'Authorization': 'Token 1234567890'})
        .send()
        .expect(200)
        .then(response => expect(response.body[0].firstName).toMatch('John'))}
    );

  it("Should success searching one user", async () =>
    request(app)
      .get('/users/1')
      .set('Authorization', 'Token 1234567890')
      .send()
      .expect(200)
      .then(response => expect(response.body.firstName).toMatch('John'))
  );
})

describe('Integration tests /users PUT', () => {
  it("Should fail because approved is empty", () =>
    request(app)
      .put('/users/11111')
      .send({})
      .expect(400)
      .then(response => expect(response.body.message).toMatch('approved field is empty.'))
  );
  it("Should fail because approved has not a valid type", () =>
    request(app)
      .put('/users/11111')
      .send({
        approved: 'aasdas'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch('approved field is not a boolean.'))
  );

  it("Should success updating an user", async () =>  {
    jest.spyOn(userSchema, 'findOneAndUpdate').mockResolvedValue(null);
    return await request(app)
        .put('/users/11111')
        .send({
          approved: true
        })
        .expect(404)
        .then(response => expect(response.body.message).toMatch('User not found'));
  });

  it("Should success updating an user", async () =>  {
    const updateMock = jest.fn().mockResolvedValue({_id: '507f191e810c19729de860ea',
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: 'password123'});
    jest.spyOn(userSchema, 'findOneAndUpdate').mockImplementation(updateMock);
    return await request(app)
        .put('/users/11111')
        .send({
          approved: true
        })
        .expect(200)
        .then(response => expect(response.body.firstName).toMatch('John'));
  });
})

describe('Integration test /users/employee POST', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    userSchema.findOne = jest.fn().mockResolvedValue({  
      _id: '507f191e810c19729de860eb',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    });
});

describe('Validations', () => {

  it("Should fail because users array is not an array", () =>
    request(app)
        .post('/users/employee')
        .send({  
          users: {
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
          }
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('users field is not an array.'))
  );
  it("Should fail because users array is null", () =>
    request(app)
        .post('/users/employee')
        .send({})
        .expect(400)
        .then(response => expect(response.body.message).toMatch('users field is empty.'))
  );

  it("Should fail because email is null", () =>
    request(app)
        .post('/users/employee')
        .send({  
          users: [{
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
          }]
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('email field is empty.'))
  );
  
  it("Should fail because email is not a string", () =>
    request(app)
        .post('/users/employee')
        .send({ 
          users: [{
            firstName: 'John',
            lastName: 'Doe',
            email: 12123,
            password: 'password123'
          }] 
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('email field is not a string.'))
  );

  it("Should fail because email is not an email", () =>
    request(app)
        .post('/users/employee')
        .send({ 
          users: [{
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe',
            password: 'password123'
          }] 
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('email field is not an email.'))
  );

  it("Should fail because firstName is null", () =>
    request(app)
        .post('/users/employee')
        .send({
          users: [{  
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123'
        }]})
        .expect(400)
        .then(response => expect(response.body.message).toMatch('firstName field is empty.'))
  );

  it("Should fail because firstName is not a string", () =>
    request(app)
        .post('/users/employee')
        .send({ 
          users: [{
            firstName: 1212,
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123'
        }]})
        .expect(400)
        .then(response => expect(response.body.message).toMatch('firstName field is not a string.'))
  );

  it("Should fail because lastName is null", () =>
    request(app)
        .post('/users/employee')
        .send({ 
          users: [{
            firstName: 'John',
            email: 'johndoe@example.com',
            password: 'password123'
          }] 
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('lastName field is empty.'))
  );

  it("Should fail because lastName is not a string", () =>
    request(app)
      .post('/users/employee')
      .send({  
        users: [{
          firstName: 'John',
          lastName: 1212,
          email: 'johndoe@example.com',
          password: 'password123'
        }]
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch('lastName field is not a string.'))
  );

  it("Should fail because password is null", () =>
    request(app)
      .post('/users/employee')
      .send({  
        users: [{
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com'
        }]
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch('password field is empty.'))
  );

  it("Should fail because password is not a string", () =>
    request(app)
      .post('/users/employee')
      .send({  
        users: [{
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: 12313
        }]
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch('password field is not a string.'))
    );

})
  it("Should success creating a user", async () => {
    const userData = {
      users: [{  
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
      }]
    };
    const createdUser = {  
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      picture: 'picture',
      immovables: '>2',
      monthlyIncome: '>1000',
      employmentSituation: 'employee',
      hasTesla: 'yes'
    };
    const saveMock = jest.fn().mockResolvedValue(createdUser);
    jest.spyOn(userSchema.prototype, 'save').mockImplementation(saveMock);
    return await request(app)
      .post('/users/employee')
      .send(userData)
      .expect(201)
      .then(response => expect(response.body[0].email).toMatch('johndoe@example.com'))
  });
});


describe('Integration test /users/employee/login POST', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    userSchema.findOne = jest.fn().mockResolvedValue({  
      _id: '507f191e810c19729de860eb',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    });
});

describe('Validations', () => {

  it("Should fail because email is null", () =>
    request(app)
        .post('/users/employee/login')
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
        .post('/users/employee/login')
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
        .post('/users/employee/login')
        .send({  
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe',
          password: 'password123'
        })
        .expect(400)
        .then(response => expect(response.body.message).toMatch('email field is not an email.'))
  );

  it("Should fail because password is null", () =>
    request(app)
      .post('/users/employee/login')
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
      .post('/users/employee/login')
      .send({  
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 12313
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch('password field is not a string.'))
    );

})
  it("Should success creating a user", async () => {
    const userData = { 
      email: 'johndoe@example.com',
      password: 'password123'
    };
    const createdUser = {  
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      picture: 'picture',
      immovables: '>2',
      monthlyIncome: '>1000',
      employmentSituation: 'employee',
      hasTesla: 'yes'
    };
    const saveMock = jest.fn().mockResolvedValue(createdUser);
    jest.spyOn(userSchema.prototype, 'save').mockImplementation(saveMock);
    return await request(app)
      .post('/users/employee/login')
      .send(userData)
      .expect(201)
      .then(response => expect(response.body.email).toMatch('johndoe@example.com'))
  });
});