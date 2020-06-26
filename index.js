const fetch = require("node-fetch");
const fs = require("fs");

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

function writeBand(bytesAmnt) {
  if (bytesAmnt !== 0) {
    fs.writeFile("band.txt", bytesAmnt, function (err) {
      if (err) return console.log(err);
    });
  }
}

/* Get all the zones */

fetch(listEndpoint, fetchConfig)
  .then((response) => response.json())
  .then((resp) => {
    let i = 0;
    resp.result.forEach((obj) => {
      fetch(
        `https://api.cloudflare.com/client/v4/zones/${obj.id}/analytics/dashboard?since=-44640`,
        fetchConfig
      )
        .then((response) => response.json())
        .then((resp) => bandwidths.push(resp.result.totals.bandwidth.all))
        .then(() => {
          const sum = bandwidths.reduce((a, b) => a + b, 0);
          if (i++ === resp.result.length - 1) {
            console.log(sum);
            writeBand(sum);
          }
        });
    });
  })
  .catch((err) => console.error(err));
