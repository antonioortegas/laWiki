<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // To access route params
import { useAuthStore } from "../stores/auth";
import axios from 'axios'; // For API calls
import router from '../router';
import { uploadFileToCloudinary } from '@/services/uploadService'; // Utility function for file upload

// Form data
const formData = ref({
    title: "",
    description: "",
    content: "",
    src: "",
    tags: "",
    language: "en",
});
const fileInput = ref(null);

// Placeholder for fetched wiki data
const sampleWikiData = {
    title: "Cosmere: Mistborn",
    description: "A wiki dedicated to the Mistborn series within Brandon Sanderson's Cosmere universe.",
    src: "https://i.blogs.es/2f8f3d/mistborn_dbg_preview-1-1-/1366_2000.jpeg",
    content: "This wiki explores the characters, magic systems, and major events in the Mistborn series.",
    tags: ["Fantasy", "Brandon Sanderson", "Cosmere"],
    language: "en",
};

// Access route parameters
const route = useRoute();

const authStore = useAuthStore();
const userId = ref(authStore.user?._id);

const isEditing = ref(false); // Determines if editing an existing wiki
import { v4 as uuidv4 } from 'uuid';

const entryUUID = ref(uuidv4());
onMounted(() => {
    const w = route.params.wikiId;
    console.log("Creating empty entry with ID:");
    axios.post('/api/entries', {
        wiki: w,
        title: "Entrada de " + w,
        createdBy: userId.value,
        entryId: entryUUID.value

    })
        .then(response => {
            console.log("Empty entry created with ID:", entryUUID.value);
        })
        .catch(error => {
            console.error("Error creating empty entry:", error);
        });


    router.push({ name: 'EntryPage', params: { entryId: entryUUID.value }, query: { edit: true } });

});

async function verifyTokenLocally() {
    console.log("Verificando token localmente...");
    const authToken = getAuthTokenFromCookie();
    if (authToken) {
        try {
            const response = await axios.post("/api/users/validate-token", { token: authToken })
            if (response.data.valid) {
                this.user = response.data.user; // Establecer datos del usuario
                this.userId = this.user._id; // Establecer el ID del usuario
                console.log("Sesión válida. Nuevo userId:", this.userId);

                await renewToken(); // Se renueva el token para alargar la sesión

                // Al recuperar del backend la imagen no funcionaba, con esto se corrige
                if (this.user.profilePicture) {
                    this.user.picture = this.user.profilePicture;
                } else {
                    //console.log("No se ha encontrado una imagen de perfil. Usando imagen predeterminada. Usuario:", this.user);
                    this.user.picture = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                }
            } else {
                alert("Token inválido o caducado. Se ha cerrado la sesión");
                this.signOut(); // Limpiar estado y redirigir
            }
            console.log("Token verificado localmente.");
        } catch (error) {
            console.error("Error al validar el token:", error);
            this.signOut();
        }
    } else {
        console.log("No hay token almacenado.");
    }
}

async function renewToken() {
    const authToken = getAuthTokenFromCookie();
    if (authToken) {
        try {
            const response = await axios.post("/api/users/renew-token", { token: authToken });
            setAuthTokenCookie(response.data.newToken);
        } catch {
            this.signOut();
        }
    }
}


</script>

<template>
    <!-- intentionally left blank -->
</template>