// Count the number of tabs
var updateTabCount = function () {
	chrome.tabs.query({}, function (tabs) {
		chrome.browserAction.setBadgeBackgroundColor({
			color: [51, 102, 204, 255]
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
