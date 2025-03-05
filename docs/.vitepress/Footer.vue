<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Left side: Copyright text -->
      <p class="footer-left">
        © {{ new Date().getFullYear() }} Stunk. Maintained by AbdulAzeez
      </p>

      <!-- Right side: Icons -->
      <div class="footer-right">
        <a
          href="https://github.com/I-am-abdulazeez/stunk"
          target="_blank"
          aria-label="GitHub"
        >
          Github
        </a>
        <a href="https://x.com/dev_azeez" target="_blank" aria-label="Twitter">
          X (Twitter)
        </a>
        <a
          href="https://medium.com/@oabdulazeez70/"
          target="_blank"
          aria-label="GitHub"
        >
          Medium
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 20px;
  font-size: 14px;
  background-color: #1b1b1f;
  color: #dfdfd6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-left {
  margin: 0;
}

.footer-right {
  display: flex;
  gap: 15px;
}

.footer-right a {
  color: #dfdfd6;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s ease;
}

.footer-right a:hover {
  color: #2af4c2;
}
</style>
