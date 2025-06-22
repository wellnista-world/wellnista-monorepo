# Advertising Configuration System

This directory contains configuration files for the Wellnista app's advertising system.

## Files

### `advertising.ts`
Contains the main advertising configuration including:
- Advertising items with images, links, and translations
- Carousel configuration settings
- Helper functions for getting localized content

## How to Use

### Adding New Advertising Items

1. Open `advertising.ts`
2. Add a new item to the `advertisingConfig` array:

```typescript
{
  id: 6, // Unique ID
  image: "https://your-image-url.com/image.jpg",
  link: "/your-page-or-external-url",
  translations: {
    th: {
      title: "Thai Title",
      description: "Thai Description"
    },
    en: {
      title: "English Title", 
      description: "English Description"
    },
    zh: {
      title: "Chinese Title",
      description: "Chinese Description"
    },
    ja: {
      title: "Japanese Title",
      description: "Japanese Description"
    },
    ko: {
      title: "Korean Title",
      description: "Korean Description"
    }
  }
}
```

### Modifying Carousel Settings

Update the `carouselConfig` object in `advertising.ts`:

```typescript
export const carouselConfig = {
  autoSlideInterval: 4000, // Auto-slide interval in milliseconds
  transitionDuration: 500, // Transition duration in milliseconds
  height: "h-48", // Tailwind class for carousel height
  showNavigation: true, // Show navigation arrows
  showDots: true, // Show dot indicators
  showProgressBar: true, // Show progress bar
  showClickIndicator: true // Show "click to see more" indicator
};
```

### Using in Components

```typescript
import { getAdvertisingItems } from '../../config/advertising';

// In your component
const { locale } = useI18n();
const advertisingItems = getAdvertisingItems(locale);

// Use with AdvertisingCarousel component
<AdvertisingCarousel items={advertisingItems} />
```

### Customizing Carousel Behavior

You can override default settings when using the component:

```typescript
<AdvertisingCarousel 
  items={advertisingItems}
  autoSlideInterval={5000} // Override auto-slide interval
  showNavigation={false} // Hide navigation arrows
  showDots={true} // Show dots
  height="h-64" // Custom height
/>
```

## Benefits

- **Centralized Configuration**: All advertising content in one place
- **Easy Maintenance**: Update images, links, and text without touching components
- **Multi-language Support**: Built-in translation support
- **Flexible**: Configurable carousel behavior
- **Type Safety**: Full TypeScript support with interfaces

## Image Requirements

- Use high-quality images (recommended: 2070px width)
- Ensure good contrast for text overlay
- Use health/nutrition themed images
- Optimize for web (JPEG/WebP format)
- Consider mobile responsiveness

## Best Practices

1. **Keep descriptions concise** - 1-2 lines maximum
2. **Use clear call-to-actions** in titles
3. **Test all links** before deployment
4. **Ensure translations are accurate** for all languages
5. **Monitor performance** of external image URLs 