/*╔══════════════╗*/
/*║  PARAMETERS  ║*/
/*╚══════════════╝*/

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const countdown = document.getElementById('countdownLabel');

const showDays = urlParams.has('showDays')
	? urlParams.get('showDays') === 'true'
	: true;
const showHours = urlParams.has('showHours')
	? urlParams.get('showHours') === 'true'
	: true;
const showMinutes = urlParams.has('showMinutes')
	? urlParams.get('showMinutes') === 'true'
	: true;
const showSeconds = urlParams.has('showSeconds')
	? urlParams.get('showSeconds') === 'true'
	: true;

const days = parseInt(urlParams.get('days')) || 0;
const hours = parseInt(urlParams.get('hours')) || 0;
const minutes = parseInt(urlParams.get('minutes')) || 0;
const seconds = parseInt(urlParams.get('seconds')) || 0;

const customMessage = urlParams.get('message') || '00:00:00:00';

const useConfetti = urlParams.get('confetti') === 'true';

const particleCount = parseInt(urlParams.get('particleCount')) || 100;
const angle = parseInt(urlParams.get('angle')) || 90;
const spread = parseInt(urlParams.get('spread')) || 45;
const originY = parseFloat(urlParams.get('originY')) || 0.6;
const flat = urlParams.get('flat') === 'true';

const useCustomEmoji = urlParams.get('useEmoji') === 'true';
const customEmoji = urlParams.get('emoji') || '🦄';
const customScalar = parseFloat(urlParams.get('scalar')) || 2;
const emoji = confetti.shapeFromText({ text: customEmoji, customScalar });

/*╔═════════════════╗*/
/*║  STYLE SETTING  ║*/
/*╚═════════════════╝*/

// Load custom font
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

function startCountdown() {
	let totalTime = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;

	const countdownInterval = setInterval(() => {
		if (totalTime <= 0) {
			clearInterval(countdownInterval);
			countdown.innerText = customMessage;

			if (useConfetti) {
				if (useCustomEmoji) {
					confetti({
						particleCount: particleCount,
						angle: angle,
						spread: spread,
						origin: { y: originY },
						shapes: [emoji],
						scalar: customScalar,
						flat: flat,
					});
				} else {
					confetti({
						particleCount: particleCount,
						angle: angle,
						spread: spread,
						origin: { y: originY },
						flat: flat,
					});
				}
			}
			return;
		}
		totalTime--;
		const displayDays = String(Math.floor(totalTime / (24 * 3600))).padStart(
			2,
			'0'
		);
		const displayHours = String(
			Math.floor((totalTime % (24 * 3600)) / 3600)
		).padStart(2, '0');
		const displayMinutes = String(Math.floor((totalTime % 3600) / 60)).padStart(
			2,
			'0'
		);
		const displaySeconds = String(totalTime % 60).padStart(2, '0');

		// Cascade the hide settings - if a unit is hidden, hide all larger units
		const effectiveShowDays =
			showDays && showHours && showMinutes && showSeconds;
		const effectiveShowHours = showHours && showMinutes && showSeconds;
		const effectiveShowMinutes = showMinutes && showSeconds;
		const effectiveShowSeconds = showSeconds;

		let display = '';
		if (effectiveShowDays) display += displayDays + ':';
		if (effectiveShowHours) display += displayHours + ':';
		if (effectiveShowMinutes) display += displayMinutes + ':';
		if (effectiveShowSeconds) display += displaySeconds;

		countdown.innerText = display.replace(/:$/, '');
	}, 1000);
}

startCountdown();
