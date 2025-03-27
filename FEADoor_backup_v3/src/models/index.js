const User = require('./User');
const Internship = require('./Internship');

// Define as associações
User.hasMany(Internship);
Internship.belongsTo(User);

module.exports = {
    User,
    Internship
}; 