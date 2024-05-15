const { parse } = require("node-html-parser");

module.exports = async function getGovtData(q) {
  q = q
    .replace(/[^\w\s]|_/g, " ")
    .toLowerCase()
    .slice(0, 9);
  let data = await fetch("https://janaushadhi.gov.in/ProductList.aspx", {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,bn;q=0.6",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      pragma: "no-cache",
      "sec-ch-ua":
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie: "ASP.NET_SessionId=v3feu5kt40gw54osadd02kba",
      Referer: "https://janaushadhi.gov.in/ProductList.aspx",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `__EVENTTARGET=&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwUKMjEyMjUwNjI3Nw9kFgJmD2QWAgIDD2QWAgIBD2QWAgIHDxYCHgtfIUl0ZW1Db3VudGZkZDqq7iae2kuVFUXG6SbrMpfgksbwWcqnumCRPwfQSi%2Bj&__VIEWSTATEGENERATOR=754E3D9C&__SCROLLPOSITIONX=0&__SCROLLPOSITIONY=490.3999938964844&__EVENTVALIDATION=%2FwEdAAUMAhXP3%2BX80z9GlrzpTkqByt4UjSul2XaF7p6cUBls1Ypc%2BW%2FxlMx5C9nXoNS4DXWR4LjkR5IsL9YRVdq8PhvwtQk1kjZvzZ6i3pNtldB1mpbvggkJT9KF%2FWOBQQoXp7fr2w3qJnge6GRbvTaBrz0u&ctl00%24Bppi_body%24txtSearch=${q}&ctl00%24Bppi_body%24btnSearch=Search`,
    method: "POST",
  });
  data = await data.text();
  const html = data;
  let root = parse(html);

  root = root.querySelector("table");
  let medecines = root.querySelectorAll("tr");

  let keys = medecines[0].querySelectorAll("td").map((e) => e.textContent);

  let result = [];

  for (let i = 1; i < medecines.length; i++) {
    let f = {};
    let values = medecines[i].querySelectorAll("th");
    keys.map((e, j) => {
      return (f[e] = values[j].textContent);
    });

    result.push(f);
  }

  return result;
};
