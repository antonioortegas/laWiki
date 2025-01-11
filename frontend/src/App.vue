<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

</script>

<template>
  <header class="sticky top-0 z-50">
    <Navbar />
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <Footer />
  </footer>
</template>