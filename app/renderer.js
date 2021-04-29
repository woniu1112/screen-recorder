/**
 * author yonglei.shang
 * time 2021-4-26
 */

const electron = require('electron')
const fs = require('fs')
const showVideo = document.getElementById('showVideo')
const recorde = document.getElementById('recorde')
const stop = document.getElementById('stop')
const selectD = document.getElementById('setSeclect')
let screenStream = ''
let _stream = ''
let _recorder = ''
let recording = false
let recordeWidth = ''
let recordeHeight = ''

btnDisabled()

recorde.addEventListener('click', async function () {
  getDpi()
  _stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
  screenStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        minWidth: recordeWidth,
        maxWidth: recordeWidth,
        minHeight: recordeHeight,
        maxHeight: recordeHeight
      }
    }
  })
  screenStream.getVideoTracks().forEach(value => _stream.addTrack(value))
  showVideo.srcObject = screenStream
  showVideo.play()
  _recorder = new MediaRecorder(_stream, { mimType: 'video/webm;codecs=h264' })
  saveStream()
  _recorder.start()
  recording = true
  btnDisabled()
}, false)

stop.addEventListener('click', function () {
  recording = false
  btnDisabled()
  _recorder.stop()
  showVideo.pause()
}, false)

function getDpi () {
  let WWdith = window.screen.width
  let HHeight = window.screen.height
  let index = selectD.selectedIndex
  console.log(index)
  let text = selectD.options[index].text
  if (text.indexOf('×') === -1) {
    recordeWidth = WWdith
    recordeHeight = HHeight
  } else {
    let obj = setText(text)
    recordeWidth = obj.width
    recordeHeight = obj.height
  }
  console.log(recordeWidth, recordeHeight)
}

function setText (text) {
  let arr = text.split('×')
  return {
    width: arr[0].trim(),
    height: arr[1].trim()
  }
}

function saveStream () {
  _recorder.ondataavailable = async e => {
    let path = electron.remote.dialog.showSaveDialogSync(electron.remote.getCurrentWindow(), {
      title: '保存文件',
      default: 'screenData.webm',
      filters: [
        { name: 'Custom File Type', extensions: ['webm'] },
      ]
    })
    fs.writeFileSync(path, new Uint8Array(await e.data.arrayBuffer()))
  }
}

function btnDisabled () {
  stop.disabled = !recording
  recorde.disabled = recording
}


