// Convert numbers to roman numerals
const romanise = (no) => {
  if (!+no) {
		return NaN;
	}

	var digits = String(+no).split(''),
		key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
					'', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
					'', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
		result = '',
		i = 3;

	while (i--) {
		result = (key[+digits.pop() + (i * 10)] || '') + result;
	}

  return Array(+digits.join('') + 1).join('M') + result;
};

// Check if an element has a class
const hasClass = (el, cssClass) => {
	return (el.className) &&
		new RegExp("(^|\\s)" + cssClass + "(\\s|$)").test(el.className);
};

let maxRows = 14;

document.documentElement.style.setProperty('--maxrows', maxRows);

const toggleScrollbarClass = () => {
	setTimeout(() => {
		list.className = (list.scrollHeight > 480) ? 'has-scrollbars' : '';
		console.log(list.scrollHeight, list.className);
	}, 5);
};

// let bg = chrome.extension.getBackgroundPage();
let frag = document.createDocumentFragment(),
	list = document.createElement('section');

frag.appendChild(list);
document.body.appendChild(frag.firstChild); // performs better here

// Go through all windows
chrome.windows.getAll({ populate: true }, windows => {
	for (let i = 0; i < windows.length; i++) {
		let w = windows[i],
			fieldset = document.createElement('fieldset'),
			legend = document.createElement('legend'),
			ul = document.createElement('ul'),
			span = document.createElement('span'),
			label = document.createElement('label'),
			count = document.createElement('i');

		// Only active window
		// if (!w.focused) {
		// 	continue;
		// }

		// Ignore special cases
		if (w.type !== 'normal') {
			continue;
		}

		// Setup window
		fieldset.id = w.id;

		// Set attributes
		fieldset.className = [
			w.state,
			w.type,
			w.focused ? 'focused ' : '',
			w.incognito ? 'incognito' : ''
		].join(' ').trim();

		// console.log('Window #' + w.id, w);

		// Window title
		span.innerText = romanise(i + 1);
		legend.appendChild(span);

		// Tab count
		count.innerText = w.tabs.length;
		label.appendChild(count);

		label.innerHTML += (w.tabs.length > 1) ? ' tabs' : ' tab';
		legend.appendChild(label);

		// Append this window
		fieldset.appendChild(legend);
		fieldset.appendChild(ul);

		// Inserting <fieldset> to <section>
		if (w.focused) {
			list.insertBefore(fieldset, list.firstChild); // first child
		} else if (w.state === 'minimized') {
			list.appendChild(fieldset); // last child
		} else {
			if (list.firstChild && hasClass(list.firstChild, 'focused')) {
				// Insert after focused window, if it's there
				list.insertBefore(fieldset, list.firstChild.nextSibling);
			} else {
				// Otherwise prepend but avoid minimised ones
				list.insertBefore(fieldset, list.firstChild);
			}
		}

		// ### TABS ###########################################################
		for (let j = 0; j < w.tabs.length; j++) {
			let t = w.tabs[j],
				li = document.createElement('li'),
				p = document.createElement('p'),
				close = document.createElement('span');

			// Setup tab
			li.id = t.id;
			li.setAttribute('data-idx', t.index);

			// Set attributes
			li.className = [
				t.status,
				(t.pinned ? 'pinned' : ''),
				(w.focused && t.active || t.highlighted ? 'active' : '')
			].join(' ').trim();

			// Favicon
			if (t.favIconUrl) {
				let img = document.createElement('img');

				img.src = t.favIconUrl;
				li.appendChild(img);
			}

			// Title
			p.innerText = t.title;
			li.appendChild(p);

			// Click switching
			li.onclick = ((wid, tid) => {
				return () => {
					chrome.tabs.update(Number(tid), { active: true });
					chrome.windows.update(Number(wid), { focused: true });
					window.close();
				};
			})(w.id, t.id);

			// Close button
			close.className = 'close';
			close.innerHTML = '&times;';
			close.onclick = ((li, tid) => {
				return (e) => {
					let list = li.parentElement,
						legend = list.previousElementSibling,
						count = legend.lastElementChild.firstElementChild;

					li.remove();
					e.stopPropagation();
					count.innerText = list.childElementCount;
					chrome.tabs.remove(Number(tid));
					toggleScrollbarClass();
				};
			})(li, t.id);

			// Append this tab
			li.appendChild(close);
			ul.appendChild(li);
		}
	}
});

toggleScrollbarClass();

// chrome.sessions.restore();
// chrome.sessions.getRecentlyClosed(function (sessions) {
// 	console.log(sessions);
// });
