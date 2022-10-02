var config = {
  //protocol: 'https',
  //hostname: '54.174.247.37:8000',
  protocol: "https",
  // hostname: "localhost:8000",
  hostname: "sv-task-system.herokuapp.com",
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
config["wsaddr"] = "wss://" + config.hostname;

export default config;
