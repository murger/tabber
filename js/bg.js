// Count the number of tabs
var showTabCount = function () {
	chrome.tabs.query({}, function (tabs) {
		var count = tabs.length,
			red = count * 2,
			green = 200 - red;

			if (red > 200) { red = 200; }
			if (green < 0) { green = 0; }

		chrome.browserAction.setBadgeBackgroundColor({
			color: [red, green, 0, 255]
		});

		chrome.browserAction.setBadgeText({
			text: String(count)
		});
	});
};

// Add listeners
chrome.tabs.onCreated.addListener(showTabCount);
chrome.tabs.onRemoved.addListener(showTabCount);

// Display initial count
showTabCount();