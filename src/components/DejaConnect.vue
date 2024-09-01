<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import CommandStation from './CommandStation.vue'
import Dejacloud from './Dejacloud.vue'

const alreadyConnected = ref(false)


onMounted(async () => {
  console.log('onMounted', window.serialOutputStream)
  alreadyConnected.value = !!window.serialOutputStream
})

// function handleOn() {
//   if (!selected.value) return

//   send('<1 MAIN>')
//   setDoc(doc(db, 'layouts', selected.value.layoutId), {
//     dccEx: { powerStatus: '1 MAIN' }
//   }, { merge: true })
// }

// function handleOff() {
//   if (!selected.value) return

//   send('<0>')
//   setDoc(doc(db, 'layouts', selected.value.layoutId), {
//     dccEx: { powerStatus: '0' }
//   }, { merge: true })
// }

</script>
<template>
  <main class="flex min-h-screen w-screen bg-gradient-to-b from-zinc-950 to-zinc-800 justify-center items-center flex-wrap">
    <Dejacloud />
    <CommandStation />
  </main> 
</template>