const fs = require("fs");

const uncaughtException = () => {
  process.on("uncaughtException", err => {
    const error = Object.create(err);
    console.log("UNCAUGHT EXCEPTION!💥💥💥🙄💥💥💥 Shutting down... ");
    console.log(error.name, error.message);
    const now = new Date(Date.now());
    fs.appendFileSync("./log.txt", `${now.toUTCString()} - ${err}\n`, "utf-8");
    process.exit(1);
  });
};

module.exports = uncaughtException;
