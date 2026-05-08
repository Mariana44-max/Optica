function toUserResponseDTO(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ? user.role.name : null,
  };
}

function validateRegister(body) {
  const errors = [];
  if (!body.name || body.name.trim().length < 2) errors.push('name requerido');
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push('email invalido');
  if (!body.password || body.password.length < 6) errors.push('password minimo 6 caracteres');
  if (body.role && !['ADMIN', 'USER'].includes(body.role)) errors.push('role debe ser ADMIN o USER');
  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (!body.email) errors.push('email requerido');
  if (!body.password) errors.push('password requerido');
  return errors;
}

module.exports = { toUserResponseDTO, validateRegister, validateLogin };
