<script setup>

</script>

<template>
    ENTRY: {{ $route.params.entryId }}
    <p>CONTENIDO DE LA ENTRADA, SUSTITUIR POR EL MD EDITOR</p>
    <!-- link to relative /versions -->
    <router-link :to="{ name: 'EntryVersions', params: { entryId: $route.params.entryId } }">View Versions</router-link>
</template>

<script>

</script>