
const validEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email); // true if valid, false if not
};
const validPassword = (password) => {
  return password?.length >=8 ; // true if valid, false if not
}

export {validEmail,validPassword}