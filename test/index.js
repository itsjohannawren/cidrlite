var assert = require ('assert');

var cidrlite = require ('../index.js');

assert.equal (cidrlite.isIP ('127.0.0.1'), 4, '');
assert.equal (cidrlite.isIP ('127.0.0.256'), null, '');
assert.equal (cidrlite.isIP ('127.0.0.1.1'), null, '');
assert.equal (cidrlite.isIP ('::1'), 6, '');
assert.equal (cidrlite.isIP ('::fffff'), null, '');
assert.equal (cidrlite.isIP (':::1'), null, '');
assert.equal (cidrlite.isIP ('::1::1'), null, '');
assert.equal (cidrlite.isIP ('fc00:1:2:3:4:5:6:7'), 6, '');
assert.equal (cidrlite.isIP ('fc00:1:2:3:4:5:6:7:8'), null, '');

assert.equal (cidrlite.isIPv4 ('127.0.0.1'), true, '');
assert.equal (cidrlite.isIPv4 ('127.0.0.256'), null, '');
assert.equal (cidrlite.isIPv4 ('127.0.0.1.1'), null, '');
assert.equal (cidrlite.isIPv4 ('::1'), null, '');
assert.equal (cidrlite.isIPv4 ('::fffff'), null, '');
assert.equal (cidrlite.isIPv4 (':::1'), null, '');
assert.equal (cidrlite.isIPv4 ('::1::1'), null, '');
assert.equal (cidrlite.isIPv4 ('fc00:1:2:3:4:5:6:7'), null, '');
assert.equal (cidrlite.isIPv4 ('fc00:1:2:3:4:5:6:7:8'), null, '');

assert.equal (cidrlite.isIPv6 ('127.0.0.1'), null, '');
assert.equal (cidrlite.isIPv6 ('127.0.0.256'), null, '');
assert.equal (cidrlite.isIPv6 ('127.0.0.1.1'), null, '');
assert.equal (cidrlite.isIPv6 ('::1'), true, '');
assert.equal (cidrlite.isIPv6 ('::fffff'), null, '');
assert.equal (cidrlite.isIPv6 (':::1'), null, '');
assert.equal (cidrlite.isIPv6 ('::1::1'), null, '');
assert.equal (cidrlite.isIPv6 ('fc00:1:2:3:4:5:6:7'), true, '');
assert.equal (cidrlite.isIPv6 ('fc00:1:2:3:4:5:6:7:8'), null, '');


assert.equal (cidrlite.isCIDR ('127.0.0.0/-1'), null, '');
assert.equal (cidrlite.isCIDR ('127.0.0.0/0'), 4, '');
assert.equal (cidrlite.isCIDR ('127.0.0.0/16'), 4, '');
assert.equal (cidrlite.isCIDR ('127.0.0.0/32'), 4, '');
assert.equal (cidrlite.isCIDR ('127.0.0.0/33'), null, '');
assert.equal (cidrlite.isCIDR ('fc00::/-1'), null, '');
assert.equal (cidrlite.isCIDR ('fc00::/0'), 6, '');
assert.equal (cidrlite.isCIDR ('fc00::/64'), 6, '');
assert.equal (cidrlite.isCIDR ('fc00::/128'), 6, '');
assert.equal (cidrlite.isCIDR ('fc00::/129'), null, '');

assert.equal (cidrlite.isCIDRv4 ('127.0.0.0/-1'), null, '');
assert.equal (cidrlite.isCIDRv4 ('127.0.0.0/0'), true, '');
assert.equal (cidrlite.isCIDRv4 ('127.0.0.0/16'), true, '');
assert.equal (cidrlite.isCIDRv4 ('127.0.0.0/32'), true, '');
assert.equal (cidrlite.isCIDRv4 ('127.0.0.0/33'), null, '');
assert.equal (cidrlite.isCIDRv4 ('fc00::/-1'), null, '');
assert.equal (cidrlite.isCIDRv4 ('fc00::/0'), null, '');
assert.equal (cidrlite.isCIDRv4 ('fc00::/64'), null, '');
assert.equal (cidrlite.isCIDRv4 ('fc00::/128'), null, '');
assert.equal (cidrlite.isCIDRv4 ('fc00::/129'), null, '');

assert.equal (cidrlite.isCIDRv6 ('127.0.0.0/-1'), null, '');
assert.equal (cidrlite.isCIDRv6 ('127.0.0.0/0'), null, '');
assert.equal (cidrlite.isCIDRv6 ('127.0.0.0/16'), null, '');
assert.equal (cidrlite.isCIDRv6 ('127.0.0.0/32'), null, '');
assert.equal (cidrlite.isCIDRv6 ('127.0.0.0/33'), null, '');
assert.equal (cidrlite.isCIDRv6 ('fc00::/-1'), null, '');
assert.equal (cidrlite.isCIDRv6 ('fc00::/0'), true, '');
assert.equal (cidrlite.isCIDRv6 ('fc00::/64'), true, '');
assert.equal (cidrlite.isCIDRv6 ('fc00::/128'), true, '');
assert.equal (cidrlite.isCIDRv6 ('fc00::/129'), null, '');

assert.equal (cidrlite.isInCIDR ('127.0.0.1', '127.0.0.0/8'), true, '');
assert.equal (cidrlite.isInCIDR ('127.0.0.1', '127.1.0.0/8'), true, '');
assert.equal (cidrlite.isInCIDR ('127.0.0.1', '128.1.0.0/8'), null, '');

assert.equal (cidrlite.isInCIDR ('fc00::1', 'fc00::/16'), true, '');
assert.equal (cidrlite.isInCIDR ('fc00::1', 'fc00:1::/16'), true, '');
assert.equal (cidrlite.isInCIDR ('fc00::1', 'fc01:1::/16'), null, '');


//cidrToRange (cidr, assumeCorrect)
//rangeToCIDR (range)
//isInRange (needle, ground, sky)
//networkify (address, length)
//broadcastify (address, length)
//inet_pton (address)
//inet_ntop (address)
//inet_ntoi (address)
//inet_iton (address, family)
