var config = {
  // protocol: 'https',
  // hostname: '54.174.247.37:8000',

  //dev: use http
//  protocol: "http",
//  hostname: "127.0.0.1:8000", //"localhost:8000",

  //prod: use https
protocol: "https",
hostname: "old-copy-tasksystem-9f16a052b963.herokuapp.com", //OLD - don't use

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
