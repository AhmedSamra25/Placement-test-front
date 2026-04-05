import { ref, onUnmounted } from 'vue'

export function useAudioRecorder() {
  const isRecording = ref(false)
  const recordingTime = ref(0)
  const audioBlob = ref(null)
  const audioUrl = ref(null)
  
  let mediaRecorder = null
  let audioChunks = []
  let timer = null

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      
      audioChunks = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' }) // WebM is widely supported for recording
        audioBlob.value = blob
        audioUrl.value = URL.createObjectURL(blob)
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      isRecording.value = true
      recordingTime.value = 0
      
      timer = setInterval(() => {
        recordingTime.value++
      }, 1000)

    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert("Could not access microphone. Please ensure permissions are granted.")
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      isRecording.value = false
      clearInterval(timer)
    }
  }

  // Play the recorded audio locally
  const playAudio = () => {
    if (audioUrl.value) {
      const audio = new Audio(audioUrl.value)
      audio.play()
    }
  }

  // Discard recording
  const discardRecording = () => {
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
    }
    audioBlob.value = null
    audioUrl.value = null
    recordingTime.value = 0
  }

  // Auto-cleanup object URLs when unmounted to avoid memory leaks
  onUnmounted(() => {
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
    }
    clearInterval(timer)
  })

  // Format time (e.g. 01:05)
  const formattedTime = () => {
    const m = Math.floor(recordingTime.value / 60).toString().padStart(2, '0')
    const s = (recordingTime.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return {
    isRecording,
    recordingTime,
    formattedTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    playAudio,
    discardRecording
  }
}
