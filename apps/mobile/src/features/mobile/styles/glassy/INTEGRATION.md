# How to Apply Glassy Theme to Mobile App

## Method 1: Using CSS Classes

Add glassy classes to your existing components:

```tsx
// Example: Apply to a card
<div className="glass-card">
  <h2>Your Content</h2>
</div>

// Example: Apply to a button
<button className="glass-button">
  Click Me
</button>

// Example: Apply to an icon
<div className="glass-icon">
  <YourIcon />
</div>
```

## Method 2: Using React Components

Import and use the pre-built components:

```tsx
import { GlassCard } from './styles/glassy/components/glass-card';
import { GlassButton } from './styles/glassy/components/glass-button';
import { GlassIcon } from './styles/glassy/components/glass-icon';

// Use in your screens
<GlassCard>
  <h2>Glass Card</h2>
  <p>Your content here</p>
</GlassCard>

<GlassButton onClick={handleClick} variant="primary">
  Primary Button
</GlassButton>

<GlassIcon icon={<Star />} label="Favorites" />
```

## Method 3: Apply to Entire App Body

Add the glassy background to your main app:

```tsx
// In your main App.tsx or index.tsx
import './styles/mobile/styles.css';

function App() {
  return (
    <div className="glass-background">
      {/* Your app content */}
    </div>
  );
}
```

## Method 4: Theme Toggle (Optional)

Create a theme switcher:

```tsx
import { useState } from 'react';

function ThemeToggle() {
  const [isGlassy, setIsGlassy] = useState(false);

  return (
    <button onClick={() => setIsGlassy(!isGlassy)}>
      {isGlassy ? 'Disable Glassy' : 'Enable Glassy'}
    </button>
  );
}

// Apply conditionally
<div className={isGlassy ? 'glass-background' : ''}>
  {children}
</div>
```

## Available CSS Classes

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

## Example: Apply to Existing Screen

Before:
```tsx
<div className="bg-surface p-4 rounded-xl">
  <h2>Settings</h2>
</div>
```

After:
```tsx
<div className="glass-card p-4">
  <h2>Settings</h2>
</div>
```

## Customization

Edit `apps/mobile/src/features/mobile/styles/glassy/theme.json` to customize colors, or override CSS variables in your components:

```tsx
<div style={{
  '--glass-primary': '#your-color',
  '--glass-surface': 'rgba(255,255,255,0.15)',
} as React.CSSProperties}>
  <GlassCard>
    Custom styled card
  </GlassCard>
</div>
```

## Enable/Disable Theme

To disable the glassy theme, simply remove the import from mobile.css:

```css
/* Remove this line to disable */
@import "./glassy/styles.css";
```

Or comment it out:

```css
/* @import "./glassy/styles.css"; */
```
