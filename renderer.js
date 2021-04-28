// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const electron = require('electron')
const fs = require('fs')
const showVideo = document.getElementById('showVideo')
const recorde = document.getElementById('recorde')
const stop = document.getElementById('stop')
let screenStream = ''
let _stream = ''
let _recorder = ''
let recording = false

btnDisabled()
recorde.addEventListener('click', async function () {
  _stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
  screenStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720
      }
    }
  })
  screenStream.getVideoTracks().forEach(value => _stream.addTrack(value))
  showVideo.srcObject = screenStream
  _recorder = new MediaRecorder(_stream, { mimType: 'video/webm;codecs=h264' })
  _recorder.ondataavailable = async e => {
    // console.log(e, e.data)
    let path = electron.remote.dialog.showSaveDialogSync(electron.remote.getCurrentWindow(), {
      title: '保存文件',
      default: 'screenData.webm',
      filters: [
        { name: 'Custom File Type', extensions: ['webm'] },
      ]
    })
    console.log(path)
    fs.writeFileSync(path, new Uint8Array(await e.data.arrayBuffer()))
  }
  _recorder.start()
  recording = true
  btnDisabled()
}, false)

stop.addEventListener('click', function () {
  recording = false
  btnDisabled()
  _recorder.stop()
}, false)

function btnDisabled () {
  stop.disabled = !recording
  recorde.disabled = recording
}


