var video = document.getElementById("video");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var textContainer = document.getElementById('text-container');

var vw, vh, aspect, data, minLum, maxLum;

var charMap = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
var mapLength = charMap.length - 1;

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            draw();
        })
        .catch(function(error) {
            console.log("Something went wrong!");
        });
}

function draw() {
    vw = video.videoWidth;
    vh = video.videoHeight;
    aspect = vw / vh;
    step = vw / (window.innerWidth / 8);
    canvas.width = vw;
    canvas.height = vh;
    if (vw * vh != 0) {
        ctx.clearRect(0, 0, vw, vh);
        ctx.drawImage(video, 0, 0, vw, vh);
        data = greyscale(ctx.getImageData(0, 0, vw, vh).data);
        textContainer.textContent = ascii(data, vw, vh, step).replace(/ /g, '\u00a0');
    }
    requestAnimationFrame(draw);
}

function greyscale(imgData) {
    var result = new Array();
    minLum = 255;
    maxLum = 0;
    for (var i = 0; i < imgData.length; i += 4) {
        var luminosity = 0.3 * imgData[i] + 0.59 * imgData[i + 1] + 0.11 * imgData[i + 2];
        minLum = Math.min(minLum, luminosity);
        maxLum = Math.max(maxLum, luminosity);
        result.push(luminosity);
    }
    return result;
}

function ascii(imgData, width, height, step) {
    var result = '';
    var xstep = Math.round(step);
    var ystep = Math.round(step * 2);
    for (var y = 0; y < height; y += ystep) {
        for (var x = 0; x < width; x += xstep) {
            var newLum = imgData[y * width + x] * (maxLum - minLum) / 255;
            result += charMap[mapLength - Math.round(newLum * mapLength / 255)];
        }
        result += '\u000a';
    }
    return result;
}