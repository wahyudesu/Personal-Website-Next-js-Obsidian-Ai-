# Website Optimization Guide

Dokumentasi lengkap optimasi yang telah diterapkan pada website ini untuk meningkatkan performa, kecepatan loading, dan pengalaman pengguna.

## 📊 Ringkasan Optimasi

Optimasi yang diterapkan mencakup:
- ✅ Lazy Loading untuk Images
- ✅ Priority Loading untuk Critical Assets
- ✅ Placeholder Blur untuk Images
- ✅ Dynamic Imports untuk Heavy Components
- ✅ Next.js Image Optimization
- ✅ Preconnect & DNS Prefetch
- ✅ Modern Image Formats (AVIF, WebP)

---

## 🖼️ Image Optimization

### 1. **Custom Image Component** (`components/Image.tsx`)

Component image kustom dengan fitur:
- **Lazy Loading** default untuk semua gambar
- **Blur Placeholder** untuk smooth loading experience
- **Responsive Sizes** untuk berbagai ukuran layar
- **Quality Control** (default 75%)
- **Smart Detection** untuk external images dan SVG

```tsx
<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  // Otomatis lazy load dengan blur placeholder
/>
```

### 2. **Priority Loading untuk Critical Images**

Images yang penting untuk First Contentful Paint (FCP) menggunakan priority loading:

#### **Banner Images** (`layouts/PostBanner.tsx`)
```tsx
<Image
  src={displayImage}
  alt={title}
  fill
  priority // Load immediately
  sizes="100vw"
  quality={85}
/>
```

#### **Avatar Images** (`layouts/AuthorLayout.tsx`)
```tsx
<Image
  src={avatar}
  alt="avatar"
  width={192}
  height={192}
  priority // Load immediately
  sizes="192px"
  quality={90}
/>
```

### 3. **Lazy Loading untuk Non-Critical Images**

Images yang tidak critical menggunakan lazy loading:

#### **Project Cards** (`app/projects/ProjectCard.tsx`)
```tsx
<Image
  src={project.image}
  alt={project.name}
  fill
  loading="lazy"
  placeholder="blur"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  quality={75}
/>
```

#### **Resource Grid** (`app/resources/ResourceGrid.tsx`)
- Lazy loading untuk semua resource images
- Blur placeholder untuk smooth transitions
- Responsive sizes berdasarkan viewport

#### **Music Player** (`components/MusicPlayer.tsx`)
- Lazy loading untuk album thumbnails
- Optimized sizes (42px, 34px)
- Quality 75-80% untuk balance size/quality

---

## 🚀 Component Optimization

### 1. **Dynamic Imports untuk Heavy Components**

Component yang tidak diperlukan saat initial load menggunakan dynamic imports:

#### **LazyComponents Wrapper** (`components/LazyComponents.tsx`)
```tsx
// Music Player - hanya load saat drawer dibuka
export const LazyMusicPlayer = dynamic(() => import('./MusicPlayer'), {
  loading: () => <div className="h-40 animate-pulse" />,
  ssr: false,
})

// Comments - lazy load dengan skeleton
export const LazyComments = dynamic(() => import('./Comments'), {
  loading: () => <div className="h-40 animate-pulse" />,
  ssr: false,
})

// Analytics - no SSR, load after hydration
export const LazyAnalytics = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  { ssr: false }
)
```

### 2. **DrawerNav Optimization** (`components/navigation/DrawerNav.tsx`)
```tsx
const MusicPlayer = dynamic(() => import('../MusicPlayer'), {
  loading: () => <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[16px]" />,
  ssr: false,
});
```

Benefits:
- Reduce initial bundle size
- Faster Time to Interactive (TTI)
- Better First Contentful Paint (FCP)

---

## ⚙️ Next.js Configuration

### **Image Optimization Settings** (`next.config.js`)

```javascript
images: {
  // Modern formats dengan fallback otomatis
  formats: ['image/avif', 'image/webp'],

  // Device sizes untuk responsive images
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

  // Image sizes untuk fixed images
  imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],

  // Cache images selama 30 hari
  minimumCacheTTL: 60 * 60 * 24 * 30,

  // Remote patterns untuk external images
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
    {
      protocol: 'https',
      hostname: '**.vercel-storage.com',
    },
    {
      protocol: 'https',
      hostname: '**.public.blob.vercel-storage.com',
    },
  ],
}
```

**Benefits:**
- AVIF format: 50% lebih kecil dari JPEG
- WebP format: 30% lebih kecil dari JPEG
- Automatic format selection berdasarkan browser support
- Responsive images dengan srcset otomatis
- 30 days browser cache untuk images

---

## 🌐 Network Optimization

### **Resource Hints** (`app/layout.tsx`)

```tsx
{/* Preconnect - establish early connection */}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />

{/* DNS Prefetch - resolve DNS early */}
<link rel="dns-prefetch" href="https://analytics.umami.is" />
<link rel="dns-prefetch" href="https://app.posthog.com" />
<link rel="dns-prefetch" href="https://giscus.app" />
```

**Benefits:**
- Faster connection establishment
- Reduced DNS lookup time
- Better perceived performance

---

## 📈 Performance Metrics Target

Dengan optimasi ini, target metrics yang diharapkan:

| Metric | Target | Description |
|--------|--------|-------------|
| **FCP** | < 1.8s | First Contentful Paint |
| **LCP** | < 2.5s | Largest Contentful Paint |
| **TTI** | < 3.8s | Time to Interactive |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **FID** | < 100ms | First Input Delay |

---

## 🛠️ Best Practices

### **Menggunakan Images**

```tsx
// ✅ GOOD - Critical image with priority
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  sizes="100vw"
/>

// ✅ GOOD - Non-critical image with lazy loading
<Image
  src="/thumbnail.jpg"
  alt="Thumbnail"
  width={400}
  height={300}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// ❌ BAD - Missing sizes attribute
<Image
  src="/image.jpg"
  alt="Image"
  width={800}
  height={600}
/>
```

### **Dynamic Import Components**

```tsx
// ✅ GOOD - Heavy component with dynamic import
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
})

// ❌ BAD - Direct import untuk heavy component
import HeavyChart from './HeavyChart'
```

---

## 🔍 Monitoring & Testing

### **Tools untuk Testing**

1. **Lighthouse** (Chrome DevTools)
   - Performance score
   - Best practices
   - Accessibility
   - SEO

2. **WebPageTest**
   - Real-world testing
   - Waterfall analysis
   - Video playback

3. **Next.js Analytics**
   - Real User Monitoring (RUM)
   - Web Vitals tracking

### **Command untuk Local Testing**

```bash
# Build production bundle
npm run build

# Analyze bundle size
ANALYZE=true npm run build

# Start production server
npm start
```

---

## 📝 Checklist Optimasi

- [x] Lazy loading untuk images
- [x] Priority loading untuk hero/banner images
- [x] Blur placeholder untuk smooth loading
- [x] Responsive images dengan sizes attribute
- [x] Modern image formats (AVIF, WebP)
- [x] Dynamic imports untuk heavy components
- [x] Preconnect untuk external domains
- [x] DNS prefetch untuk analytics
- [x] Image caching (30 days)
- [x] Optimized quality settings (75-90%)

---

## 🚀 Future Improvements

Optimasi yang bisa ditambahkan di masa depan:

1. **Service Worker** untuk offline support
2. **Edge Caching** dengan Vercel Edge Network
3. **Font Optimization** dengan font-display: swap
4. **Code Splitting** per route
5. **Tree Shaking** untuk unused code
6. **Bundle Size Monitoring** dengan size-limit
7. **Image CDN** untuk faster global delivery
8. **HTTP/2 Server Push** untuk critical assets

---

## 📚 Referensi

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web Vitals](https://web.dev/vitals/)
- [Lazy Loading Best Practices](https://web.dev/lazy-loading/)
- [Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Resource Hints](https://web.dev/preconnect-and-dns-prefetch/)

---

Dibuat dengan ❤️ untuk performa website yang optimal
