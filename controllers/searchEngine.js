/* Module Exports */
module.exports = {
  requestQuery: requestQuery,
};

async function requestQuery(wikiDataId) {
  const url = `https://www.wikidata.org/w/rest.php/wikibase/v1/entities/items/${wikiDataId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  });

  console.log("Got the data, parsing to JSON");
  const data = await res.json();

  console.log("Returning the JSON'd data");
  return data;

  //   return new Promise(async function(resolve, reject) {
  //     // console.log("url:", url)
  //     //let url = "https://en.wikipedia.org/w/api.php?origin=*";

  //     // do something with wikidataid
  //     let url = "https://www.wikidata.org/w/rest.php/wikibase/v1/entities/items/Q43922"
  //     debugger
  //     let fetchedVal = fetch(url, {
  //       method: 'GET',
  //       headers: {
  //          "User-Agent": "NationalArchivesNamedPersons (https://tna-named-persons.glitch.me/; jonnowitts@gmail.com)"
  //       }
  //     })
  //     .then((res) => {
  //       //console.log('Status: ' + res.status + ': ' + res.statusText)
  //       return res.json()
  //     })
  //     .then((data) => {ssd
  //       //console.log('data: ', resolve)
  //       return resolve(data.query)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //     })

  //     return fetchedVal
  //   })
}
