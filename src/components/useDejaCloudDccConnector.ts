import {
  doc,
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore"
import { useCollection } from "vuefire"
import { useToast } from "vuestic-ui"
import { db } from "../firebase"
import useSerial from "../hooks/useSerial"

export function useDejaCloudDccConnector() {
  const serial = useSerial()
  const { notify } = useToast()

  let handleCount = 0
  let listenCount = 0
  let isListening

  function handleDccCommands(snapshot) {
    handleCount++
    if (handleCount > 0) {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New: ", change.doc.data())
          parseDejaCommand(change.doc.data())
        }
      })
    }
  }

  const send = async (data) => {
    try {
      const cmd = `<${data}>\n`
      console.log("Writing to ports", data)
      serial.send(cmd)
    } catch (err) {
      console.error("Error writting to port:", err)
    }
  }

  async function parseDejaCommand({ action, payload }) {
    try {
      const cmd = JSON.parse(payload)
      switch (action) {
        case "connect":
          // await connect(payload)
          break
        case "dcc":
          // await send(payload)
          break
        case "listPorts":
          // await listPorts()
          break
        case "power":
          await power(cmd)
          break
        case "throttle":
          await sendSpeed(cmd)
          break
        case "turnout":
          // await sendTurnout(payload)
          break
        case "output":
          // await sendOutput(payload)
          break
        case "function":
          // await sendFunction(payload)
          break
        case "getStatus":
        case "status":
          await getStatus()
          break
        default:
          //noop
          console.warn("Unknown action in `handleMessage`", action, payload)
      }
    } catch (err) {
      console.error("Error handling message:", err)
    }
  }

  const getStatus = async () => {
    await send("s")
    notify("Status reuested")
  }

  const power = async (state) => {
    console.log("Powering", state, state.toString().startsWith("1"))
    await send(state)
    notify(
      state.toString().startsWith("1")
        ? { message: "ON", color: "success" }
        : { message: "OFF", color: "danger" }
    )
  }

  const sendSpeed = async ({ address, speed }) => {
    console.log("sendSpeed", address, speed)
    const direction = speed > 0 ? 1 : 0
    const absSpeed = Math.abs(speed)
    const cmd = `t ${address} ${absSpeed} ${direction}`
    await send(cmd)
    notify({
      message: `Locomotive ${address} set to speed ${absSpeed}`,
      color: "info",
    })
  }

  function listen(layoutId) {
    console.log(
      "Listening for dccCommands",
      layoutId,
      isListening,
      handleCount,
      listenCount
    )
    onSnapshot(
      query(
        collection(db, `layouts/${layoutId}/dccCommands`),
        orderBy("timestamp", "desc"),
        limit(10)
      ),
      handleDccCommands
    )
    isListening = layoutId
    listenCount++
  }

  async function clear(layoutId: string, count = 10) {
    console.log("Clearing dccCommands", layoutId)
    const querySnapshot = await getDocs(
      query(
        collection(db, `layouts/${layoutId}/dccCommands`),
        orderBy("timestamp", "asc"),
        limit(count)
      )
    )
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
    })
  }

  return { listen, clear }
}

export default useDejaCloudDccConnector
