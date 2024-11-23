<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps, defineEmits } from 'vue';
import EasyMDE from 'easymde';

const props = defineProps({
  modelValue: { type: String, default: '' }, // Recibe el valor inicial
});

const emit = defineEmits(['update:modelValue']); // Emite los cambios
const markdownContent = ref(props.modelValue);
let easyMDEInstance = null;

onMounted(() => {
  easyMDEInstance = new EasyMDE({
    element: document.getElementById('markdown-editor'),
    initialValue: markdownContent.value,
    placeholder: 'Escribe aquí tu contenido en Markdown...',
    autofocus: true,
  });

  // Escucha los cambios en el contenido
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

// Sincroniza cambios en el valor inicial
watch(() => props.modelValue, (newValue) => {
  if (easyMDEInstance && newValue !== easyMDEInstance.value()) {
    easyMDEInstance.value(newValue);
  }
});
</script>

<template>
  <textarea id="markdown-editor"></textarea>
</template>
