<script setup lang="ts">
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useStorage, watchImmediate } from '@vueuse/core'
import { useDocument, useCurrentUser } from 'vuefire'
import { FaUsb, FaCloud, FaPowerOff } from 'vue3-icons/fa6'
import { VaAspectRatio, VaAvatar, VaChip } from 'vuestic-ui'
import DejaCloudLayoutList from './DejaCloudLayoutList.vue'
import useDejaCloudDccConnector from './useDejaCloudDccConnector.ts'
import DejaLogin from './DejaLogin.vue'
import useSerial from '../hooks/useSerial'
import { db } from "../firebase"

const layoutId = useStorage('@DEJA/cloud/layoutId', null)
const user = useCurrentUser()


const { listen, clear } = useDejaCloudDccConnector()

watchImmediate(layoutId, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    console.log('watch layoutId', newVal, oldVal)
    listen(newVal)
  }
})

async function handleLayoutSelect(layout) {
  console.log('handleLayoutSelect', layout.layoutId)
  if (layout) {
    layoutId.value = layout.layoutId
    await clear(layout.layoutId)
  }
}

async function handleClear() {
  console.log('handleClear', layoutId.valued)
  await clear(layoutId.value, 100)
}

function handleClearLayout() {
  layoutId.value = null
}
</script>
<template>

  <main class=" border border-cyan-500 rounded-2xl m-4 w-72 m-h-72 flex flex-col">
    <header class="flex flex-col mb-4 self-start px-4 pt-3 pb-2 relative z-10">
      <h2 class="flex">
        <FaCloud class="w-8 h-8 mr-2" :class="layoutId ? 'text-green-500' : 'text-gray-500'" /> 
        <span class="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-indigo-600">DEJA Cloud</span>
      </h2>
    </header>
    <section v-if="user && layoutId" class=" flex-grow self-center == text-green-500">
      <div class="bg-black text-green-300 p-2 rounded-md text-xs bg-opacity-40 border border-slate-500 pr-16">
        <h3 class="text-transparent text-xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
          <VaAvatar :size="24" :src="user?.photoURL" />
          {{ user?.displayName }}
        </h3>
        <div class="flex py-1 my-4 min-w-48 justify-between bg-purple-500 border-purple-500 border my-1 items-center py-1 px-2 rounded-full bg-opacity-20"> 
          <h3>{{ layoutId }}</h3>
          <FaPowerOff />
        </div>
      </div>
      <div class="pb-3 mt-4">
        <button @click="handleClearLayout" class="border bg-transparent border-cyan-800 text-cyan-400  py-1 px-2 rounded-md hover:bg-cyan-900 hover:bg-opacity-20">Clear Layout</button>
        <button @click="handleClear" class="border bg-transparent border-cyan-800 text-cyan-400  py-1 px-2 rounded-md hover:bg-cyan-900 hover:bg-opacity-20">Clear DCC</button>
      </div>
    </section>      
    <DejaCloudLayoutList v-else-if="user" @selected="handleLayoutSelect" />
    <DejaLogin v-else />    
  </main>

</template>