var moment = require('moment');

var createdAt = new Date().getTime();
var date = moment(createdAt);
console.log(date.format('h:mm a MMM Do, YYYY'))
