import { ref, onUnmounted } from 'vue'

export function useSpeechToText() {
  const isRecording = ref(false)
  const isSupported = ref(true)
  const finalTranscript = ref('')
  const interimTranscript = ref('')

  let recognition = null

  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    console.warn("Speech Recognition API is not supported in this browser.")
    isSupported.value = false
  } else {
    recognition = new SpeechRecognition()
    recognition.continuous = true      // Keep listening until the user stops it
    recognition.interimResults = true  // Show live words as they speak
    recognition.lang = 'en-US'         // Default language

    recognition.onresult = (event) => {
      let currentInterim = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript.value += event.results[i][0].transcript + ' '
        } else {
          currentInterim += event.results[i][0].transcript
        }
      }
      interimTranscript.value = currentInterim
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      if (event.error === 'not-allowed') {
         alert("Microphone access denied. Please allow microphone permissions.")
         stopRecording()
      }
    }
  }

  const startRecording = () => {
    if (!isSupported.value || !recognition) return
    try {
      finalTranscript.value = ''
      interimTranscript.value = ''
      recognition.start()
      isRecording.value = true
    } catch (e) {
      console.error('Error starting recognition:', e)
    }
  }

  const stopRecording = () => {
    if (!isSupported.value || !recognition) return
    if (isRecording.value) {
      recognition.stop()
      isRecording.value = false
      interimTranscript.value = '' // Flush interim
    }
  }

  const discardRecording = () => {
    finalTranscript.value = ''
    interimTranscript.value = ''
    stopRecording()
  }

  onUnmounted(() => {
    stopRecording()
  })

  return {
    isSupported,
    isRecording,
    finalTranscript,
    interimTranscript,
    startRecording,
    stopRecording,
    discardRecording
  }
}
