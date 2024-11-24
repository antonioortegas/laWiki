<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold text-center">Vue.js Task Manager</h1>
          </div>
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div class="flex">
                <input type="text" v-model="newTask" placeholder="Add a new task" class="flex-grow px-4 py-2 mr-4 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" @keyup.enter="addTask">
                <button @click="addTask" class="px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">Add</button>
              </div>
              <div>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="filter" value="all" class="form-radio text-cyan-500">
                  <span class="ml-2">All</span>
                </label>
                <label class="inline-flex items-center ml-6">
                  <input type="radio" v-model="filter" value="active" class="form-radio text-cyan-500">
                  <span class="ml-2">Active</span>
                </label>
                <label class="inline-flex items-center ml-6">
                  <input type="radio" v-model="filter" value="completed" class="form-radio text-cyan-500">
                  <span class="ml-2">Completed</span>
                </label>
              </div>
              <ul class="space-y-2">
                <li v-for="task in filteredTasks" :key="task.id" class="flex items-center">
                  <input type="checkbox" v-model="task.completed" class="form-checkbox h-5 w-5 text-cyan-500">
                  <span :class="{ 'line-through': task.completed }" class="ml-3 text-gray-700">{{ task.text }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-8">
            <h2 class="text-xl font-semibold text-center">Map</h2>
            <MapComponent 
              :latitude="36.7150" 
              :longitude="-4.4783" 
              :markerLatitude="36.7150"
              :markerLongitude="-4.4783"
              :zoom="13"
              width="500px"
              height="500px"
              markerText="Módulo de prisión de Alcalá meco" 
              position="absolute"
              top="0"
              right="0"
              bottom="0"
              left="0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MapComponent from "./components/mapComponent.vue"

const newTask = ref('')
const tasks = ref([])
const filter = ref('all')

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      id: Date.now(),
      text: newTask.value.trim(),
      completed: false
    })
    newTask.value = ''
  }
}

const filteredTasks = computed(() => {
  switch (filter.value) {
    case 'active':
      return tasks.value.filter(task => !task.completed)
    case 'completed':
      return tasks.value.filter(task => task.completed)
    default:
      return tasks.value
  }
})
</script>

<style>
body {
  font-family: Arial, sans-serif;
}

h1 {
  margin-top: 20px;
}

p {
  margin-bottom: 20px;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>