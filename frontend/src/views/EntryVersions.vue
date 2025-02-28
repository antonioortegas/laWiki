<script setup>
// import SearchBar from '@/components/SearchBar.vue';
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useRoute } from 'vue-router';
import router from '../router';

const VITE_ENTRIES_API_HOST = import.meta.env.VITE_ENTRIES_API_HOST;
const VITE_VERSIONS_API_HOST = import.meta.env.VITE_VERSIONS_API_HOST;

const route = useRoute();
const sampleData = ref([]);

// Gestion usuario actual y permisos
const authStore = useAuthStore();
const userRole = computed(() => authStore.user?.role);
const canRestoreEntries = computed(() => userRole.value === 'admin' || userRole.value === 'editor');
const showEntryAlert = ref(false);
const warningVersionMessage = ref('');
const caller = ref('');

if (!canRestoreEntries.value) {
    console.log('User does not have the necessary permissions to restore the version.', canRestoreEntries.value);
    warningVersionMessage.value = "You must be an editor to restore the version.";
}

const showEntryWarning = (item) => {
    showEntryAlert.value = true;
    caller.value = item;
    setTimeout(() => {
        showEntryAlert.value = false;
        caller.value = '';
    }, 3000);
};



onMounted(() => {
    axios.get(`${VITE_VERSIONS_API_HOST}/entry/${route.params.entryId}`)
        .then((response) => {
            const r = response.data;
            sampleData.value = r.map(item => {
                const date = new Date(item.createdAt);
                item.createdAt = date.toLocaleString();
                return item;
            });
            console.log(response.data);
        })
        .catch((error) => {
            console.log(route.params.entryId);
            console.error(error);
        });
});
/*Hay que crear el endpoint en entry-service se le pasa el contenido de la versión 
por body y el id de la entrada para que lo busque y lo modifica desde ahí*/
function restoreVersion(entryId, version) {
    if (confirm("Are you sure you want to restore to an earlier version?")) {
        console.log("Restoring to an earlier version...");

        axios.put(`${VITE_ENTRIES_API_HOST}/restore/${entryId}`, {
            content: version.content,
            imageSrc: version.imageSrc,
            latitude: version.latitude,
            longitude: version.longitude,
            map: version.map,
            zoom: version.zoom,
        })
            .then((response) => {
                console.log("Version restored successfully:", response.data);
                router.push({ name: 'EntryPage', params: { entryId: entryId } }).catch(err => {
                    if (err.name !== 'NavigationDuplicated') {
                        throw err;
                    }
                });
                // Optionally, you can refresh the data or navigate to another page
            })
            .catch((error) => {
                console.error("Error restoring version:", error);
            });
    }
}

</script>

<template>
    <!-- back to the entry button -->
    <button class="flex items-center rounded-md px-3 py-2 mb-0 m-5 border border-primary" type="button">
        <router-link :to="{ name: 'EntryPage', params: { entryId: $route.params.entryId } }" class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-6 mr-1">
                <path fill-rule="evenodd"
                    d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                    clip-rule="evenodd" />
            </svg>
            Back
        </router-link>
    </button>
    <!-- Outer container -->
    <div class="container mx-auto p-4">
        <!-- Header Row -->
        <div
            class="grid grid-cols-3 gap-x-4 text-sm font-semibold bg-gray-100 p-4 border-b border-gray-700 font-heading">
            <div class="col-span-1">Date:</div>
            <div class="col-span-1">Edited by:</div>
            <div class="col-span-1 text-center">Action:</div>
        </div>

        <!-- Data Rows -->
        <div v-for="item in sampleData" :key="item.createdAt"
            class="grid grid-cols-3 gap-4 p-1 items-center border-b border-gray-300 font-body even:bg-gray-200 hover:bg-secondary hover:bg-opacity-50">
            <div class="col-span-1 text-text">{{ item.createdAt }}</div>
            <div class="col-span-1 text-text">{{ item.createdBy }}</div>
            <div class="col-span-1 text-center">
                <button v-if="canRestoreEntries" type="button" @click="() => restoreVersion(item.entry, item)"
                    class="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-md hover:bg-red-700 hover:scale-110">
                    Revert
                </button>
                <button v-else @click="showEntryWarning(item)"
                    class="px-6 py-3 bg-background border-background text-text font-bold rounded-lg shadow-md"
                    style="background-color: gray!important; cursor: not-allowed;">
                    Revert
                </button>
                <div v-if="showEntryAlert && item === caller" class="bg-red-500 text-white p-4 rounded-lg my-4">
                    {{ warningVersionMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//declare sample data in a json

// convert "createdAt" to a more readable format

</script>
