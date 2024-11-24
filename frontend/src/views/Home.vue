<script setup>
import SearchBar from '@/components/SearchBar.vue';
import CardGrid from '@/components/CardGrid.vue';

</script>

<template>
    <SearchBar placeholderText="Search for a wiki..." />
    <CardGrid :data="wikiData" />
</template>

<script>
// declare sample data in a json
const wikiSampleData = [
    {
        "wikiId": "Cosmere:_Mistborn",
        "title": "Cosmere: Mistborn",
        "description": "A wiki dedicated to the Mistborn series within Brandon Sanderson's Cosmere universe.",
        "content": "This wiki explores the characters, magic systems, and major events in the Mistborn series.",
        "createdBy": "63e8e9d8f86d4e25c9a1b111",
        "src": "https://i.blogs.es/2f8f3d/mistborn_dbg_preview-1-1-/1366_2000.jpeg",
        "language": "en",
        "tags": ["Cosmere", "Fantasy", "Brandon Sanderson"],
        "entries": [
            "63e8e9d8f86d4e25c9a1b222",
            "63e8e9d8f86d4e25c9a1b223",
            "63e8e9d8f86d4e25c9a1b224"
        ]
    },
    {
        "wikiId": "Cosmere:_Stormlight_Archive",
        "title": "Cosmere: Stormlight Archive",
        "description": "A wiki focused on the Stormlight Archive series by Brandon Sanderson, another major part of the Cosmere universe.",
        "content": "This wiki covers characters, artifacts, and locations central to the Stormlight Archive series.",
        "createdBy": "63e8e9d8f86d4e25c9a1b112",
        "language": "en",
        "src": "https://upload.wikimedia.org/wikipedia/en/3/30/Stormlight_Logo.jpg",
        "tags": ["Cosmere", "Fantasy", "Stormlight Archive"],
        "entries": [
            "63e8e9d8f86d4e25c9a1b225",
            "63e8e9d8f86d4e25c9a1b226",
            "63e8e9d8f86d4e25c9a1b227"
        ]
    },
    {
        "wikiId": "Marvel_Cinematic_Universe:_Avengers",
        "title": "Marvel Cinematic Universe: Avengers",
        "description": "This wiki explores the Avengers within the MCU, including character profiles and major events.",
        "content": "This wiki includes information about key Avengers characters, their origins, and major story arcs in the MCU.",
        "createdBy": "63e8e9d8f86d4e25c9a1b113",
        "language": "en",
        "tags": ["Marvel", "MCU", "Avengers"],
        "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjWwFwjyqt-GrP3JuROomFU-3OWOaWqgDAvg&s",
        "entries": [
            "63e8e9d8f86d4e25c9a1b228",
            "63e8e9d8f86d4e25c9a1b229",
            "63e8e9d8f86d4e25c9a1b230"
        ]
    },
    {
        "wikiId": "Marvel_Cinematic_Universe:_Guardians_of_the_Galaxy",
        "title": "Marvel Cinematic Universe: Guardians of the Galaxy",
        "description": "A wiki covering the Guardians of the Galaxy, their adventures, and allies within the Marvel Cinematic Universe.",
        "content": "This wiki includes profiles of the Guardians and their adventures across the universe.",
        "createdBy": "63e8e9d8f86d4e25c9a1b114",
        "language": "en",
        "tags": ["Marvel", "MCU", "Guardians of the Galaxy"],
        "src": "https://cdn.mos.cms.futurecdn.net/gg4JHGpkEVFxPf5gMSHxGf.jpg",
        "entries": [
            "63e8e9d8f86d4e25c9a1b231",
            "63e8e9d8f86d4e25c9a1b232",
            "63e8e9d8f86d4e25c9a1b233"
        ]
    },
    {
        "wikiId": "Pokémon_Universe",
        "title": "Pokémon Universe",
        "description": "This wiki contains information about Pokémon species, characters, and lore within the Pokémon universe.",
        "content": "A comprehensive guide to Pokémon, including trainers, species, and iconic items.",
        "createdBy": "63e8e9d8f86d4e25c9a1b115",
        "language": "en",
        "tags": ["Pokémon", "Gaming", "Anime"],
        "src": "https://pokemonletsgo.pokemon.com/assets/img/how-to-play/hero-img.png",
        "entries": [
            "63e8e9d8f86d4e25c9a1b234",
            "63e8e9d8f86d4e25c9a1b235",
            "63e8e9d8f86d4e25c9a1b236"
        ]
    },
    {
        "wikiId": "Harry_Potter_Universe",
        "title": "Harry Potter Universe",
        "description": "A wiki dedicated to the Harry Potter series, including characters, spells, and magical creatures.",
        "content": "This wiki covers the magical world of Harry Potter, including characters, spells, and magical creatures.",
        "createdBy": "63e8e9d8f86d4e25c9a1b116",
        "language": "en",
        "tags": ["Harry Potter", "Fantasy", "Magic"],
        "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYyWjslK8gf-WmKojQ7fWaxM0JfY4wkY4BQ&s",
        "entries": [
            "63e8e9d8f86d4e25c9a1b237",
            "63e8e9d8f86d4e25c9a1b238",
            "63e8e9d8f86d4e25c9a1b239"
        ]
    },
    {
        "wikiId": "Star_Wars_Universe",
        "title": "Star Wars Universe",
        "description": "A wiki exploring the Star Wars universe, including characters, planets, and major events.",
        "content": "This wiki covers the characters, planets, and major events in the Star Wars universe.",
        "createdBy": "63e8e9d8f86d4e25c9a1b117",
        "language": "en",
        "tags": ["Star Wars", "Sci-Fi", "Space Opera"],
        "src": "https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2020/12/star-wars-scaled.jpg?fit=2560%2C1440&quality=50&strip=all&ssl=1",
        "entries": [
            "63e8e9d8f86d4e25c9a1b240",
            "63e8e9d8f86d4e25c9a1b241",
            "63e8e9d8f86d4e25c9a1b242"
        ]
    },
    {
        "wikiId": "DC_Universe",
        "title": "DC Universe",
        "description": "A wiki dedicated to the DC Universe, including characters, storylines, and major events.",
        "content": "This wiki covers the characters, storylines, and major events in the DC Universe.",
        "createdBy": "63e8e9d8f86d4e25c9a1b118",
        "language": "en",
        "tags": ["DC", "Comics", "Superheroes"],
        "src": "https://img.asmedia.epimg.net/resizer/v2/TJEZAJS3IBBHFI6J4FNA7RG4R4.jpg?auth=37fa73c282134f5e7f24804b39aa8ebdecef4beee7de15bf7e09a3343a310383&width=1472&height=828&smart=true",
        "entries": [
            "63e8e9d8f86d4e25c9a1b243",
            "63e8e9d8f86d4e25c9a1b244",
            "63e8e9d8f86d4e25c9a1b245"
        ]
    },
    {
        "wikiId": "The_Witcher_Universe",
        "title": "The Witcher Universe",
        "description": "A wiki dedicated to the Witcher universe, including characters, monsters, and major events.",
        "content": "This wiki covers the characters, monsters, and major events in the Witcher universe.",
        "createdBy": "63e8e9d8f86d4e25c9a1b119",
        "language": "en",
        "tags": ["The Witcher", "Fantasy", "Monsters"],
        "src": "https://www.thewitcher.com/build/images/TheWitcher3-494d7efe..webp",
        "entries": [
            "63e8e9d8f86d4e25c9a1b246",
            "63e8e9d8f86d4e25c9a1b247",
            "63e8e9d8f86d4e25c9a1b248"
        ]
    }
]
const wikiData = wikiSampleData.map((wiki) => {
    const { wikiId } = wiki;
    wiki.path = `/wiki/${wikiId}`;
    return wiki;
});

</script>