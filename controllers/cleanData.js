const wikiProps = require("./../utilities/wikiprops");

module.exports = {
  cleanData: cleanData,
};

async function cleanData(rawData) {
  const cleanedData = {};

  /*
    Get the properties we're interested in:
    - Date of birth
    - Date of death
  */

  // Date of birth (extract and get year, month and day)
  const dobStr =
    rawData.statements[wikiProps.dob][0].value.content.time.toString();
  cleanedData.dob = getDate(dobStr);

  // Date of death (extract and get year, month and day)
  const dodStr =
    rawData.statements[wikiProps.dod][0].value.content.time.toString();
  cleanedData.dod = getDate(dodStr);

  return cleanedData;
}

function getDate(dateStr) {
  const dateSanitised = dateStr.replace("+", ""); // Remove the '+' so JavaScript can read the date correctly
  const date = new Date(dateSanitised);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // 0 based indexing
  const day = date.getUTCDate();

  return {
    year: year,
    month: month,
    day: day,
  };
}
