# Countdown Widget for OBS ⏳

Easily add a customizable countdown timer to your OBS streams! This widget helps you create an eye-catching and interactive countdown overlay to build excitement during your streams. Perfect for events, starting soon screens, or special announcements.

## Features ✨

- Fully customizable countdown duration.
- Control over font size, family, and style.
- Add custom colors, shadows, and spacing.
- Display a custom message when the countdown ends.
- Optional confetti effects for celebrations.
- Use custom emojis for a unique touch.
- Works seamlessly with OBS browser sources.

## Quick Setup ⚙️

1. **Download or Use Hosted Version**:
   - Download the `index.html` file from this repository and host it on your server or use it locally in OBS.
   - Alternatively, use the hosted version at: [Countdown Widget Hosted Version](https://yourwebsite.com).
2. **Add to OBS**:
   - Open OBS. 📺
   - Add a **Browser Source** to your scene. 🔄
   - Set the URL to the hosted version or your local file path.
3. **Customize**:
   - Use our [Quick Setup Page](https://yourwebsite.com/setup) to easily configure the widget without manual URL editing. 💡

## CSS Customization 🎨

The following font-related properties can now be configured through root CSS variables in your stylesheet or within OBS's custom CSS settings:

```css
:root {
    --letter-spacing: 0px;
    --font-size: 40px;
    --font-weight: 600;
    --text-transform: uppercase;
    --text-color: #fff;
    --text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);
}
```

### List of Root CSS Variables

| **Variable**          | **Description**                            |
|-----------------------|--------------------------------------------|
| `--letter-spacing`    | Letter spacing for the countdown label.    |
| `--font-size`         | Font size for the countdown label.         |
| `--font-weight`       | Font weight for the countdown label.       |
| `--text-transform`    | Text transformation for the countdown text.|
| `--text-color`        | Text color for the countdown label.        |
| `--text-shadow`       | Text shadow for the countdown label.       |

## URL Customization ✍️

### List of Query Parameters

| **Category**         | **Parameter**      | **Description**                                    |
|----------------------|--------------------|--------------------------------------------------|
| **Font Settings**    | `fontFamily`       | Font family for the countdown label.             |
| **Time Parameters**  | `days`             | Number of days for the countdown.                |
|                      | `hours`            | Number of hours for the countdown.               |
|                      | `minutes`          | Number of minutes for the countdown.             |
|                      | `seconds`          | Number of seconds for the countdown.             |
| **Display Control**  | `showDays`         | Set to 'true' to display days (default is true).  |
|                      | `showHours`        | Set to 'true' to display hours (default is true). |
|                      | `showMinutes`      | Set to 'true' to display minutes (default is true).|
|                      | `showSeconds`      | Set to 'true' to display seconds (default is true).|
| **Custom Message**   | `message`          | Custom message to display when the countdown ends.|
| **Confetti Settings**| `confetti`         | Set to 'true' to enable confetti effect.          |
|                      | `particleCount`    | Number of confetti particles.                     |
|                      | `angle`            | Angle of the confetti.                            |
|                      | `spread`           | Spread of the confetti.                           |
|                      | `originY`          | Vertical origin of the confetti.                 |
|                      | `flat`             | Set to 'true' for flat confetti.                 |
| **Emoji Settings**   | `useEmoji`         | Set to 'true' to enable custom emoji.            |
|                      | `emoji`            | Custom emoji to display.                         |
|                      | `scalar`           | Custom scalar value for the emoji.               |

### Example URL 🔗

```text
https://yourwebsite.com?days=1&hours=2&minutes=30&seconds=15&showDays=true&showHours=true&showMinutes=true&showSeconds=true&message=Countdown%20Started!&confetti=true&particleCount=150&angle=75&spread=60&originY=0.5&flat=false&fontFamily=Arial&useEmoji=true&emoji=🎉&scalar=3
```

## Contributing ✨

We welcome contributions! Feel free to submit issues or pull requests to help improve this project.

## License 🔒

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy streaming! 🎮 If you encounter any issues or have suggestions, please let us know. 📢
