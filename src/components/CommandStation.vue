<script setup lang="ts">
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { FaUsb, FaCloud, FaPowerOff } from 'vue3-icons/fa6'
import { useStorage, watchImmediate } from '@vueuse/core'
import useSerial from '../hooks/useSerial'
import { db } from "../firebase"
import { VaAspectRatio, VaAvatar, VaChip } from 'vuestic-ui'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'


const layoutId = useStorage('@DEJA/cloud/layoutId', null)

const layoutDoc = layoutId.value
  ? doc(db, 'layouts', layoutId.value)
  : null
const layout = useDocument(layoutDoc)

dayjs.extend(relativeTime)

const {
  connect,
  disconnect,
  send,
  isConnected
} = useSerial((msg) => {
  // console.log('useSerial.msg', msg)
  let delta
  let val = msg
  if (msg?.startsWith('= A')) {
    delta = 'trackA'
    val = msg.replace(/= A /, '')
  } else if (msg?.startsWith('= B')) {
    delta = 'trackB'
    val = msg.replace(/= B /, '')
  } else if (msg?.startsWith('* LCD2:')) {
    delta = 'LCD2'
    val = msg.replace(/\* LCD2:/, '')
  } else if (msg?.startsWith('* LCD3:')) {
    delta = 'LCD3'
    val = msg.replace(/\* LCD3:/, '')
  } else if (msg?.startsWith('* LCD4:')) {
    delta = 'LCD4'
    val = msg.replace(/\* LCD4:/, '')
  } else if (msg?.startsWith('iDCC-EX ')) {
    delta = 'version' 
  }

  delta && console.log('delta', delta, val)

  delta && layoutId.value && updateDoc(doc(db, 'layouts', layoutId.value),
    {
      [`dccEx.${delta}`]: val,
      ['dccEx.timestamp']: serverTimestamp()
    }, { merge: true })

  /*
  <= A MAIN>
  <= B PROG>
  <iDCC-EX V-5.0.9 / MEGA / STANDARD_MOTOR_SHIELD G-3bddf4d>
  <* LCD3:Ready *>
  <* LCD2:Power Off *>
  * <* LCD3:Free RAM= 5240b *>
  */
})


async function handleConnect() {
  await connect()
}

async function handleDisconnect() {
  await disconnect()
}
</script>
<template>

  <main class=" border border-cyan-500 rounded-2xl m-4 m-h-72 flex flex-col gap-2 relative z-10">

    <header class="flex flex-col mb-4 self-start px-4 pt-3 pb-2 relative z-10">
      <h2 class="flex">
        <img src="/dcc-ex/android-chrome-192x192.png" alt="DCC-EX Logo" class="w-8 h-8 mr-2" :class="isConnected ? 'text-green-500' : 'text-gray-500'" /> 
        <span class="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600  to-teal-400">DCC-EX Command Station</span>
      </h2>
    </header>
    <template v-if="isConnected">
      <article class="px-4 py-4 flex flex-wrap gap-2 items-center relative" v-if="layout">
        <div class="flex-grow relative">

          <FaUsb class="w-12 h-12 text-green-500 absolute right-2 top-2" />
          <pre class="bg-black text-green-300 p-2 rounded-md text-xs bg-opacity-40 border border-slate-500 pr-16">
{{ layout.dccEx.LCD2 }}
{{ layout.dccEx.LCD3 }}
&gt; <span class="blink">_</span>
          </pre>
        </div>
      
        <div class="flex flex-col">
          <div class="flex py-1 min-w-48 justify-between bg-purple-500 border-purple-500 border my-1 items-center py-1 px-2 rounded-full bg-opacity-20"> 
            <VaAvatar class="bg-red-500" size="small">A</VaAvatar>
            <h3>{{ layout.dccEx.trackA }}</h3>
            <VaAvatar class="bg-transparent text-red-500" size="small"><FaPowerOff /></VaAvatar>
          </div>
          <div class="flex py-1 min-w-48 justify-between bg-purple-500 border-purple-500 border my-1 items-center py-1 px-2 rounded-full bg-opacity-20"> 
            <VaAvatar class="bg-red-500" size="small">A</VaAvatar>
            <h3>{{ layout.dccEx.trackB }}</h3>
            <VaAvatar class="bg-transparent text-red-500" size="small"><FaPowerOff /></VaAvatar>
          </div>
          <div>
            <p class="py-2 text-xs text-cyan-200">Updated: {{ dayjs.unix(layout.dccEx.timestamp.seconds).fromNow() }}</p>
          </div>
        </div>
      </article>
      <p class="px-4 text-xs text-cyan-200" v-if="layout">
        {{layout.dccEx.version}}
      </p>
        <div class="px-4  pb-2">
          <button @click="handleDisconnect" class="border bg-transparent border-cyan-800 py-1 px-2 text-cyan-400 p-4 rounded-md hover:bg-cyan-900 hover:bg-opacity-20 flex items-center">
            Disconnect
          </button>
        </div>
      <div class="circle"></div>
      <svg class="circle-svg">
        <filter id="wavy">
          <feTurbulence x="0" y="0" baseFrequency="0.009" numOctaves="5" speed="2">
            <animate attributeName="baseFrequency" dur="60s" values="0.02; 0.005; 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="30" />
        </filter>
      </svg>
    </template>
    <template v-else>
      <VaAspectRatio
          class="px-4 pt-4 pb-8"
          :ratio="1"
        >
        <div class="flex flex-col items-center justify-center">
          <button @click="handleConnect" class="text-5xl py-16 px-8 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-300 border bg-transparent border-cyan-800 text-cyan-400 rounded-2xl hover:bg-cyan-900 hover:bg-opacity-20 flex items-center">
            <FaUsb class="mr-2 text-sky-500" />
            Connect
          </button>
        </div>
      </VaAspectRatio>
    </template>
  </main>
</template>

<style scoped>

:root {
  --size: 55vh;
  --s: calc(var(55vh) / 6);
  --bor: calc(var(55vh) / 30);
  --boxShadow: calc(var(55vh) / 12);
}

.blink {
  animation: blink .8s infinite;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }

}

.circle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 55vh;
  height: 55vh;
  filter: url(#wavy) blur(1px);
  pointer-events: none;
  opacity: .25;
}

.circle:before,
.circle:after {
  content: "";
  position: absolute;
  top: calc(55vh / 6);
  left: calc(55vh / 6);
  right: calc(55vh / 6);
  bottom: calc(55vh / 6);
  border-radius: 50%;
  border: calc(55vh / 30) solid #fff;
}
.circle:before {
  box-shadow: 0 0 calc(55vh / 12) #0f0, inset 0 0 calc(55vh / 12) #0f0;
  -webkit-box-reflect: below 10px
    linear-gradient(transparent, transparent, #0002);
  animation: move 5s linear infinite;
}

.circle:after {
  box-shadow: 0 0 calc(calc(55vh / 30)/2) #fff, inset 0 0 calc(55vh / 30) #fff;
}

@keyframes move {
  0% {
    box-shadow: 0 0 calc(55vh / 12) #0f0, inset 0 0 calc(55vh / 12) #0f0;
    filter: hue-rotate(0deg);
  }
  20% {
    box-shadow: 0 0 60px #0f0, inset 0 0 60px #0f0;
  }

  40% {
    box-shadow: 0 0 40px #0f0, inset 0 0 40px #0f0;
  }
  60% {
    box-shadow: 0 0 80px #0f0, inset 0 0 80px #0f0;
  }
  80% {
    box-shadow: 0 0 100px #0f0, inset 0 0 100px #0f0;
  }
  100% {
    box-shadow: 0 0 calc(55vh / 12) #0f0, inset 0 0 calc(55vh / 12) #0f0;
    filter: hue-rotate(360deg);
  }
}

svg.circle-svg {
  width: 0;
  height: 0;
}

</style>