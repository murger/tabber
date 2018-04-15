// document.addEventListener('DOMContentLoaded', function () {
	var bg = chrome.extension.getBackgroundPage(),
		frag = document.createDocumentFragment(),
		list = bg.list;

	frag.appendChild(list);

	document.body.appendChild(frag.firstChild);
	document.body.style.display = 'block';
// });