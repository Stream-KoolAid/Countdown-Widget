/*╔══════════════╗*/
/*║  PARAMETERS  ║*/
/*╚══════════════╝*/

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const countdown = document.getElementById('countdownLabel');

const showUnits = {
	days: urlParams.get('showDays') !== 'false',
	hours: urlParams.get('showHours') !== 'false',
	minutes: urlParams.get('showMinutes') !== 'false',
	seconds: urlParams.get('showSeconds') !== 'false',
};

const timeValues = {
	days: parseInt(urlParams.get('days'), 10) || 0,
	hours: parseInt(urlParams.get('hours'), 10) || 0,
	minutes: parseInt(urlParams.get('minutes'), 10) || 0,
	seconds: parseInt(urlParams.get('seconds'), 10) || 0,
};

const customMessage = urlParams.get('message') || '00:00:00:00';
const useConfetti = urlParams.has('confetti')
	? urlParams.get('confetti') === 'true'
	: true;

const confettiOptions = {
	particleCount: parseInt(urlParams.get('particleCount'), 10) || 100,
	angle: parseInt(urlParams.get('angle'), 10) || 90,
	spread: parseInt(urlParams.get('spread'), 10) || 45,
	origin: { y: parseFloat(urlParams.get('originY')) || 0.6 },
	flat: urlParams.get('flat') === 'true',
};

const useCustomEmoji = urlParams.has('useEmoji')
	? urlParams.get('useEmoji') === 'true'
	: false;
const customEmoji = urlParams.get('emoji') || '🦄';
const emojiShape = confetti.shapeFromText({
	text: customEmoji,
	customScalar: parseFloat(urlParams.get('scalar')) || 2,
});

/*╔═════════════════╗*/
/*║  STYLE SETTINGS ║*/
/*╚═════════════════╝*/

// Load custom font
(function loadFont() {
	const rootStyles = getComputedStyle(document.documentElement);
	const fontFamily = rootStyles.getPropertyValue('font-family').trim();
	const fontName = fontFamily.replace(/['"]/g, '').split(',')[0].trim();

	if (fontName && fontName.toLowerCase() !== 'system-ui') {
		const link = document.createElement('link');
		link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
			fontName
		)}:100,300,400,500,700,900`;
		link.rel = 'stylesheet';
		document.head.appendChild(link);
	}
})();

/*╔═══════════════════╗*/
/*║  COUNTDOWN LOGIC  ║*/
/*╚═══════════════════╝*/

function startCountdown() {
	let totalTime =
		timeValues.days * 86400 +
		timeValues.hours * 3600 +
		timeValues.minutes * 60 +
		timeValues.seconds;

	const countdownInterval = setInterval(() => {
		if (totalTime <= 0) {
			clearInterval(countdownInterval);
			countdown.innerText = customMessage;

			if (useConfetti) {
				confetti({
					...confettiOptions,
					shapes: useCustomEmoji ? [emojiShape] : undefined,
				});
			}
			return;
		}

		totalTime--;

		const display = {
			days: String(Math.floor(totalTime / 86400)).padStart(2, '0'),
			hours: String(Math.floor((totalTime % 86400) / 3600)).padStart(2, '0'),
			minutes: String(Math.floor((totalTime % 3600) / 60)).padStart(2, '0'),
			seconds: String(totalTime % 60).padStart(2, '0'),
		};

		const visibleUnits = [
			showUnits.days && display.days,
			showUnits.hours && display.hours,
			showUnits.minutes && display.minutes,
			showUnits.seconds && display.seconds,
		].filter(Boolean);

		countdown.innerText = visibleUnits.join(':');
	}, 1000);
}

startCountdown();
