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
							footer: '<a href="/datenschutz/">Datenschutz</a> · <a href="/impressum/">Impressum</a><br><small>Einwilligungs-ID: <span id="cc-consent-id">—</span></small>',
						},
						preferencesModal: {
							title: 'Cookie-Einstellungen',
							acceptAllBtn: 'Alle akzeptieren',
							acceptNecessaryBtn: 'Nur notwendige',
							savePreferencesBtn: 'Auswahl speichern',
							closeIconLabel: 'Schließen',
							sections: [
								{
									title: 'Notwendige Cookies',
									description:
										'Immer aktiv. Diese Cookies sind für den Betrieb der Website technisch erforderlich und können nicht deaktiviert werden. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG i. V. m. Art. 6 Abs. 1 lit. f DSGVO.',
									linkedCategory: 'necessary',
								},
								{
									title: 'Analyse',
									description:
										'Statistik-Cookies helfen uns zu verstehen, wie Besucher die Website nutzen. Sie werden nur mit Ihrer Einwilligung gesetzt. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TDDDG.',
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
								{
									title: 'Ihre Einwilligungs-ID',
									description: '<span id="cc-consent-id-pm">—</span>',
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