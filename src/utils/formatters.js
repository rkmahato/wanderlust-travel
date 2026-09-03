/** Format a Unix timestamp to a readable time string */
export function formatTime(unixTimestamp) {
    return new Date(unixTimestamp * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}
/** Format temperature with degree symbol */
export function formatTemp(celsius) {
    return `${celsius}°C`;
}
/** Capitalise first letter of each word */
export function titleCase(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
/** Truncate a string to a maximum length, adding ellipsis */
export function truncate(str, maxLength) {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - 1) + '…';
}
/** Generate a friendly error message for display */
export function getErrorMessage(err) {
    if (err instanceof Error)
        return err.message;
    if (typeof err === 'string')
        return err;
    return 'An unexpected error occurred';
}
/** Clamp a number between min and max */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
/** Get a wind direction label from degrees */
export function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}
