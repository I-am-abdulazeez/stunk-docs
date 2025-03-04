<script setup>
import DefaultTheme from "vitepress/theme";
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <footer class="footer">
        <div class="footer-content">
          <p>© 2025 Stunk. Built with ❤️ by AbdulAzeez Olanrewaju</p>
          <p>
            <a href="https://github.com/I-am-abdulazeez/stunk" target="_blank"
              >GitHub</a
            >
            | <a href="https://stunk.vercel.app">Docs</a> |
            <a href="https://twitter.com/dev_azeez" target="_blank">Twitter</a>
          </p>
        </div>
      </footer>
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  background-color: #f8f9fa;
  color: #333;
  border-top: 1px solid #ddd;
}
.footer a {
  color: #007bff;
  text-decoration: none;
  margin: 0 10px;
}
</style>
