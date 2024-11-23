<script setup>
import { ref, onMounted } from 'vue';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';

const markdownContent = ref(''); // Contenido inicial del editor
let easyMDEInstance = null; // Referencia al editor

onMounted(() => {
  // Inicializar EasyMDE
  easyMDEInstance = new EasyMDE({
    element: document.getElementById('markdown-editor'),
    initialValue: markdownContent.value,
    placeholder: 'Escribe aquí tu contenido en Markdown...',
    spellChecker: false,
  });

  // Sincronizar el contenido con Vue
  easyMDEInstance.codemirror.on('change', () => {
    markdownContent.value = easyMDEInstance.value();
  });
});
</script>

<template>
  <div>
    <header>
      <img
        alt="Vue logo"
        class="logo"
        src="./assets/logo.svg"
        width="125"
        height="125"
      />
      <h1>Editor Markdown con EasyMDE</h1>
    </header>

    <main>
      <textarea id="markdown-editor"></textarea>
      <div>
        <h2>Vista previa:</h2>
        <div v-html="markdownContent"></div>
      </div>
    </main>
  </div>
</template>

<style scoped>
header {
  text-align: center;
  margin-bottom: 2rem;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 800px;
}

textarea {
  width: 100%;
  height: 300px;
  margin: 1rem 0;
}

h2 {
  margin-top: 2rem;
}
</style>
