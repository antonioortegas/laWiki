<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps, defineEmits } from 'vue';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css'; // Import necessary styles
import { uploadFileToCloudinary } from '../services/uploadService'; // Adjust path as needed

const props = defineProps({
  modelValue: { type: String, default: '' }, // Receives the initial value
});

const emit = defineEmits(['update:modelValue']); // Emits changes
const markdownContent = ref(props.modelValue);
let easyMDEInstance = null;

// Custom image upload handler
async function handleImageUpload(file) {
  try {
    const imageUrl = await uploadFileToCloudinary(file);
    const editor = easyMDEInstance.codemirror;
    const cursorPosition = editor.getCursor();

    // Insert the markdown for the uploaded image
    editor.replaceRange(`![Image](${imageUrl})`, cursorPosition);

    // also, emit an event with the url of the returned image so the parent component can update the entry to insert URL of the image as an attachment in the database
    emit('imageUploaded', imageUrl);
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Failed to upload image. Please try again.');
  }
}

onMounted(() => {
  // Initialize the Markdown editor
  easyMDEInstance = new EasyMDE({
    element: document.getElementById('markdown-editor'),
    initialValue: markdownContent.value,
    placeholder: 'Start typing...',
    autofocus: true,
    spellChecker: false,
    toolbar: [
      'undo', 'redo', '|',
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 
      // Hijack the image button to trigger file input
      {
        name: 'image',
        action: () => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
              await handleImageUpload(file);
            }
          });
          fileInput.click();
        },
        className: 'fa fa-image',
        title: 'Upload Image',
      },
    ],
  });

  // Listen for changes in the editor content
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

// Synchronize changes in the initial value
watch(() => props.modelValue, (newValue) => {
  if (easyMDEInstance && newValue !== easyMDEInstance.value()) {
    easyMDEInstance.value(newValue);
  }
});
</script>


<template>
  <div class="markdown-preview prose max-w-4xl">
    <textarea id="markdown-editor" class="prose"></textarea>
  </div>
</template>
