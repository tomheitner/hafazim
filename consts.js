export const COLORS = {
    base100: '#FFF',
    base300: '#F4F3F3',
    base500: '#D9D9D9',

    primary: "rgba(10, 93, 51, 1)",
    secondary: "rgba(12, 116, 59, 1)",
    accent: "rgba(255, 215, 0, 1)",
    neutral: "rgba(51, 51, 51, 1)",
    highlight: "rgba(255, 255, 255, 1)",
    additional: "rgba(255, 69, 0, 1)"
    
}

export function colorOpacity(color, opacity) {
    let newColor = color.slice(0, -2)
    newColor += opacity
    newColor += ')'

    return newColor
}