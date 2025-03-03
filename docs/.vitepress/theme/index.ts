// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Footer from '../Footer.vue'

import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(Footer)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
