const path = require("path");

module.exports = {
  mode: "development", //el modo de uso
  entry: "./src/index.js", //donde se aplicara
  output: {
    path: path.resolve(__dirname, "dist"), //el path de los ficheros de output(ruta absoluta)
    filename: "bundle.js",
  },
  watch: true,
};
