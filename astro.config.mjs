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
			},
			language: {
				default: 'de',
				translations: {
					de: {
						consentModal: {
							title: 'Cookie-Einstellungen',
							description:
								'Wir verwenden Cookies, um die Nutzung der Website zu erleichtern und die Reichweite zu messen. Sie können alle Cookies akzeptieren oder nur die technisch notwendigen.',
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
									title: 'Notwendige Cookies',
									description:
										'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
									linkedCategory: 'necessary',
								},
								{
									title: 'Analyse-Cookies',
									description:
										'Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen (z. B. Statistiken). Sie werden nur mit Ihrer Zustimmung gesetzt.',
									linkedCategory: 'analytics',
								},
							],
						},
					},
				},
			},
			guiOptions: {
				consentModal: {
					layout: 'cloud',
					position: 'bottom center',
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