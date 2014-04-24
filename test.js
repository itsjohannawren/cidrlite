var cidrlite = require ('./');

console.info (cidrlite.isInCIDR ('192.168.255.1', '0.0.0.0/8'));

console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.255.0/23'));
console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.129.0/15'));
console.info (cidrlite.isInCIDR ('192.168.255.1', '192.168.1.0/16'));
