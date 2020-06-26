const fetch = require("node-fetch");

const Auth = process.env.token || require("./creds.js");

/* Config */
const listEndpoint = "https://api.cloudflare.com/client/v4/zones";
const token = "Bearer " + Auth;

fetch(listEndpoint, {
  method: "GET",
  headers: {
    Authorization: token,
  },
})
  .then((response) => response.json())
  .then((resp) => console.log(resp))
  .catch((err) => console.error(err));
