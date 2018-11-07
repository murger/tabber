// Count the number of tabs
var updateTabCount = function () {
	chrome.tabs.query({}, function (tabs) {
		var count = tabs.length,
			red = count * 2,
			blue = 200 - red;

		if (red > 200) { red = 200; }
		if (blue < 0) { blue = 0; }

		chrome.browserAction.setBadgeBackgroundColor({
			// color: [35, 85, 255, 255]
			color: [0, 0, 0, 255]
		});

		chrome.browserAction.setBadgeText({
			text: String(count)
		});
	});
};

// Add listeners
chrome.tabs.onCreated.addListener(updateTabCount);
chrome.tabs.onRemoved.addListener(updateTabCount);

// Display initial count
updateTabCount();