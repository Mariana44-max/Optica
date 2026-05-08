const authService = require('../services/authService');
const { validateRegister, validateLogin } = require('../dtos/authDtos');

class AuthController {
  async register(req, res) {
    try {
      const errors = validateRegister(req.body);
      if (errors.length) return res.status(400).json({ errors });
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'Usuario registrado', user });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const errors = validateLogin(req.body);
      if (errors.length) return res.status(400).json({ errors });
      const data = await authService.login(req.body);
      res.json({ message: 'Login exitoso', ...data });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  me(req, res) {
    res.json({ user: req.user });
  }

  async validate(req, res) {
    res.json({ valid: true, user: req.user });
  }
}

module.exports = new AuthController();
