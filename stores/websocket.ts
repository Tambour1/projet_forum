import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebSocketStore = defineStore('websocket', () => {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const listeners = new Set<(msg: string) => void>()

  function connect() {
    const isSecure = location.protocol === 'https:'
    const url = `${isSecure ? 'wss' : 'ws'}://${location.host}/_ws`

    ws.value = new WebSocket(url)

    ws.value.addEventListener('open', () => {
      isConnected.value = true
      console.log('WebSocket connecté !')
    })

    ws.value.addEventListener('message', (event) => {
      const message = event.data
      for (const callback of listeners) {
        callback(message)
      }
    })

    ws.value.addEventListener('close', () => {
      isConnected.value = false
      console.log('WebSocket déconnecté. Reconnexion dans 3s...')
      setTimeout(connect, 3000)
    })
  }

  function send(message: string) {
    if (ws.value && isConnected.value) {
      ws.value.send(message)
    } else {
      console.warn("WebSocket non connecté")
    }
  }

  function addListener(callback: (msg: string) => void) {
    listeners.add(callback)
  }

  function removeListener(callback: (msg: string) => void) {
    listeners.delete(callback)
  }

  return {
    ws,
    isConnected,
    connect,
    send,
    addListener,
    removeListener,
  }
})
