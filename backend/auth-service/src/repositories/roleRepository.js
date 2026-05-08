const Role = require('../models/Role');

class RoleRepository {
  findByName(name) {
    return Role.findOne({ where: { name } });
  }

  create(name) {
    return Role.create({ name });
  }

  async ensureDefaults() {
    const defaults = ['ADMIN', 'USER'];
    for (const name of defaults) {
      const found = await this.findByName(name);
      if (!found) await this.create(name);
    }
  }
}

module.exports = new RoleRepository();
