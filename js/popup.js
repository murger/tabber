// document.addEventListener('DOMContentLoaded', function () {
	// var bg = chrome.extension.getBackgroundPage();
	var frag = document.createDocumentFragment(),
		list = document.createElement('section');

	frag.appendChild(list);

	var hasClass = function (el, cssClass) {
		return el.className && new RegExp("(^|\\s)" + cssClass + "(\\s|$)").test(el.className);
	}

	// Iterate through windows
	chrome.windows.getAll({ populate: true }, function (windows) {
		for (var i = 0; i < windows.length; i++) {
			// Create elements
			var w = windows[i],
				fieldset = document.createElement('fieldset'),
				legend = document.createElement('legend'),
				ul = document.createElement('ul');

			if (!w.focused) {
				// continue;
			}

			// Ignore special cases
			if (w.type !== 'normal') {
				continue;
			}

			// Set ID
			fieldset.id = w.id;

			// Attach <fieldset> window info as class names
			fieldset.className = [
				w.state,
				w.type,
				w.focused ? 'focused ' : '',
				w.incognito ? 'incognito' : ''
			].join(' ').trim();

			// console.log('Window #' + w.id, w);

			// Generate <legend> text
			legend.innerHTML = '<label><b>' + w.tabs.length + '</b> tabs</label>' +
				'<span>' + (i + 1) + '<em>/</em>' + windows.length + '</span>';

			legend.innerHTML += (w.incognito) ? 'incognito ' : ' ';
			//legend.innerHTML += 'tab' + (w.tabs.length > 1 ? 's ' : ' ');
			legend.innerHTML += (w.focused)
				? '' // active
				: w.state === 'minimized'
					? '' // inactive
					: ''; // window

			// Append <legend> & <ul>
			fieldset.appendChild(legend);
			fieldset.appendChild(ul);

			// Inserting <fieldset> to <listion>
			if (w.focused) {
				// As the first child if active window
				list.insertBefore(fieldset, list.childNodes[0]);
			} else if (w.state === 'minimized') {
				// As the last child if minimised window
				list.appendChild(fieldset);
			} else {
				if (list.firstChild && hasClass(list.firstChild, 'focused')) {
					// Insert after focused window, if it's there
					list.insertBefore(fieldset, list.firstChild.nextSibling);
				} else {
					// Otherwise prepend but avoid minimised ones
					list.insertBefore(fieldset, list.childNodes[0]);
				}
			}

			// This window's tabs
			for (var j = 0; j < w.tabs.length; j++) {
				// Create a list item
				var t = w.tabs[j],
					li = document.createElement('li'),
					url = t.url.replace('http:', '').replace('https:', '').replace('//', ''),
					path = url.split('/'),
					host = path[0],
					noLoad = t.title.indexOf('Oops! Google Chrome could not find') === 0,
					failLoad = t.title.indexOf(t.url + ' failed to load') === 0,
					noAvail = t.title.indexOf(t.url + ' is not available') === 0,
					noTitle = t.title === url,
					title = (noTitle) ? url : t.title;

				// console.log('Tab #' + t.id, t);

				if (url.substr(-1) === '/') {
					url = url.substr(0, url.length - 1);
				}

				//li.title = url;

				// Set tab attributes
				li.id = t.id;
				li.setAttribute('data-idx', t.index);

				path.shift(); // remove http

				// Adjust for the Great Suspender
				if (host === 'chrome-extension:klbibkeccnjlkjkiokjodocebajanakg') {
					path.shift();
					path.shift();
					host = '*' + path.shift();
				}

				if (path[0].length > 0) {
					path[0] = '/' + path[0];
				}

				li.innerHTML = (noTitle)
					? '<p><b>' + url + '</b></p>'
					: '<p><b>' + host.replace('www.', '') + '</b><i>' + path.join('/') + '</p>';

				li.onclick = (function (wid, tid) {
					return function () {
						chrome.windows.update(Number(wid), { focused: true });
						chrome.tabs.update(Number(tid), { active: true });
					};
				})(w.id, t.id);

				// Set attributes as class names
				li.className = [
					t.status,
					(noAvail || noTitle || noLoad || failLoad ? 'no-avail' : ''),
					(t.pinned ? 'pinned' : ''),
					(w.focused && t.active ? 'active' : ''),
					(t.highlighted ? 'active' : '')
				].join(' ').trim();

				// Make favicon <img>
				if (t.favIconUrl) {
					var img = document.createElement('img');

					img.src = t.favIconUrl;
					li.appendChild(img);
				}

				// Add close button
				var close = document.createElement('span');

				close.className = 'close';
				close.innerHTML = '&times;';

				close.onclick = (function (li, tid) {
					return function (e) {
						e.preventDefault();
						e.stopPropagation();
						li.parentNode.removeChild(li);
						chrome.tabs.remove(Number(tid));
					};
				})(li, t.id);

				li.appendChild(close);

				// Append <li> to window <ul>
				ul.appendChild(li);
			}
		}
	});

	document.body.appendChild(frag.firstChild);
	document.body.style.display = 'block';
// });