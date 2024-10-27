const errorHandler = require("./errorHandler");

const verifyRoles = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req?.roles) return next(errorHandler(401, "You're not authorized, no roles found"));
    const rolesArray = [...allowedRoles];
    console.log("Allowed", allowedRoles);
    const result = req?.roles.map((role) => rolesArray.includes(role)).find((val) => val === true);
    if (!result) return next(errorHandler(401, "You're not authorized to perform this request"));
    next();
  };
};

module.exports = verifyRoles;
