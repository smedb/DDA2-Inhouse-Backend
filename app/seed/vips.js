const {
    APPROVED_STATUS_APPROVED,
    USER_SEGMENT_EMPLOYEE,
} = require('../helpers/constants');

const adminVips = [{
    firstName: 'Elon',
    lastName: 'Musk',
    email: 'elon@xwallet.com',
    verified: 'VERIFIED',
    approved: APPROVED_STATUS_APPROVED,
    segment: USER_SEGMENT_EMPLOYEE,
    password: 'doge',
    monthlySalary: '1',
    department: 'CEO',
    state: 'USA',
    gender: 'M',
    birthDate: new Date(1971,5,28),
},{
    firstName: 'Jack',
    lastName: 'Dorsey',
    email: 'jackDorsey@xwallet.com',
    verified: 'VERIFIED',
    approved: APPROVED_STATUS_APPROVED,
    segment: USER_SEGMENT_EMPLOYEE,
    password: 'twitter',
    monthlySalary: '1',
    department: 'Twitter CEO',
    state: 'USA',
    gender: 'M',
    birthDate: new Date(1950,1,12),
}]

module.exports = {
    adminVips,
}