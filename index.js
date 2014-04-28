var net = require ('net');
var bigint = require ('big-integer');

// The cidrlite "class"
// ============================================================================
//module.exports.cidrlite = cidrlite;
//function cidrlite () {
//	// Internal state
//	this.__IPV4 = {};
//	this.__IPV6 = {};
//}
//
//cidrlite.prototype.FUNCTION = function () {
//	
//};

// Standalone functions
// ============================================================================

module.exports.isIP = isIP;
function isIP (data) {
	if (data && (typeof (data) == 'string')) {
		data = net.isIP (data);
		return (data !== 0 ? data : null);
	}
	return (null);
}

module.exports.isIPv4 = isIPv4;
function isIPv4 (data) {
	if (data && (typeof (data) == 'string')) {
		data = net.isIP (data);
		return (data == 4 ? true : null);
	}
	return (null);
}

module.exports.isIPv6 = isIPv6;
function isIPv6 (data) {
	if (data && (typeof (data) == 'string')) {
		data = net.isIP (data);
		return (data == 6 ? true : null);
	}
	return (null);
}

module.exports.isCIDR = isCIDR;
function isCIDR (data) {
	if (data && (typeof (data) == 'string')) {
		if (isCIDRv4 (data)) {
			return (4);

		} else if (isCIDRv6 (data)) {
			return (6);
		}
	}
	return (null);
}

module.exports.isCIDRv4 = isCIDRv4;
function isCIDRv4 (data) {
	if (data && (typeof (data) == 'string')) {
		if ((matches = data.match (/^([^\/]+)\/(\d+)$/)) !== null) {
			if (isIPv4 (matches [1]) && (matches [2] >=0) && (matches [2] <= 32)) {
				return (true);
			}
		}
	}
	return (null);
}

module.exports.isCIDRv6 = isCIDRv6;
function isCIDRv6 (data) {
	if (data && (typeof (data) == 'string')) {
		if ((matches = data.match (/^([^\/]+)\/(\d+)$/)) !== null) {
			if (isIPv6 (matches [1]) && (matches [2] >=0) && (matches [2] <= 128)) {
				return (true);
			}
		}
	}
	return (null);
}

module.exports.isInCIDR = isInCIDR;
function isInCIDR (needle, haystack) {
	var result, network, length, broadcast, index, first, bit, octet;

	if (isIPv4 (needle)) {
		if (! isCIDRv4 (haystack)) {
			return (null);
		}

	} else if (isIPv6 (needle)) {
		if (! isCIDRv6 (haystack)) {
			return (null);
		}

	} else {
		return (null);
	}

	// Convert the needle to string
	needle = inet_pton (needle);
	// Split the haystack into its two parts
	haystack = haystack.split ('/');
	// Convert the network to string
	network = inet_pton (haystack [0]);
	// Fix the prefix base
	network = networkify (network, haystack [1]);
	
	broadcast = inet_pton (haystack [0]);
	broadcast = broadcastify (broadcast, haystack [1]);

	// Store the prefix length
	length = parseInt (haystack [1], 10);

	if ((needle >= network) && (needle <= broadcast)) {
		return (true);
	}
	return (null);
}

module.exports.cidrToRange = cidrToRange;
function cidrToRange (cidr, assumeCorrect) {
	var family, ground, sky, mask;

	// Check for a "valid" CIDR
	if (! isCIDR (cidr)) {
		return (null);
	}

	// Break the CIDR apart
	ground = cidr.split ('/');
	mask = ground [1];
	ground = inet_pton (ground [0]);

	if (ground.length == 4) {
		family = 4;

	} else if (ground.length == 16) {
		family = 6;

	} else {
		return (null);
	}

	if (! assumeCorrect) {
		// Fix the prefix base
		ground = networkify (ground, mask);
	}

	// Set the top of the prefix to the integer form of the base
	sky = inet_ntoi (ground);

	// Increment the top of the prefix for the size of the block
	sky = sky.add (bigint (2).pow (((family == 4) ? 32 : (family == 6) ? 128 : 0) - mask)).minus (1) ;
	//console.info (sky);

	return ([ground, inet_iton (sky, family)]);
}

module.exports.rangeToCIDR = rangeToCIDR;
function rangeToCIDR (range) {
	var result = [], family, position, index;

	if (! range || range.length != 2) {
		return (null);
	}
	if (range [0].length == 4) {
		family = 4;
		if (range [1].length != 4) {
			return (null);
		}

	} else if (range [0].length == 16) {
		family = 6;
		if (range [1].length != 16) {
			return (null);
		}

	} else {
		return (null);
	}

	if (range [0] > range [1]) {
		// Well, that's wrong...
		var temp = range [1];
		range [1] = range [0];
		range [0] = temp;
		temp = null;
	}

	while (range [0] <= range [1]) {
		for (index = 0; index <= ((family == 4) ? 32 : (family == 6) ? 128 : 0); index++) {
			if ((range [0] == networkify (range [0], index)) && (broadcastify (range [0], index) <= range [1])) {
				result.push (inet_ntop (range [0]) + '/' + index);
				range [0] = inet_iton (
					inet_ntoi (
						range [0]).add (bigint (2).pow (((family == 4) ? 32 : (family == 6) ? 128 : 0) - index)
					),
					family
				);
				break;
			}
		}
	}

	return (result);
}

module.exports.isInRange = isInRange;
function isInRange (needle, ground, sky) {
	if (! needle || ! ground || ! sky) {
		return (null);
	}
	if ((needle.length != 4) && (needle.length != 16)) {
		if (! isIP (needle)) {
			return (null);
		}
		needle = inet_pton (needle);
	}

	if ((ground.length != 4) && (ground.length != 16)) {
		if (! isIP (ground)) {
			return (null);
		}
		ground = inet_pton (ground);
	}

	if ((sky.length != 4) && (sky.length != 16)) {
		if (! isIP (sky)) {
			return (null);
		}
		sky = inet_pton (sky);
	}

	if ((needle >= ground) && (needle <= sky)) {
		return (true);
	}

	return (false);
}

module.exports.networkify = networkify;
function networkify (address, length) {
	var result, index, octet;

	if ((address.length != 4) && (address.length != 16)) {
		return (null);
	}

	// Fix the network to be sure it is really the network based on the length
	for (index = 0, result = ''; index < address.length; index++) {
		if (length - (index * 8) >= 8) {
			// Whole byte
			result += address.charAt (index);

		} else if (length - (index * 8) >= 0) {
			// Partial byte
			octet = 0;
			for (bit = 7; bit >= 8 - (length - (index * 8)); bit--) {
				octet |= 1 << bit;
			}
			octet = address.charCodeAt (index) & octet;
			result += String.fromCharCode (octet);

		} else {
			// Useless
			result += String.fromCharCode (0);
		}
	}
	
	return (result);
}

module.exports.broadcastify = broadcastify;
function broadcastify (address, length) {
	var result, index, octet;

	if ((address.length != 4) && (address.length != 16)) {
		return (null);
	}

	// Calculate the broadcast
	for (index = 0, result = ''; index < address.length; index++) {
		if (length - (index * 8) >= 8) {
			// Whole byte
			result += address.charAt (index);

		} else if (length - (index * 8) >= 0) {
			// Partial byte
			octet = 0;
			for (bit = 7; bit >= 8 - (length - (index * 8)); bit--) {
				octet |= 1 << bit;
			}
			octet ^= 255;
			octet |= address.charCodeAt (index);
			result += String.fromCharCode (octet);

		} else {
			// Useless
			result += String.fromCharCode (255);
		}
	}
	
	return (result);
}

module.exports.inet_pton = inet_pton;
function inet_pton (address) {
	var parts, result, resultIndex, index;

	if (isIPv4 (address)) {
		result = address.split ('.').map (function (value, index, array) { return (String.fromCharCode (parseInt (value, 10))); }).join ('');
		return (result);

	} else if (isIPv6 (address)) {
		// Nasty, but it's worked in the past ;-)
		result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		// Split
		parts = address.split (':');

		// First, we going forwards
		for (index = 0, resultIndex = 0; index < parts.length; index++) {
			if (parts [index] === '') {
				// Hit a blank, must be the ::
				break;
			}

			// Pad out to 4 nibbles
			parts [index] = ('0000' + parts [index]).substr (-4);
			result [resultIndex++] = parseInt (parts [index].substr (0, 2), 16);
			result [resultIndex++] = parseInt (parts [index].substr (2, 2), 16);
		}

		// Did we make it all the way to the end?
		if (resultIndex < 16) {
			// Negative ghostrider, we're going backwards now
			for (index = parts.length - 1, resultIndex = 15; index >= 0; index--) {
				if (parts [index] === '') {
					// Hit a blank, must be the ::
					break;
				}

				// Pad out to 4 nibbles
				parts [index] = ('0000' + parts [index]).substr (-4);
				result [resultIndex--] = parseInt (parts [index].substr (2, 2), 16);
				result [resultIndex--] = parseInt (parts [index].substr (0, 2), 16);
			}
		}

		result = result.map (function (value, index, array) { return (String.fromCharCode (parseInt (value, 10))); }).join ('');
		return (result);
	}
	return (null);
}

module.exports.inet_ntop = inet_ntop;
function inet_ntop (address) {
	var result, index;

	if (! address || (typeof (address) != 'string')) {
		return (null);
	}

	if (address.length == 4) {
		result = [];
		for (index = 0; index < 4; index++) {
			result.push (address.charCodeAt (index));
		}
		result = result.join ('.');
		return (result);

	} else if (address.length == 16) {
		result = [];
		for (index = 0; index < 16; index++) {
			result.push (('00' + address.charCodeAt (index).toString (16)).substr (-2));
		}
		for (index = 0; index < 16; index += 2) {
			result [index / 2] = parseInt (result [index] + result [index + 1], 16).toString (16);
		}
		result = result.slice (0, 8).join (':');
		return (result);
	}
	return (null);
}

function inet_ntoi (address) {
	var index, result = bigint (0);

	if ((address.length != 4) && (address.length != 16)) {
		return (null);
	}

	for (index = 0; index < address.length; index++) {
		result = result.multiply (256).add (address.charCodeAt (index));
	}

	return (result);
}

function inet_iton (address, family) {
	var result = '', index;

	if ((family == 'inet') || (family == 'ipv4') || (family == '4') || (family == 4)) {
		for (index = 0; index < 4; index++) {
			result = String.fromCharCode (address.mod (256).valueOf ()) + result;
			address = address.over (256);
		}
		return (result);

	} else if ((family == 'inet6') || (family == 'ipv6') || (family == '6') || (family == 6)) {
		for (index = 0; index < 16; index++) {
			result = String.fromCharCode (address.mod (256).valueOf ()) + result;
			address = address.over (256);
		}
		return (result);

	} else {
		console.info ('here');
		return (null);
	}
}
