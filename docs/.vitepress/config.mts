import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Stunk",
  description: "Stunk is a framework-agnostic state management library that helps you manage your application's state in a clean and simple way. It uses a technique called Atomic State, breaking down state into smaller chunks that are easy to update, subscribe to, and manage.",
  head: [
    // Favicon
    ["link", { rel: "icon", type: "image/png", href: "/favicon.png" }],

    // Meta Tags for SEO
    ["meta", { name: "author", content: "AbdulAzeez Olanrewaju" }],
    ["meta", { name: "keywords", content: "stunk, state management, react, vue, angular, svelte, javascript, typescript" }],
    ["meta", { name: "description", content: "Stunk is a modern state management library for JavaScript applications, supporting React, Vue, Svelte, and more." }],

    // Open Graph (OG) Meta Tags for Social Media Sharing
    ["meta", { property: "og:title", content: "Stunk - Simple & Scalable State Management" }],
    ["meta", { property: "og:description", content: "Stunk is a framework-agnostic state management library designed for simplicity and performance." }],
    ["meta", { property: "og:image", content: "/stunk-preview.png" }],
    ["meta", { property: "og:url", content: "https://stunk.dev" }],
    ["meta", { property: "og:type", content: "website" }],

    // Twitter Card Meta Tags
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@dev_azeez" }],
    ["meta", { name: "twitter:title", content: "Stunk - Simple & Scalable State Management" }],
    ["meta", { name: "twitter:description", content: "Stunk is a modern state management library for JavaScript and Typescript applications." }],
    ["meta", { name: "twitter:image", content: "/stunk-preview.png" }],

    // Mobile Friendly Meta
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
    ["link", { rel: "canonical", href: "https://stunk.dev" }]

  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/stunk-examples' },
      { text: 'API Reference', link: '/api-reference' }
    ],

    sidebar: [
      {
        text: 'Get Started',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Installation', link: '/installation' },
        ]
      },
      {
        text: 'Core',
        items: [
          { text: 'Chunk', link: '/chunk' },
          { text: 'Selector', link: '/selector' },
          { text: 'Batch Updates', link: '/batch-update' },
          { text: 'Computed', link: '/computed' },
          {
            text: 'Middleware', items: [
              {
                text: 'Middleware Intro', link: '/middleware-intro'
              },
              {
                text: 'Time Travel', link: '/time-travel'
              },
              {
                text: 'State Persistence', link: '/persistence'
              },
            ]
          },
          { text: 'Async State', link: '/async-chunk' },
          {
            text: 'Utils', items: [
              {
                text: 'Once', link: '/once'
              },
              {
                text: 'Combine Async Chunk', link: '/combine-async-chunk'
              },
            ]
          },
        ]
      },
      {
        text: 'React Stunk',
        items: [
          { text: 'Introduction', link: '/react-stunk' },
          { text: 'useChunk', link: '/useChunk' },
          { text: 'useDerive', link: '/useDerive' },
          { text: 'useComputed', link: '/useComputed' },
          { text: 'useAysncChunk', link: '/useAysncChunk' },
          { text: 'State Selections - Readonly', link: '/read-only-values' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/I-am-abdulazeez/stunk' }
    ]
  }
})
