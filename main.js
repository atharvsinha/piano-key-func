import {PitchDetector} from 'pitchy';
import {Frequency} from 'music-math'

let bfr = -1
let flag = false

function updatePitch(analyserNode, detector, input, sampleRate, bfr, flag){
    
    analyserNode.getFloatTimeDomainData(input);
    
    const display = (pitch, clarity) => {
        const noteDetails = Frequency(pitch)
        const note = noteDetails.note + noteDetails.octave
        document.getElementById("pitch").textContent = `${note}`;
        document.getElementById("clarity").textContent = `${Math.round(clarity * 100)} %`;
    };

    const invoked = () =>{alert('Function Invoked woohoo!');}
    
    const setFlag = () => {
        if (pitch > 115 && pitch<119){
            if (bfr==0){
                bfr = 1;
            } else if (bfr==2){
                flag=true;
            }
        }
        if (pitch>109 && pitch < 111){
            if (bfr==-1){
                bfr=0;
            } else if (bfr==1){
            bfr=2;
            }
        }
    }
    const [pitch, clarity] = detector.findPitch(input, sampleRate);
    if (clarity>.9 && pitch>32) display(pitch, clarity);
    setFlag();
    if (flag==true) {invoked();}
    window.setTimeout( () => updatePitch(analyserNode, detector, input, sampleRate), 100);
}

document.addEventListener("DOMContentLoaded", () => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    
    document
        .getElementById("resume-button")
        .addEventListener("click", () => audioContext.resume());
    
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        let sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyserNode);
        const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
        const input = new Float32Array(detector.inputLength);
        updatePitch(analyserNode, detector, input, audioContext.sampleRate, bfr, flag);
    });
});
    
