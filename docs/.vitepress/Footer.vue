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
  padding: 16px;
  font-size: 14px;
  background-color: #1b1b1f;
  color: #dfdfd6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content {
  display: flex;
  flex-wrap: wrap; /* Allows wrapping on smaller screens */
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center; /* Centers text on mobile */
}

.footer-left {
  flex: 1;
  margin-bottom: 10px;
}

.footer-right {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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

/* Responsive Design */
@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
