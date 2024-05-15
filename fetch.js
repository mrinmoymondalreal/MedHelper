module.exports = async function getProducts(q) {
  let data = await fetch("https://search.apollo247.com/v3/fullSearch", {
    headers: {
      accept: "application/json",
      "accept-language": "en-GB,en;q=0.9",
      authorization: "Oeu324WMvfKOj5KMJh2Lkf00eW1",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-token": "",
      Referer: "https://www.apollopharmacy.in/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `{"query":"${q}","page":1,"productsPerPage":40,"selSortBy":"relevance","filters":[],"pincode":""}`,
    method: "POST",
  });

  if (data.ok) {
    data = await data.json();
    if (!data.errorMsg) {
      return data.data.products;
    }
  }

  return [];
};
