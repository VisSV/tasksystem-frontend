var config = {
  //protocol: 'https',
  //hostname: '54.174.247.37:8000',

  protocol: 'http',
  hostname: 'creststudy1.services.adelaide.edu.au:8443',

  //dev: use http
  // protocol: "http",
  // hostname: "localhost:8000",

  //prod: use https
  // protocol: "https",
  // hostname: "sv-task-system.herokuapp.com",
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
config["wsaddr"] = "ws://" + config.hostname;

export default config;
