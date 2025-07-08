const Colors = {
    // Primary Colors
    primary: '#2563eb',        // Trust Blue - Main buttons, navigation, active states
    primaryDark: '#1d4ed8',    // Darker variant for pressed states
    primaryLight: '#3b82f6',   // Lighter variant for hover states
    text: '#1e293b',           // Deep Slate - Main text, headings, important content
    background: '#60a5fa',

    neutral1000: '#000000',
    neutral900: '#0f172a',
    neutral800: '#212c3f',
    neutral700: '#334155',
    neutral600: '#4b5b70',
    neutral500: '#64748b',
    neutral400: '#94a3b8',
    neutral300: '#cbd5e1',
    neutral200: '#e2e8f0',
    neutral100: '#f1f5f9',
    neutral50: '#f8fafc',
    neutral0: '#ffffff',

    // Secondary Colors
    secondary: '#60a5fa',      // Light Blue - Secondary buttons, info badges, accents
    success: '#059669',        // Success Green - Prices, success messages, good condition
    danger: '#dc2626',         // Alert Red - Errors, warnings, delete actions
    warning: '#d97706',        // Warm Orange - Special offers, hot deals, promotions

    // Background Colors
    background: '#f8fafc',     // Light Background - Main app background, containers
    surface: '#ffffff',        // Pure white - Card backgrounds, modals
    surfaceElevated: '#fefefe', // Slightly elevated surfaces

    // Text Colors
    textSecondary: '#64748b',  // Muted Gray - Secondary text, placeholders, inactive items
    textTertiary: '#94a3b8',   // Even lighter text for less important content
    textDisabled: '#cbd5e1',   // Disabled text color

    // Border Colors
    border: '#e2e8f0',         // Light Border - Default borders, dividers
    borderFocus: '#94a3b8',    // Focused input borders
    borderStrong: '#cbd5e1',   // Stronger borders for emphasis
    borderLight: '#f1f5f9',    // Very light borders for subtle separation

    // Shadow Colors
    shadow: 'rgba(0, 0, 0, 0.05)',      // Very light shadow for cards
    shadowMedium: 'rgba(0, 0, 0, 0.1)',  // Medium shadow for elevated components
    shadowStrong: 'rgba(0, 0, 0, 0.15)', // Strong shadow for modals, dropdowns
    shadowDark: 'rgba(0, 0, 0, 0.25)',   // Dark shadow for overlays

    // State Colors
    disabled: '#cbd5e1',       // Disabled state color

    // Accent Colors
    accent: '#fef3c7',         // Condition Yellow - Product condition badges, info highlights
    accentText: '#92400e',     // Text color for accent backgrounds
    premium: '#ede9fe',        // Premium Purple - Premium items, special collections
    premiumText: '#7c3aed',    // Text color for premium backgrounds

    // Semantic Colors (Alternative names for better context)
    price: '#059669',          // Same as success - for price displays
    sale: '#d97706',           // Same as warning - for sale/discount indicators
    available: '#059669',      // Same as success - for available items
    soldOut: '#dc2626',        // Same as danger - for sold out items

    // Overlay Colors
    overlay: 'rgba(30, 41, 59, 0.5)',        // Semi-transparent dark overlay
    overlayLight: 'rgba(30, 41, 59, 0.3)',   // Lighter overlay
    overlayStrong: 'rgba(30, 41, 59, 0.7)',  // Stronger overlay

    // Gradient colors (for backgrounds, buttons, etc.)
    gradientPrimary: ['#2563eb', '#1d4ed8'],
    gradientBackground: ['#f8fafc', '#e2e8f0'],
    gradientStart: ['#f8fafc', '#f1f5f9'],    // For app startup screens
    gradientSuccess: ['#059669', '#047857'],
};

export default Colors;