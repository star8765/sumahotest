let mic, amplitude;
let colorPicker;
let started = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSL, 360, 100, 100); // 🎯 最初にHSLモードにしておく

  // パレット（右上に表示）
  colorPicker = createColorPicker("#3498db");
  colorPicker.position(windowWidth - 70, 20);
  colorPicker.style("z-index", "10");
}

function draw() {
  if (!started || !amplitude) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Tap to start mic", width / 2, height / 2);
    return;
  }

  let vol = amplitude.getLevel(); // 0.0 ~ 1.0
  let baseColor = colorPicker.color();

  // 先にHSLモードにして色解析
  colorMode(HSL, 360, 100, 100);
  let h = hue(baseColor);
  let s = saturation(baseColor);
  let l = map(vol, 0, 0.3, 10, 100);

  background(h, s, l);
}

function touchStarted() {
  fullscreen(true); // フルスクリーン要請（失敗しても無害）

  if (!started) {
    getAudioContext()
      .resume()
      .then(() => {
        mic = new p5.AudioIn();
        mic.start(
          () => {
            amplitude = new p5.Amplitude();
            amplitude.setInput(mic);
            started = true;
            hideAddressBar();
          },
          (err) => {
            console.error("マイク拒否:", err);
          }
        );
      });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function hideAddressBar() {
  window.scrollTo(0, 1);
}
