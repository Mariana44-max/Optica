const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const { toUserResponseDTO } = require('../dtos/authDtos');

class AuthService {
  async register({ name, email, password, role }) {
    const exists = await userRepository.findByEmail(email);
    if (exists) {
      const err = new Error('El email ya esta registrado');
      err.status = 409;
      throw err;
    }

    const roleName = role || 'USER';
    const roleEntity = await roleRepository.findByName(roleName);
    if (!roleEntity) {
      const err = new Error('Rol no valido');
      err.status = 400;
      throw err;
    }

    const hash = await bcrypt.hash(password, 10);
    const created = await userRepository.create({
      name,
      email,
      password: hash,
      role_id: roleEntity.id,
    });

    const full = await userRepository.findById(created.id);
    return toUserResponseDTO(full);
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Credenciales invalidas');
      err.status = 401;
      throw err;
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const err = new Error('Credenciales invalidas');
      err.status = 401;
      throw err;
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    });

    return { token, user: toUserResponseDTO(user) };
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new AuthService();
