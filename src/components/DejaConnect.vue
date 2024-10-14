<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useCurrentUser } from 'vuefire'
import { useStorage } from '@vueuse/core'
import { FaCloud } from 'vue3-icons/fa6'
import { IoCloseCircle } from "vue3-icons/io5"
import { VaAvatar, VaChip } from 'vuestic-ui'
import Dejacloud from './Dejacloud.vue'
import CommandStationConnect from './CommandStationConnect.vue'
import Connected from './Connected.vue'
import useDejaCloudDccConnector from './useDejaCloudDccConnector.ts'

const alreadyConnected = ref(false)
const isConnected = ref(false)
const { listen } = useDejaCloudDccConnector()
const layoutId = useStorage('@DEJA/cloud/layoutId', null)
const user = useCurrentUser()

onMounted(async () => {
  console.log('onMounted', window.serialOutputStream)
  alreadyConnected.value = !!window.serialOutputStream
})

watchEffect(() => {
  console.log(`watch layoutId ${layoutId.value} ${isConnected.value}`)
  if (layoutId.value && isConnected.value) {
    listen(layoutId.value)
  }
})

function handleLayoutSelect(layout) {
  layoutId.value = layout.layoutId
}

function handleLayoutClear() {
  layoutId.value = null
}

function handleConnected() {
  console.log('handleConnected')
  isConnected.value = true
}

</script>
<template>
  <main class="flex min-h-screen w-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex-col justify-start items-start flex-wrap">
    <header class="flex mb-4 p-4 relative z-10 justify-between w-full">
      <h2 class="flex">
        <FaCloud class="w-8 h-8 mr-2" :class="layoutId ? 'text-green-500' : 'text-gray-500'" /> 
        <span class="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-indigo-600 hidden md:inline">DEJA Cloud</span>
        
      </h2>
      <template v-if="layoutId">
        <VaChip class="bg-green-500 text-black" size="large">
          <h3>{{ layoutId }}</h3>
          <IoCloseCircle class="text-gray-300 ml-4" @click="handleLayoutClear" />
        </VaChip>  
      </template>

      <h3 v-if="user" class="text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
        <VaAvatar :size="24" :src="user?.photoURL" />
        <span class="ml-2 hidden md:inline">{{ user?.displayName }}</span>
      </h3>
    </header>
    <CommandStationConnect v-if="layoutId" @connected="handleConnected" />
    <Dejacloud v-else :user="user" :layoutId="layoutId" @selected="handleLayoutSelect" @clear="handleLayoutClear" />
    <Connected v-if="isConnected" />
  </main> 
</template>