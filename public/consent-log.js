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
	var STORAGE_KEY = 'rn_consent_id';
	function generateConsentId() {
		var hex = '0123456789abcdef';
		var s = '';
		for (var i = 0; i < 36; i++) {
			if (i === 8 || i === 13 || i === 18 || i === 23) s += '-';
			else if (i === 14) s += '4';
			else s += hex[Math.floor(Math.random() * 16)];
		}
		return s;
	}
	function getOrCreateConsentId() {
		try {
			var stored = sessionStorage.getItem(STORAGE_KEY);
			if (stored && stored.length > 10) return stored;
		} catch (e) {}
		try {
			var cc = window.CookieConsent;
			if (cc && cc.getCookie) {
				var cookie = cc.getCookie();
				if (cookie && cookie.consentId) return String(cookie.consentId);
			}
		} catch (e) {}
		try {
			var raw = document.cookie.split(';').map(function(s) { return s.trim(); }).filter(function(s) { return s.indexOf('cc_ranknitro=') === 0; })[0];
			if (raw) {
				var data = JSON.parse(decodeURIComponent(raw.split('=').slice(1).join('=')));
				if (data && data.consentId) return String(data.consentId);
			}
		} catch (e) {}
		var id = generateConsentId();
		try { sessionStorage.setItem(STORAGE_KEY, id); } catch (e) {}
		return id;
	}
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
		var consentId = getOrCreateConsentId();
		try {
			var cc = window.CookieConsent;
			if (cc && cc.getCookie && cc.getUserPreferences) {
				var cookie = cc.getCookie();
				var prefs = cc.getUserPreferences();
				sendPayload({
					consentId: consentId,
					consentTimestamp: cookie.consentTimestamp || new Date().toISOString(),
					lastConsentTimestamp: cookie.lastConsentTimestamp || cookie.consentTimestamp || new Date().toISOString(),
					acceptType: prefs.acceptType,
					acceptedCategories: prefs.acceptedCategories,
					rejectedCategories: prefs.rejectedCategories,
					languageCode: (cookie && cookie.languageCode) ? cookie.languageCode : 'de',
					revision: (cookie && cookie.revision) != null ? cookie.revision : 0,
					url: window.location.href,
				});
				return;
			}
		} catch (e) {}
		readConsentFromCookie(consentId);
	}
	function readConsentFromCookie(consentIdFallback) {
		var consentId = consentIdFallback || getOrCreateConsentId();
		try {
			var raw = document.cookie.split(';').map(function(s) { return s.trim(); }).filter(function(s) { return s.indexOf('cc_ranknitro=') === 0; })[0];
			if (!raw) return;
			var json = decodeURIComponent(raw.split('=').slice(1).join('='));
			var data = JSON.parse(json);
			if (!data.consentTimestamp) return;
			var accepted = data.categories || [];
			var rejected = allCats.filter(function(c) { return accepted.indexOf(c) === -1; });
			var acceptType = accepted.length >= allCats.length ? 'all' : (accepted.length <= 1 && accepted[0] === 'necessary' ? 'necessary' : 'custom');
			sendPayload({
				consentId: consentId,
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
	function getConsentIdForDisplay() {
		return getOrCreateConsentId();
	}
	try { window.rnGetConsentIdForDisplay = getConsentIdForDisplay; } catch (e) {}
	var fillConsentIdTimer = null;
	function fillConsentIdInModal() {
		if (fillConsentIdTimer) clearTimeout(fillConsentIdTimer);
		fillConsentIdTimer = setTimeout(function() {
			fillConsentIdTimer = null;
			try {
				var id = getConsentIdForDisplay() || '\u2014';
				function setPlaceholders() {
					try {
						var el1 = document.getElementById('cc-consent-id');
						var el2 = document.getElementById('cc-consent-id-pm');
						if (el1) el1.textContent = id;
						if (el2) el2.textContent = id;
						var root = document.getElementById('cc-main');
						if (!root) return;
						var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
						var toReplace = [];
						var node;
						while ((node = walker.nextNode())) {
							if (node.nodeValue && node.nodeValue.trim() === '\u2014') {
								var parent = node.parentElement;
								if (!parent) continue;
								var container = parent.closest('small') || parent.closest('.cm__desc') || parent;
								if (container && (container.textContent.indexOf('Einwilligungs-ID') !== -1 || container.textContent === '\u2014')) {
									toReplace.push(node);
								}
							}
						}
						for (var i = 0; i < toReplace.length; i++) {
							toReplace[i].nodeValue = id;
						}
					} catch (e) {}
				}
				setPlaceholders();
				setTimeout(setPlaceholders, 150);
				var footerEl = document.getElementById('rn-consent-id');
				if (footerEl) footerEl.textContent = id;
			} catch (e) {}
		}, 50);
	}
	document.addEventListener('DOMContentLoaded', function() {
		setTimeout(function() {
			var el = document.getElementById('rn-consent-id');
			if (el) el.textContent = getConsentIdForDisplay() || '\u2014';
		}, 300);
		setTimeout(function() {
			var el = document.getElementById('rn-consent-id');
			if (el) el.textContent = getConsentIdForDisplay() || '\u2014';
		}, 2000);
	});
	document.addEventListener('cc:onModalShow', fillConsentIdInModal);
	document.addEventListener('cc:onModalReady', fillConsentIdInModal);
	document.addEventListener('cc:onConsent', fillConsentIdInModal);
})();
