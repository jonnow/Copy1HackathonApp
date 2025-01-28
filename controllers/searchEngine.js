const wikiProps = require("./../utilities/wikiprops");

/* Module Exports */
module.exports = {
  requestQuery: requestQuery,
  cleanData: cleanData,
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

async function cleanData(rawData) {
  const cleanedData = {};

  /*
    Get the properties we're interested in:
    - Date of birth
  */

  // Date of birth (extract and get year, month and day)
  const dobStr =
    rawData.statements[wikiProps.dob][0].value.content.time.toString();
  cleanedData.dob = getDateOfBirth(dobStr);

  return cleanedData;
}

function getDateOfBirth(dobStr) {
  const dobSanitised = dobStr.replace("+", ""); // Remove the '+' so JavaScript can read the date correctly
  const dob = new Date(dobSanitised);
  const dobYear = dob.getUTCFullYear();
  const dobMonth = dob.getUTCMonth() + 1; // 0 based indexing
  const dobDay = dob.getUTCDate();

  return {
    year: dobYear,
    month: dobMonth,
    day: dobDay,
  };
}
