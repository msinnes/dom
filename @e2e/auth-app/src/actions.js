const login = user => ({
  type: 'LOGIN',
  data: user,
});

const logout = () => ({
  type: 'LOGOUT',
});

export { login, logout };