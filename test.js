var cidrlite = require ('./');

console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.254.54/23'));
console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.129.39/17'));
console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.43.124/16'));
console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.43.124/26'));

//console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.255.0/23'));
//console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.129.0/15'));
//console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.1.0/16'));
