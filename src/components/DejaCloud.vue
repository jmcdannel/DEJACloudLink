<script setup lang="ts">

defineProps({
  user: Object
})

const emit = defineEmits(['selected', 'clear'])

async function handleLayoutSelect(layout) {
  console.log('handleLayoutSelect', layout.layoutId)
  if (layout) {
    emit('selected', layout)
  }
}

</script>
<template>
  <main class="p-4">
    <template v-if="user">
      <DejaCloudLayoutList @selected="handleLayoutSelect" />
    </template>
    <template v-else>
      <DejaLogin />
    </template> 
  </main>
</template>