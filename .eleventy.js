const { minify } = require("terser");

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
    code,
    callback
  ) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);
      callback(null, code);
    }
  });

  eleventyConfig.addPassthroughCopy({"src/static": "."});

  return {
    dir: {
      input: "src",
    },
  };
}