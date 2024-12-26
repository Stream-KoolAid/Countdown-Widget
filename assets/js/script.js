async function loadFonts() {
	try {
		const response = await fetch('./assets/fonts.json');
		const data = await response.json();

		const fontSelect = document.getElementById('fontSelect');

		data.fonts.forEach((fontName) => {
			const option = document.createElement('option');
			option.value = fontName;
			option.textContent = fontName;
			fontSelect.appendChild(option);
		});
	} catch (error) {
		console.error('Error loading fonts:', error);
	}
}

document.addEventListener('DOMContentLoaded', loadFonts);
