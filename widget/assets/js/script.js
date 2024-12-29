/*╔══════════════╗*/
/*║  PARAMETERS  ║*/
/*╚══════════════╝*/

// Constants and Configuration
const CONFIG = {
	DEFAULTS: {
		particleCount: 100,
		angle: 90,
		spread: 45,
		originY: 0.6,
		emojiScalar: 2,
		emoji: '🦄',
	},
	FONT: {
		LOAD_REFERENCE_SIZE: '16px', // Reference size for font loading API - doesn't affect display
	},
};

// DOM Elements
const countdown = document.getElementById('countdownLabel');
if (!countdown) throw new Error('Countdown element not found');

// URL Parameters Handler
class URLParamsHandler {
	constructor() {
		this.params = new URLSearchParams(window.location.search);
	}

	getBoolean(key, defaultValue = false) {
		return this.params.has(key)
			? this.params.get(key) === 'true'
			: defaultValue;
	}

	getNumber(key, defaultValue) {
		return parseInt(this.params.get(key), 10) || defaultValue;
	}

	getString(key, defaultValue) {
		return this.params.get(key) || defaultValue;
	}
}

const params = new URLParamsHandler();

// Settings
const settings = {
	fontFamily: params.getString('fontFamily', null),
	showUnits: {
		days: params.getBoolean('showDays', true),
		hours: params.getBoolean('showHours', true),
		minutes: params.getBoolean('showMinutes', true),
		seconds: params.getBoolean('showSeconds', true),
	},
	timeValues: {
		days: params.getNumber('days', 0),
		hours: params.getNumber('hours', 0),
		minutes: params.getNumber('minutes', 0),
		seconds: params.getNumber('seconds', 0),
	},
	customMessage: params.getString('message', CONFIG.DEFAULTS.message),
	useConfetti: params.getBoolean('confetti', false),
	confettiOptions: {
		particleCount: params.getNumber(
			'particleCount',
			CONFIG.DEFAULTS.particleCount
		),
		angle: params.getNumber('angle', CONFIG.DEFAULTS.angle),
		spread: params.getNumber('spread', CONFIG.DEFAULTS.spread),
		origin: {
			y: parseFloat(params.getString('originY', CONFIG.DEFAULTS.originY)),
		},
		flat: params.getBoolean('flat', false),
	},
	useCustomEmoji: params.getBoolean('useEmoji', false),
	customEmoji: params.getString('emoji', CONFIG.DEFAULTS.emoji),
	emojiScalar: parseFloat(
		params.getString('scalar', CONFIG.DEFAULTS.emojiScalar)
	),
};

// Font Loader
class FontLoader {
	static async load(fontFamily) {
		if (!fontFamily) return;

		const fontFamilyValue = `"${fontFamily}", serif`;
		document.documentElement.style.setProperty(
			'--font-family',
			fontFamilyValue
		);

		const link = document.createElement('link');
		link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
			fontFamily
		)}:100,300,400,500,700,900`;
		link.rel = 'stylesheet';
		document.head.appendChild(link);

		// Wait for font to load using a reference size (doesn't affect display)
		try {
			await document.fonts.load(
				`${CONFIG.FONT.LOAD_REFERENCE_SIZE} ${fontFamily}`
			);
		} catch (error) {
			console.warn(`Failed to load font: ${fontFamily}`, error);
		}
	}
}

// Countdown Manager
class CountdownManager {
	constructor(settings) {
		this.settings = settings;
		this.totalTime = this.calculateTotalTime();
		this.emojiShape = settings.useCustomEmoji
			? confetti.shapeFromText({
					text: settings.customEmoji,
					scalar: settings.emojiScalar,
			  })
			: null;
		this.defaultMessage = this.generateDefaultMessage();
	}

	calculateTotalTime() {
		const { days, hours, minutes, seconds } = this.settings.timeValues;
		return days * 86400 + hours * 3600 + minutes * 60 + seconds;
	}

	formatTime(totalSeconds) {
		const days = Math.floor(totalSeconds / 86400);
		const hours = Math.floor((totalSeconds % 86400) / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		const display = {
			days: String(days).padStart(2, '0'),
			hours: String(hours).padStart(2, '0'),
			minutes: String(minutes).padStart(2, '0'),
			seconds: String(seconds).padStart(2, '0'),
		};

		const visibleUnits = [
			this.settings.showUnits.days && display.days,
			this.settings.showUnits.hours && display.hours,
			this.settings.showUnits.minutes && display.minutes,
			this.settings.showUnits.seconds && display.seconds,
		].filter(Boolean);

		return visibleUnits.join(':');
	}

	triggerConfetti() {
		if (!this.settings.useConfetti) return;

		confetti({
			...this.settings.confettiOptions,
			shapes: this.settings.useCustomEmoji ? [this.emojiShape] : undefined,
			scalar: this.settings.useCustomEmoji
				? this.settings.emojiScalar
				: undefined,
		});
	}

	generateDefaultMessage() {
		const units = [];
		if (this.settings.showUnits.days) units.push('00');
		if (this.settings.showUnits.hours) units.push('00');
		if (this.settings.showUnits.minutes) units.push('00');
		if (this.settings.showUnits.seconds) units.push('00');
		return units.join(':');
	}

	start() {
		const updateDisplay = () => {
			if (this.totalTime <= 0) {
				countdown.innerText =
					this.settings.customMessage === CONFIG.DEFAULTS.message
						? this.defaultMessage
						: this.settings.customMessage;
				this.triggerConfetti();
				return false;
			}

			countdown.innerText = this.formatTime(this.totalTime);
			this.totalTime--;
			return true;
		};

		// Initial update
		if (updateDisplay()) {
			const interval = setInterval(() => {
				if (!updateDisplay()) {
					clearInterval(interval);
				}
			}, 1000);
		}
	}
}

// Initialize
async function init() {
	try {
		await FontLoader.load(settings.fontFamily);
		const countdownManager = new CountdownManager(settings);
		countdownManager.start();
	} catch (error) {
		console.error('Failed to initialize countdown:', error);
		countdown.innerText = 'Error loading countdown';
	}
}

init();
