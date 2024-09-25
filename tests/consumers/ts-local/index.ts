import { api } from "axe-api-client";

const main = async () => {
  api.setConfig({
    baseURL: "https://axe-api.com",
  });
  console.log(api.getConfig());

  console.log("ESM module tests are succeed!");
};

main();
