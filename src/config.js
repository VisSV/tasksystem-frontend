
var config = {
  protocol: 'http',
  hostname: 'localhost:8000',
  //protocol: 'https',
  //hostname: 'sv-task-server.herokuapp.com',
  colorScale: ['', '#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc','#e5d8bd','#fddaec'] // colorbrewer pastel1
};

config['httpaddr'] = config.protocol + '://' + config.hostname;
config['wsaddr'] = 'wss://' + config.hostname;

export default config;

