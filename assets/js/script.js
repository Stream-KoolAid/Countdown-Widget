// Constants
const FONT_API_URL =
	'https://gist.githubusercontent.com/blushell/cf1e432b65f5c3a3eb1e30508fb584a4/raw/59f99da9d53aac79da742ebca7aab7121dca66cf/fonts.json';
const DEFAULT_CONFETTI_OPTIONS = {
	particleCount: 100,
	angle: 90,
	spread: 45,
	originY: 0.6,
	flat: false,
};

// Utility Functions
const debounce = (fn, delay = 300) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), delay);
	};
};

const showNotification = (message, type = 'success') => {
	const notification = document.createElement('div');
	notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
	notification.textContent = message;
	document.body.appendChild(notification);
	setTimeout(() => notification.remove(), 3000);
};

// Font Loading
async function loadFonts() {
	try {
		const response = await fetch(FONT_API_URL);
		if (!response.ok) throw new Error('Failed to fetch fonts');

		const data = await response.json();
		const fontFamily = document.getElementById('fontFamily');

		data.fonts.forEach((fontName) => {
			const option = document.createElement('option');
			option.value = fontName;
			option.textContent = fontName;
			fontFamily.appendChild(option);
		});
	} catch (error) {
		console.error('Error loading fonts:', error);
		showNotification('Failed to load fonts. Please try again later.', 'danger');
	}
}

// Settings Visibility Manager
class SettingsManager {
	constructor() {
		this.settingsMap = [
			{ checkbox: 'confetti', section: 'confettiSettings' },
			{ checkbox: 'customStyling', section: 'stylingSettings' },
		];

		this.init();
	}

	init() {
		this.settingsMap.forEach(({ checkbox, section }) => {
			const checkboxElement = document.querySelector(
				`input[name="${checkbox}"]`
			);
			const sectionElement = document.getElementById(section);

			if (!checkboxElement || !sectionElement) return;

			this.toggleVisibility(checkboxElement, sectionElement);
			checkboxElement.addEventListener('change', () => {
				this.toggleVisibility(checkboxElement, sectionElement);
				sectionElement.setAttribute('aria-expanded', checkboxElement.checked);
			});
		});
	}

	toggleVisibility(checkbox, section) {
		section.style.display = checkbox.checked ? 'block' : 'none';
	}
}

// Widget URL Generator
class WidgetURLGenerator {
	constructor(form) {
		this.form = form;
		this.baseUrl = new URL(
			'widget/countdown.html',
			window.location.origin + window.location.pathname
		).href;
	}

	generateParams() {
		const formData = new FormData(this.form);
		const params = new URLSearchParams();

		// Add time parameters
		['days', 'hours', 'minutes', 'seconds'].forEach((param) => {
			const value = this.form.elements[param]?.value;
			if (value) {
				if (value === '-1') {
					params.append(
						`show${param.charAt(0).toUpperCase() + param.slice(1)}`,
						'false'
					);
				} else {
					params.append(param, value);
				}
			}
		});

		// Add message if provided
		const message = this.form.elements['message']?.value;
		if (message) params.append('message', message);

		// Add fontFamily
		const fontFamily = this.form.elements['fontFamily']?.value;
		if (fontFamily) params.append('fontFamily', fontFamily);

		// Add confetti parameters
		if (this.form.elements['confetti']?.checked) {
			params.append('confetti', 'true');

			Object.entries(DEFAULT_CONFETTI_OPTIONS).forEach(
				([key, defaultValue]) => {
					const value = this.form.elements[key]?.value;
					if (value && value !== defaultValue.toString()) {
						params.append(key, value);
					}
				}
			);

			if (this.form.elements['useEmoji']?.checked) {
				params.append('useEmoji', 'true');

				const emoji = this.form.elements['emoji']?.value;
				const scalar = this.form.elements['scalar']?.value;

				if (emoji) params.append('emoji', emoji);
				if (scalar) params.append('scalar', scalar);
			}
		}

		return params;
	}

	generateURL() {
		const params = this.generateParams();
		return `${this.baseUrl}?${params.toString()}`;
	}
}

// CSS Generator
class CSSGenerator {
	constructor(form) {
		this.form = form;
	}

	generateCSS() {
		if (!this.form.elements['customStyling'].checked) return '';

		const cssProperties = {
			'font-size': this.form.elements['fontSize']?.value,
			'font-weight': this.form.elements['fontWeight']?.value,
			'text-color': this.form.elements['color']?.value,
			'letter-spacing': this.form.elements['letterSpacing']?.value,
			'text-transform': this.form.elements['textTransform']?.value,
			'text-shadow': this.form.elements['textShadow']?.value,
		};

		const cssLines = Object.entries(cssProperties)
			.filter(([prop, value]) => {
				if (!value) return false;
				if (prop === 'text-color' && value === '#ffffff') return false;
				if (prop === 'font-weight' && value === 'Select Weight') return false;
				if (prop === 'text-transform' && value === 'none') return false;
				return true;
			})
			.map(([prop, value]) => `  --${prop}: ${value};`);

		return cssLines.length ? `:root {\n${cssLines.join('\n')}\n}` : '';
	}
}

// Widget Display Manager
class WidgetDisplayManager {
	constructor(form) {
		this.form = form;
		this.urlGenerator = new WidgetURLGenerator(form);
		this.cssGenerator = new CSSGenerator(form);
		this.previewFrame = document.getElementById('previewFrame');
		this.resultSection = document.querySelector('.result-section');

		this.updateDisplay = debounce(this.updateDisplay.bind(this));
	}

	updateDisplay() {
		try {
			// Generate URL and update preview
			const finalUrl = this.urlGenerator.generateURL();
			this.previewFrame.src = finalUrl;

			// Update URL display
			document.getElementById('generatedUrl').textContent = finalUrl;

			// Update CSS display
			const css = this.cssGenerator.generateCSS();
			document.getElementById('generatedCSS').textContent = css;

			// Show results section
			this.resultSection.style.display = 'block';

			// Inject CSS into iframe
			this.previewFrame.addEventListener('load', () => this.injectCSS(css));
		} catch (error) {
			console.error('Error updating widget display:', error);
			showNotification('Failed to update widget display', 'danger');
		}
	}

	injectCSS(css) {
		if (!this.form.elements['customStyling']?.checked) return;

		try {
			const iframeDocument =
				this.previewFrame.contentDocument ||
				this.previewFrame.contentWindow.document;
			let styleElement = iframeDocument.querySelector('#injectedStyles');

			if (!styleElement) {
				styleElement = iframeDocument.createElement('style');
				styleElement.id = 'injectedStyles';
				iframeDocument.head.appendChild(styleElement);
			}

			styleElement.textContent = css;
		} catch (error) {
			console.error('Error injecting CSS:', error);
			showNotification('Failed to apply custom styles', 'warning');
		}
	}
}

// Clipboard Manager
class ClipboardManager {
	static async copyToClipboard(elementId) {
		const element = document.getElementById(elementId);
		const text = element.textContent;
		const button = element.nextElementSibling;
		const originalText = button.textContent;

		try {
			await navigator.clipboard.writeText(text);
			button.textContent = 'Copied!';
			showNotification('Copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy:', error);
			button.textContent = 'Failed to copy';
			showNotification('Failed to copy to clipboard', 'danger');
		} finally {
			setTimeout(() => {
				button.textContent = originalText;
			}, 2000);
		}
	}
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
	// Load fonts
	loadFonts();

	// Initialize settings visibility
	new SettingsManager();

	// Initialize form handling
	const form = document.getElementById('widgetForm');
	if (!form) {
		console.error('Widget form not found');
		return;
	}

	const displayManager = new WidgetDisplayManager(form);

	// Add input event listeners
	form.querySelectorAll('input, select').forEach((element) => {
		element.addEventListener('input', () => displayManager.updateDisplay());
		element.addEventListener('change', () => displayManager.updateDisplay());
	});

	// Handle form submission
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		displayManager.updateDisplay();
	});

	// Initialize clipboard functionality
	window.copyToClipboard = ClipboardManager.copyToClipboard;

	// Initial preview
	displayManager.updateDisplay();
});
