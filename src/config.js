var config = {
  //dev: use http
  // protocol: "http",
  // hostname: "localhost:8000",

  //prod: use https
  protocol: "https",
  // hostname: 'www2.visus.uni-stuttgart.de/webveta/repo2/',
  hostname: "old-copy-tasksystem-9f16a052b963.herokuapp.com/", //OLD - don't use

  colorScale: [
    "",
    "#f7cbd7",
    "#b3cde3",
    "#ccebc5",
    "#decbe4",
    "#fed9a6",
    "#ffffcc",
    "#bde4e5",
    "#dbdbdb",
  ], // colorbrewer pastel1
};

config["httpaddr"] = config.protocol + "://" + config.hostname;
//dev: use ws
// config["wsaddr"] = "ws://" + config.hostname;

//prod: use wss
config["wsaddr"] = "wss://" + config.hostname;

export default config;
