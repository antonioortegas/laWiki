<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps, defineEmits } from 'vue';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css'; // Asegúrate de importar los estilos necesarios

const props = defineProps({
  modelValue: { type: String, default: '' }, // Recibe el valor inicial
});

const emit = defineEmits(['update:modelValue']); // Emite los cambios
const markdownContent = ref(props.modelValue);
let easyMDEInstance = null;

onMounted(() => {
  // Inicializar el editor Markdown
  easyMDEInstance = new EasyMDE({
    element: document.getElementById('markdown-editor'),
    initialValue: markdownContent.value,
    placeholder: 'Escribe aquí tu contenido en Markdown...',
    autofocus: true,
    spellChecker: false,
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', '|',
      'preview', 'side-by-side', 'fullscreen',
    ],
  });

  // Escuchar cambios en el contenido del editor
  easyMDEInstance.codemirror.on('change', () => {
    emit('update:modelValue', easyMDEInstance.value());
  });
});

onBeforeUnmount(() => {
  if (easyMDEInstance) {
    easyMDEInstance.toTextArea();
    easyMDEInstance = null;
  }
});

// Sincronizar cambios en el valor inicial
watch(() => props.modelValue, (newValue) => {
  if (easyMDEInstance && newValue !== easyMDEInstance.value()) {
    easyMDEInstance.value(newValue);
  }
});
</script>

<template>
  <textarea id="markdown-editor"></textarea>
</template>
