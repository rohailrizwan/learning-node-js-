const asyncHandler = (fn) => {
   return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
export { asyncHandler }





// export default asynchandler;

// next represent middleware
const asynchandler = (fn) => async (req, res, next) => {
  try {

  } catch (error) {

  }
}