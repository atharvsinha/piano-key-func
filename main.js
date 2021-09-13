import 'https://unpkg.com/pitchy@2.0.3/umd/index.js';
import musicMath from 'https://cdn.skypack.dev/music-math';
      
let arr = [] ;
let bfr = -1;
let flag = false;

function updatePitch(analyserNode, detector, input, sampleRate) {
    analyserNode.getFloatTimeDomainData(input);

    const [pitch, clarity] = detector.findPitch(input, sampleRate);

    const notes = musicMath.Frequency(pitch).note
    if (clarity>.8 && pitch>32){
        document.getElementById("pitch").textContent = `${Math.round(pitch*10)/10}`;
        document.getElementById("notes").innerHTML = `${notes}`;
        document.getElementById("clarity").textContent = `${Math.round(clarity * 100)} %`;
    }

    if (pitch > 115 && pitch<119){
        if (bfr==0){ 
            bfr = 1;
        } else if (bfr==2){
            flag=true;
        }
    } else if (pitch>109 && pitch < 111) {
        if (bfr==-1){
            bfr=0;
        } else if (bfr==1){
            bfr=2;
        }
    } 

    if (bfr!=-1){
        arr.push(0);
    }
    
    if (arr.length>30){
        bfr=-1;
        arr = [];
    }

    if (flag==1){
        alert('Woohoo');
        bfr = -1;
        flag=false;
        arr = []         
    }

    window.setTimeout( () => updatePitch(analyserNode, detector, input, sampleRate), 100);
};

document.addEventListener("DOMContentLoaded", () => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    document.getElementById("resume-button").addEventListener("click", () => audioContext.resume());

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        let sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyserNode);
        const detector = pitchy.PitchDetector.forFloat32Array(analyserNode.fftSize);
        const input = new Float32Array(detector.inputLength);
        updatePitch(analyserNode, detector, input, audioContext.sampleRate);
    });
});