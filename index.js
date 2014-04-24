var net = require ('net');

// The cidrlite "class"
// ============================================================================
module.exports.cidrlite = cidrlite;
function cidrlite () {
	// Internal state
	this.__IPV4 = {};
	this.__IPV6 = {};
}

//cidrlite.prototype.FUNCTION = function () {
//	
//};

// Quick check functions
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
		return (data == 4 ? data : null);
	}
	return (null);
}

module.exports.isIPv6 = isIPv6;
function isIPv6 (data) {
	if (data && (typeof (data) == 'string')) {
		data = net.isIP (data);
		return (data == 6 ? data : null);
	}
	return (null);
}

module.exports.isCIDR = isCIDR;
function isCIDR (data) {
	if (data && (typeof (data) == 'string')) {
		return (isCIDRv4 (data) || isCIDRv6 (data));
	}
	return (null);
}

module.exports.isCIDRv4 = isCIDRv4;
function isCIDRv4 (data) {
	if (data && (typeof (data) == 'string')) {
		if ((matches = data.match (/^([^\/]+)\/(\d+)$/)) !== null) {
			if (isIPv4 (matches [1]) && (matches [2] >=0) && (matches [2] <= 32)) {
				return (4);
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
				return (6);
			}
		}
	}
	return (null);
}

module.exports.isInCIDR = isInCIDR;
function isInCIDR (needle, haystack) {
	var result, network, length, broadcast, index, first, bit, octet;

	if (! isIP (needle) || ! isCIDR (haystack)) {
		return (null);
	}
	if (isIP (needle) != isCIDR (haystack)) {
		return (null);
	}

	// Convert the needle to string
	needle = inet_pton (needle);
	// Split the haystack into its two parts
	haystack = haystack.split ('/');
	// Convert the network to string
	network = inet_pton (haystack [0]);
	broadcast = inet_pton (haystack [0]);
	// Store the prefix length
	length = parseInt (haystack [1], 10);

	network = networkify (network, length);
	broadcast = broadcastify (broadcast, length);

	if ((needle >= network) && (needle <= broadcast)) {
		return (true);
	}
	return (null);
}

module.exports.isInRange = isInRange;
function isInRange (needle, ground, sky) {

}

module.exports.networkify = networkify;
function networkify (address, length) {
	var result, index, octet;

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
