const api = require("axe-api-client");

const main = async () => {
  api.setConfig({
    baseURL: "https://axe-api.com",
  });
  console.log(api.getConfig());
  console.log("CJS module tests are succeed!");
};

main();
