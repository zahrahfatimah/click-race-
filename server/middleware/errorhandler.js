exports.errorHandler = (error, req, res, next) => {
    let status = 500
    let message = 'Internal Server Error'

    if (error.name == "SequelizeValidationError") {
        status = 400;
        message = error.errors[0].message;
      }
    
      if (error.name == "SequelizeUniqueConstraintError") {
        status = 400;
        message = error.errors[0].message;
      }
    
      if (
        error.name == "SequelizeDatabaseError" ||
        error.name == "SequelizeForeignKeyConstraintError"
      ) {
        status = 400;
        message = "Invalid Input";
      }
    
      if (error.name == "TokenExpiredError" || error.name == "JsonWebTokenError") {
        status = 401;
        message = "Invalid token";
      }
    
      if (error.name == "UNAUTHENTICATED") {
        status = 401;
        message = "Invalid";
      }
    
    res.status(status).json({message})
}