<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, where } from 'firebase/firestore'
import { useCollection, useCurrentUser } from 'vuefire'
import { db } from '../firebase'

const user = useCurrentUser()
const layoutsRef = collection(db, 'layouts')
const layoutsQuery = query(layoutsRef, where('owner', '==', user.value?.email))
const layouts = useCollection(user.value ? layoutsQuery : null)
</script>

<template>
  <main class="" v-if="user && layouts?.length > 0">
    <ul class="flex flex-col" v-if="Array.isArray(layouts) && layouts.length > 0">
      <li class="mb-2" v-for="layout in layouts" :key="layout.layoutId">
        <button 
          class="border bg-transparent border-cyan-800 text-cyan-400 py-1 px-2 font-normal text-sm rounded-md hover:bg-cyan-900 hover:bg-opacity-20 flex items-center"
          @click="$emit('selected', layout)" >{{ layout.layoutId }}
        </button>
      </li>
    </ul>
  </main>
  <main v-else>
    Login to view your layouts
  </main>
</template>
