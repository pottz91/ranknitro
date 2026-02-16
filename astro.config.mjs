// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import cookieconsent from '@jop-software/astro-cookieconsent';

// https://astro.build/config
export default defineConfig({
	site: 'https://ranknitro.de',
	integrations: [
		mdx(),
		sitemap(),
		cookieconsent({
			mode: 'opt-in',
			hideFromBots: true,
			disablePageInteraction: true,
			cookie: {
				name: 'cc_ranknitro',
				expiresAfterDays: 182,
			},
			categories: {
				necessary: {
					readOnly: true,
				},
				analytics: {
					enabled: false,
				},
				marketing: {
					enabled: false,
				},
				'externe-dienste': {
					enabled: false,
				},
				'session-analyse': {
					enabled: false,
				},
			},
			language: {
				default: 'de',
				translations: {
					de: {
						consentModal: {
							title: 'Cookie-Einstellungen',
							description:
								'Wir verwenden technisch notwendige Cookies. Analyse- und Statistik-Cookies setzen wir nur mit Ihrer Einwilligung.',
							acceptAllBtn: 'Alle akzeptieren',
							acceptNecessaryBtn: 'Nur notwendige',
							showPreferencesBtn: 'Einstellungen',
							footer: '<a href="/datenschutz/">Datenschutz</a> · <a href="/impressum/">Impressum</a>',
						},
						preferencesModal: {
							title: 'Cookie-Einstellungen',
							acceptAllBtn: 'Alle akzeptieren',
							acceptNecessaryBtn: 'Nur notwendige',
							savePreferencesBtn: 'Auswahl speichern',
							closeIconLabel: 'Schließen',
							sections: [
								{
									title: 'Notwendige Dienste',
									description:
										'<strong>Bunny.net CDN (Auslieferung von Schriftarten)</strong><br>Anbieter: Bunny.net, BunnyWay d.o.o., Cesta komandanta Staneta 4A, 1215 Medvode, Slowenien (EU).<br><br>Wir nutzen Bunny.net als Content Delivery Network (CDN) zur technisch sicheren und performanten Auslieferung von Schriftarten und statischen Inhalten. Beim Aufruf der Website wird die IP-Adresse an Server von Bunny übertragen, um die Inhalte bereitzustellen. Es erfolgt keine Profilbildung und keine Nutzung zu Marketingzwecken.<br><br>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, § 25 Abs. 2 Nr. 2 TDDDG (technisch erforderlich). Speicherdauer: Server-Logdaten werden gemäß den technischen Erforderlichkeiten des Anbieters verarbeitet und regelmäßig gelöscht.',
									linkedCategory: 'necessary',
								},
								{
									title: 'Analyse / Statistik',
									description:
										'<strong>Rybbit Analytics (Self-Hosted)</strong><br>Anbieter: Self-Hosted auf eigenem VPS, Hostinger International Ltd., EU-Serverstandort.<br><br>Wir nutzen das Webanalyse-Tool Rybbit zur statistischen Auswertung der Nutzung unserer Website. Die Analyse dient ausschließlich der Verbesserung unseres Online-Angebots. Es werden keine IP-Adressen gespeichert. Es werden keine dauerhaften Identifier oder Geräte-Fingerprints eingesetzt. Es erfolgt keine Erstellung personenbezogener Nutzerprofile. Die Verarbeitung erfolgt ausschließlich nach Ihrer Einwilligung.<br><br>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG. Speicherdauer: maximal 12 Monate.',
									linkedCategory: 'analytics',
								},
								{
									title: 'Marketing',
									description:
										'Marketing-Cookies werden nur mit Ihrer Einwilligung gesetzt und können für zielgruppenspezifische Anzeigen genutzt werden. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TDDDG.',
									linkedCategory: 'marketing',
								},
								{
									title: 'Externe Dienste',
									description:
										'Inhalte oder Funktionen von Drittanbietern (z. B. Karten, Videos) werden nur mit Ihrer Einwilligung geladen. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TDDDG.',
									linkedCategory: 'externe-dienste',
								},
								{
									title: 'Session-Analyse',
									description:
										'Besonders eingriffsintensiv: z. B. Aufzeichnung von Sitzungen, Heatmaps, Verhaltensanalyse. Nur mit Ihrer ausdrücklichen Einwilligung. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TDDDG.',
									linkedCategory: 'session-analyse',
								},
							],
						},
					},
				},
			},
			guiOptions: {
				consentModal: {
					layout: 'cloud',
					position: 'middle center',
					equalWeightButtons: true,
					flipButtons: false,
				},
				preferencesModal: {
					layout: 'box',
					position: 'right',
					equalWeightButtons: true,
					flipButtons: false,
				},
			},
		}),
	],
});