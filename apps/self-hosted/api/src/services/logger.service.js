const { format } = require("../../node_modules/date-fns");

const green = "\x1b[32m";
const blue = "\x1b[34m";
const red = "\x1b[31m";
const reset = "\x1b[0m";
const orange = "\x1b[33m";

const logInfo = (caller, message = "Start") => {
  const dateTime = `${format(new Date(), "dd-MM-yyyy HH:mm:ss")}`;
  if (message === "Start") {
    console.log(
      `${green}========================================================================${reset}`,
    );
  }

  console.log(
    `${orange}${dateTime} ${blue}INFORMATION: [${caller}] ${message}${reset}`,
  );
};

const logError = (caller, message) => {
  const dateTime = `${format(new Date(), "dd-MM-yyyy HH:mm:ss")}`;
  console.log(
    `${orange}${dateTime} ${red}ERROR: [${caller}] ${message}${reset}`,
  );
};

module.exports = {
  logInfo,
  logError,
};
