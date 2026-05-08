const User = require('../models/User');
const Role = require('../models/Role');

class UserRepository {
  findByEmail(email) {
    return User.findOne({ where: { email }, include: [{ model: Role, as: 'role' }] });
  }

  findById(id) {
    return User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
  }

  create({ name, email, password, role_id }) {
    return User.create({ name, email, password, role_id });
  }

  findAll() {
    return User.findAll({ include: [{ model: Role, as: 'role' }] });
  }
}

module.exports = new UserRepository();
