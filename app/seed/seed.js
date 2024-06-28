
const logger = require('../../logger');
const { adminVips } = require('../seed/vips');
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');
const { sendSNSEvent } = require('../services/awsSQS');
const { AWS_CREATE_USER_EMPLOYEE_SQS_MESSAGE } = require('../helpers/constants');

const createVips = async () => {
    adminVips.forEach(async vip => {

        const exists = await userSchema.find({ email: vip.email });
        if (exists.length > 0) {
            logger.info(`VIP ${vip.email} already exists`);
            return;
        }

        const user = userSchema({
            ...vip,
            password: await bcrypt.hash(vip.password, 10),
        });
        await user.save();

        await sendSNSEvent(
            {
                email: vip.email,
                firstName: vip.firstName,
                lastName: vip.lastName,
                gender: vip.gender,
                birthDate: vip.birthDate,
                monthlySalary: vip.monthlySalary,
                department: vip.department
            },
            AWS_CREATE_USER_EMPLOYEE_SQS_MESSAGE
        );
        logger.info(`VIP ${vip.email} created`);
    });
}

const seed = async () => {
    await createVips();
}

module.exports = seed;