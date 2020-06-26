const fetch = require("node-fetch");
const fs = require('fs');

const Auth = process.env.token || require("./creds.js");

/* Config */
const listEndpoint = "https://api.cloudflare.com/client/v4/zones";
const token = "Bearer " + Auth;
const fetchConfig = {
  method: "GET",
  headers: {
    Authorization: token,
  },
};

global.bandwidths = [];

/* Get all the zones */

fetch(listEndpoint, fetchConfig)
  .then((response) => response.json())
  .then((resp) => {
    resp.result.forEach((obj) => {
      fetch(
        `https://api.cloudflare.com/client/v4/zones/${obj.id}/analytics/dashboard`,
        fetchConfig
      )
        .then((response) => response.json())
        .then((resp) => bandwidths.push(resp.result.totals.bandwidth.all))
        .then(() => console.log(bandwidths.reduce((a, b) => a + b, 0)));
    });
  })
  .catch((err) => console.error(err));