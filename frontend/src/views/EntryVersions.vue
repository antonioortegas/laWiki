<script setup>
// import SearchBar from '@/components/SearchBar.vue';
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
                <button
                    class="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-md hover:bg-red-700 hover:scale-110">
                    <router-link :to="{
                        name: 'EntryPage',
                        params: { entryId: $route.params.entryId },
                    }" class="flex">
                        Revert
                    </router-link>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
// declare sample data in a json
const sampleData = [
    {
        entry: "63e8e9d8f86d4e25c9a1b222",
        content:
            "Vin is a Mistborn who rises from the streets to join the fight against the Lord Ruler.",
        createdBy: "MistbornFan",
        createdAt: "2022-01-01T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b222",
        content:
            "Vin possesses Allomancy powers, playing a key role in overthrowing the oppressive regime.",
        createdBy: "Allomancer101",
        createdAt: "2022-01-02T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b225",
        content:
            "Kaladin is introduced as a slave but rises to become a warrior with Windrunner powers.",
        createdBy: "WindrunnerFan",
        createdAt: "2022-01-03T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b225",
        content:
            "Kaladin protects the people using his abilities as a Windrunner, a unique magical skill in Roshar.",
        createdBy: "Stormblessed123",
        createdAt: "2022-01-04T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b228",
        content:
            "Tony Stark, a brilliant inventor, uses his Iron Man suit to fight threats to the world.",
        createdBy: "IronAvenger",
        createdAt: "2022-01-05T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b228",
        content:
            "Tony Stark sacrifices himself to save the universe in the final battle against Thanos.",
        createdBy: "EndgameHero",
        createdAt: "2022-01-06T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b234",
        content:
            "Pikachu is an Electric-type Pokémon known for its loyalty to its trainer, Ash.",
        createdBy: "ElectricTrainer",
        createdAt: "2022-01-07T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b234",
        content:
            "Pikachu, often found in the wild, is prized for its strong electric attacks in battles.",
        createdBy: "PikaFan",
        createdAt: "2022-01-08T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b226",
        content:
            "Shardplate is rare armor in Roshar, providing incredible protection to its wearer.",
        createdBy: "ShardKnight",
        createdAt: "2022-01-09T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b226",
        content:
            "Shardplate, crafted from a mysterious material, enhances strength and speed.",
        createdBy: "PlateCrafter",
        createdAt: "2022-01-10T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b229",
        content:
            "The Infinity Stones are six ancient objects that govern different aspects of reality.",
        createdBy: "RealityKeeper",
        createdAt: "2022-01-11T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b229",
        content:
            "The Infinity Stones can grant their wielder immense power when gathered together.",
        createdBy: "StoneMaster",
        createdAt: "2022-01-12T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b233",
        content:
            "Groot is a loyal member of the Guardians, with the ability to regenerate and grow.",
        createdBy: "IAmGroot",
        createdAt: "2022-01-13T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b233",
        content:
            "Groot is known for his limited vocabulary and close friendship with Rocket.",
        createdBy: "GuardianFan",
        createdAt: "2022-01-14T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b235",
        content:
            "The Poké Ball is an iconic tool for capturing and training Pokémon.",
        createdBy: "PokéMaster",
        createdAt: "2022-01-15T12:00:00Z",
    },
    {
        entry: "63e8e9d8f86d4e25c9a1b235",
        content:
            "Different types of Poké Balls have various capture rates, enhancing trainers’ abilities.",
        createdBy: "TrainerPro",
        createdAt: "2022-01-16T12:00:00Z",
    },
];

// convert "createdAt" to a more readable format
sampleData.forEach((item) => {
    const date = new Date(item.createdAt);
    item.createdAt = date.toLocaleString();
});
</script>
