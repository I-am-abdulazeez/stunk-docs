<template>
  <footer class="footer">
    <div class="footer-content">
      <p>
        © {{ new Date().getFullYear() }} Stunk. Built with ❤️ by AbdulAzeez
        Olanrewaju
      </p>
      <p>
        <a href="https://github.com/I-am-abdulazeez/stunk" target="_blank"
          >GitHub</a
        >|
        <a href="https://x.com/dev_azeez" target="_blank">Twitter</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  background-color: #1b1b1f;
  color: #dfdfd6;
}
.footer a {
  color: #dfdfd6;
  text-decoration: none;
  margin: 0 10px;
}
.footer a:hover {
  text-decoration: underline;
  color: #fff;
}
</style>
