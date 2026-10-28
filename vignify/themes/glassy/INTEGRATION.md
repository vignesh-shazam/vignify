# How to Apply Glassy Theme to Mobile App

## Quick Start

### Step 1: Copy to Your Project
Copy the `glassy` folder to your mobile app's styles directory:
```
apps/mobile/src/features/mobile/styles/glassy/
```

### Step 2: Import CSS
Add this import to your main CSS file (e.g., `mobile.css`):
```css
@import "./glassy/styles.css";
```

### Step 3: Use the Classes
Apply glassy classes to your components:
```tsx
<div className="glass-card">Your content</div>
<button className="glass-button">Button</button>
<div className="glass-icon">Icon</div>
```

## Available Classes

- `.glass-card` - Translucent card with blur
- `.glass-button` - Glassy button
- `.glass-icon` - Glossy icon container
- `.glass-input` - Glassy input field
- `.glass-slider` - Glassy range slider
- `.glass-toggle` - Glassy toggle switch
- `.glass-notification` - Glassy notification
- `.glass-progress` - Glassy progress bar
- `.glass-badge` - Glassy badge
- `.glass-divider` - Glassy divider line
- `.glass-avatar` - Glassy avatar
- `.glass-chip` - Glassy chip/tag
- `.glass-background` - Full screen glassy background

## React Components

Import and use the pre-built components:
```tsx
import { GlassCard } from './glassy/components/glass-card';
import { GlassButton } from './glassy/components/glass-button';
import { GlassIcon } from './glassy/components/glass-icon';

<GlassCard>
  <h2>Glass Card</h2>
</GlassCard>

<GlassButton variant="primary">Primary Button</GlassButton>

<GlassIcon icon={<Star />} />
```

## Customization

Edit `theme.json` to customize colors, or override CSS variables in your components.

## Disable Theme

To disable, remove the import from your CSS:
```css
/* @import "./glassy/styles.css"; */
```
