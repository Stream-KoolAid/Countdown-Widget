const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const countdown = document.getElementById('countdownLabel');

const days = parseInt(urlParams.get('days')) || 0;
const hours = parseInt(urlParams.get('hours')) || 0;
const minutes = parseInt(urlParams.get('minutes')) || 0;
const seconds = parseInt(urlParams.get('seconds')) || 0;

const showDays = urlParams.get('showDays') === 'true' || true;
const showHours = urlParams.get('showHours') === 'true' || true;
const showMinutes = urlParams.get('showMinutes') === 'true' || true;
const showSeconds = urlParams.get('showSeconds') === 'true' || true;

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

const fontSize = urlParams.get('fontSize') || '40px';
const fontFamily = urlParams.get('fontFamily') || 'Roboto, sans-serif';
const fontWeight = urlParams.get('fontWeight') || '600';
const textTransform = urlParams.get('textTransform') || 'uppercase';
const color = urlParams.get('color') || '#fff';
const textShadow =
	urlParams.get('textShadow') || '2px 2px 2px rgba(0, 0, 0, 0.5)';
const letterSpacing = urlParams.get('letterSpacing') || '0px';

countdown.style.fontSize = fontSize;
countdown.style.fontFamily = fontFamily;
countdown.style.fontWeight = fontWeight;
countdown.style.textTransform = textTransform;
countdown.style.color = color;
countdown.style.textShadow = textShadow;
countdown.style.letterSpacing = letterSpacing;

function loadFont(fontFamily) {
	const link = document.createElement('link');
	link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
		/ /g,
		'+'
	)}&display=swap`;
	link.rel = 'stylesheet';
	document.head.appendChild(link);
}
loadFont(fontFamily);

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
		const displayDays = showDays
			? String(Math.floor(totalTime / (24 * 3600))).padStart(2, '0')
			: '00';
		const displayHours = showHours
			? String(Math.floor((totalTime % (24 * 3600)) / 3600)).padStart(2, '0')
			: '00';
		const displayMinutes = showMinutes
			? String(Math.floor((totalTime % 3600) / 60)).padStart(2, '0')
			: '00';
		const displaySeconds = showSeconds
			? String(totalTime % 60).padStart(2, '0')
			: '00';
		countdown.innerText = `${showDays ? displayDays + ':' : ''}${
			showHours ? displayHours + ':' : ''
		}${showMinutes ? displayMinutes + ':' : ''}${
			showSeconds ? displaySeconds : ''
		}`.replace(/:$/, '');
	}, 1000);
}

startCountdown();
