(function() {
	'use strict';
	var consentLogEndpoint = (function() {
		try {
			var s = document.currentScript;
			var url = s && s.getAttribute('data-consent-log-url');
			if (typeof url === 'string' && url.length > 0) return url;
		} catch (e) {}
		return '/.netlify/functions/consent-log';
	})();
	var allCats = ['necessary','analytics','marketing','externe-dienste','session-analyse'];
	var sentIds = {};
	function sendPayload(payload) {
		if (!payload || !payload.consentId) return;
		if (sentIds[payload.consentId]) return;
		sentIds[payload.consentId] = true;
		try {
			var url = consentLogEndpoint.startsWith('http') ? consentLogEndpoint : (window.location.origin + consentLogEndpoint);
			fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
				keepalive: true,
			}).catch(function() {});
		} catch (e) {}
	}
	function logConsent() {
		try {
			var cc = window.CookieConsent;
			if (cc && cc.getCookie && cc.getUserPreferences) {
				var cookie = cc.getCookie();
				var prefs = cc.getUserPreferences();
				sendPayload({
					consentId: cookie.consentId,
					consentTimestamp: cookie.consentTimestamp,
					lastConsentTimestamp: cookie.lastConsentTimestamp,
					acceptType: prefs.acceptType,
					acceptedCategories: prefs.acceptedCategories,
					rejectedCategories: prefs.rejectedCategories,
					languageCode: cookie.languageCode || 'de',
					revision: cookie.revision,
					url: window.location.href,
				});
				return;
			}
		} catch (e) {}
		readConsentFromCookie();
	}
	function readConsentFromCookie() {
		try {
			var raw = document.cookie.split(';').map(function(s) { return s.trim(); }).filter(function(s) { return s.indexOf('cc_ranknitro=') === 0; })[0];
			if (!raw) return;
			var json = decodeURIComponent(raw.split('=').slice(1).join('='));
			var data = JSON.parse(json);
			if (!data.consentId || !data.consentTimestamp) return;
			var accepted = data.categories || [];
			var rejected = allCats.filter(function(c) { return accepted.indexOf(c) === -1; });
			var acceptType = accepted.length >= allCats.length ? 'all' : (accepted.length <= 1 && accepted[0] === 'necessary' ? 'necessary' : 'custom');
			sendPayload({
				consentId: data.consentId,
				consentTimestamp: data.consentTimestamp,
				lastConsentTimestamp: data.lastConsentTimestamp || data.consentTimestamp,
				acceptType: acceptType,
				acceptedCategories: accepted,
				rejectedCategories: rejected,
				languageCode: data.languageCode || 'de',
				revision: data.revision || 0,
				url: window.location.href,
			});
		} catch (e) {}
	}
	document.addEventListener('cc:onFirstConsent', logConsent);
	document.addEventListener('cc:onChange', logConsent);
	window.addEventListener('cc:onFirstConsent', logConsent);
	window.addEventListener('cc:onChange', logConsent);
	document.addEventListener('DOMContentLoaded', function() {
		setTimeout(logConsent, 1500);
		var n = 0;
		var t = setInterval(function() {
			n++;
			readConsentFromCookie();
			if (n >= 20) clearInterval(t);
		}, 1000);
	});
	function getConsentIdFromCookie() {
		try {
			var cc = window.CookieConsent;
			if (cc && cc.getCookie) {
				var cookie = cc.getCookie();
				if (cookie && cookie.consentId) return String(cookie.consentId);
			}
		} catch (e) {}
		try {
			var raw = document.cookie.split(';').map(function(s) { return s.trim(); }).filter(function(s) { return s.indexOf('cc_ranknitro=') === 0; })[0];
			if (!raw) return null;
			var json = decodeURIComponent(raw.split('=').slice(1).join('='));
			var data = JSON.parse(json);
			return (data && data.consentId) ? String(data.consentId) : null;
		} catch (e) {}
		return null;
	}
	function fillConsentIdInModal() {
		var id = getConsentIdFromCookie() || '\u2014';
		function setPlaceholders() {
			var el1 = document.getElementById('cc-consent-id');
			var el2 = document.getElementById('cc-consent-id-pm');
			if (el1) el1.textContent = id;
			if (el2) el2.textContent = id;
			var root = document.getElementById('cc-main') || document.body;
			var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
			var node;
			while ((node = walker.nextNode())) {
				if (node.nodeValue && node.nodeValue.trim() === '\u2014') {
					var parent = node.parentElement;
					if (parent && (parent.closest('[id="cc-main"]') || parent.closest('.cm'))) {
						var container = parent.closest('small') || parent.closest('.cm__desc') || parent;
						if (container && (container.textContent.indexOf('Einwilligungs-ID') !== -1 || container.textContent === '\u2014')) {
							node.nodeValue = id;
						}
					}
				}
			}
		}
		setPlaceholders();
		setTimeout(setPlaceholders, 100);
		setTimeout(setPlaceholders, 400);
		setTimeout(setPlaceholders, 1000);
	}
	document.addEventListener('cc:onModalShow', fillConsentIdInModal);
	document.addEventListener('cc:onModalReady', fillConsentIdInModal);
	document.addEventListener('cc:onConsent', fillConsentIdInModal);
	if (typeof MutationObserver !== 'undefined') {
		var obs = new MutationObserver(function() { fillConsentIdInModal(); });
		obs.observe(document.body, { childList: true, subtree: true });
		setTimeout(function() {
			fillConsentIdInModal();
			obs.disconnect();
		}, 3000);
	}
})();
