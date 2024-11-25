<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

</script>

<template>
  <header class="sticky top-0 z-50">
    <Navbar :username="username" :userPfp="userPfp" />
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <Footer />
  </footer>
</template>

<script>
const username = "SprenBonded";
const userPfp = "https://avatars.githubusercontent.com/u/100814779?v=4";
</script>