const fs = require("fs");

const unhandledRejection = () => {
  process.on("unhandledRejection", err => {
    console.log("UNHANDLER REJECTION!💥💥💥🙄💥💥💥 Shutting down... ");
    console.log(err.name, err.message);
    const now = new Date(Date.now());
    fs.appendFileSync("./log.txt", `${now.toUTCString()} - ${err}\n`, "utf-8");
    server.close(() => {
      process.exit(1);
    });
  });
};

module.exports = unhandledRejection;
