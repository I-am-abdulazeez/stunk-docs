import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Footer from '../Footer.vue'
import StunkLogo from '../StunkLogo.vue'

import { useRoute } from 'vitepress'

import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    const route = useRoute()

    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => (route.path === '/' ? h(Footer) : null),
      'nav-bar-title-before': () => h(StunkLogo)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
