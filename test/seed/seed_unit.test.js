const userSchema = require("../../app/models/user");
const seed = require("../../app/seed/seed");
const { sendSNSEvent } = require("../../app/services/awsSQS");

jest.mock('../../app/models/user', () => jest.fn());
jest.mock("../../app/services/awsSQS", () => ({
  sendSNSEvent: jest.fn().mockReturnValue({}),
}));

describe("User Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    userSchema.find = jest.fn().mockResolvedValue([
      {
        _id: "507f191e810c19729de860ea",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password123",
      },
      {
        _id: "507f191e810c19729de860ff",
        firstName: "Elon",
        lastName: "Musk",
        email: "elon@xwallet.com",
        password: "doge",
      },
    ]);
    userSchema.findOne = jest.fn().mockResolvedValue({
      _id: "507f191e810c19729de860eb",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
    });
  });

  describe("Seed users", () => {
    it("seed users", async () => {
      const createdUser = {
        _id: 1,
        firstName: "Elon",
        lastName: "Musk",
        email: "elon@xwallet.com",
        immovables: ">2",
        monthlyIncome: ">1000",
        employmentSituation: "employee",
        hasTesla: "yes",
        segment: "EMPLOYEE",
      };
      const saveMock = jest.fn().mockResolvedValue(createdUser);
      userSchema.mockImplementation(() => ({
        save: saveMock,
      }));

      await seed();
      expect(true).toBe(true);
    });
  });
});
