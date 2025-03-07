/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");
const fetch = require("node-fetch");
const search = require("./controllers/searchEngine.js");
const cleanData = require("./controllers/cleanData.js");
const extractedWikiIds = require("./data/sampleIds.json");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
  root: path.join(__dirname),
});

// Load and parse SEO data
const seo = require("./src/seo.json");

seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template

  // Boilerplate code:
  // let params = { seo: seo };

  // // If someone clicked the option for a random color it'll be passed in the querystring
  // if (request.query.randomize) {
  //   // We need to load our color data file, pick one at random, and add it to the params
  //   const colors = require("./src/colors.json");
  //   const allColors = Object.keys(colors);
  //   let currentColor = allColors[(allColors.length * Math.random()) << 0];

  //   // Add the color properties to the params object
  //   params = {
  //     color: colors[currentColor],
  //     colorError: null,
  //     seo: seo,
  //   };
  // }

  // The Handlebars code will be able to access the parameter values and build them into the page
  //return reply.view("/src/pages/index.hbs", params);

  // End boilerplate code.

  return reply.view("./src/pages/index.hbs");
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
  // Build the params object to pass to the template
  let params = { seo: seo };

  // If the user submitted a color through the form it'll be passed here in the request body
  let color = request.body.color;

  // If it's not empty, let's try to find the color
  if (color) {
    // ADD CODE FROM TODO HERE TO SAVE SUBMITTED FAVORITES

    // Load our color data file
    const colors = require("./src/colors.json");

    // Take our form submission, remove whitespace, and convert to lowercase
    color = color.toLowerCase().replace(/\s/g, "");

    // Now we see if that color is a key in our colors object
    if (colors[color]) {
      // Found one!
      params = {
        color: colors[color],
        colorError: null,
        seo: seo,
      };
    } else {
      // No luck! Return the user value as the error property
      params = {
        colorError: request.body.color,
        seo: seo,
      };
    }
  }

  // The Handlebars template will use the parameter values to update the page with the chosen color
  return reply.view("/src/pages/index.hbs", params);
});

// Redirect GET /search to the homepage
fastify.get("/search", function (request, reply) {
  return reply.redirect("/");
});

// Handle search requests from the form
fastify.post("/search", async function (request, reply) {
  console.log("request.body:", request.body);

  // Get the incoming WikiData Page ID from the form
  let wiki_id = request.body.wid;

  // Search the WikiData API using this ID
  const wikiData = await search.requestQuery(wiki_id);
  console.log("Back from the search with the wikiData: ", wikiData);

  // Clean the data to extract what we want
  const definedWikiData = await cleanData.cleanData(wikiData);

  // Return the results to a webpage
  return reply.view("src/pages/searchResults.hbs", {
    rawData: wikiData,
    cleanData: definedWikiData,
  });
});
fastify.get("/collage", async function (request, reply) {
  try {
    // Use Promise.all to handle all the asynchronous calls
    const images = await Promise.all(
      extractedWikiIds.map(async (wiki_id) => {
        const wikiData = await search.requestQuery(wiki_id);
        const definedWikiData = await cleanData.cleanImage(wikiData);
        return definedWikiData?.img; // Return undefined if definedWikiData is undefined
      })
    );

    // Filter out any undefined results
    const filteredImages = images.filter((img) => img !== undefined);

    // Send data back to the page
    return reply.view("src/pages/collage.hbs", {
      cleanData: filteredImages,
    });
  } catch (error) {
    console.error("Error fetching wiki data:", error);
    return reply.code(500).send("An error occurred while fetching data.");
  }
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
