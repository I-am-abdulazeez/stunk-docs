---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Stunk."
  tagline: A lightweight, reactive state management library for TypeScript/JavaScript applications.
  # image: { src: "/logo.svg", alt: "Stunk Logo" }
  actions:
    - theme: brand
      text: Get Started
      link: /introduction
    - theme: alt
      text: API Reference
      link: /api-reference
    - theme: alt
      text: Examples
      link: /examples

features:
  - icon: '<img src="/fast.png" width="40" height="40" />'
    title: Lightweight and Fast
    details: No dependencies, minimal overhead

  - icon: '<img src="/reactive.png" width="40" height="40" />'
    title: Reactive
    details: Automatic updates when state changes

  - icon: '<img src="/batch-update.png" width="40" height="40" />'
    title: Batch Updates
    details: Group multiple state updates together

  - icon: '<img src="/atomic.png" width="40" height="40" />'
    title: Atomic State Management
    details: Break down state into manageable chunks

  - icon: '<img src="/selector.png" width="40" height="40" />'
    title: State Selection
    details: Select and derive specific parts of the state

  - icon: '<img src="/hourglass.png" width="40" height="40" />'
    title: Async Support
    details: Handle async state with built-in loading and error states

  - icon: '<img src="/hook.png" width="40" height="40" />'
    title: Middleware Support
    details: Extend functionality with custom middleware

  - icon: '<img src="/time-travel.png" width="40" height="40" />'
    title: Time Travel
    details: Undo/redo state changes

  - icon: '<img src="/safe.png" width="40" height="40" />'
    title: Type-Safe
    details: Written in TypeScript with full type inference
---