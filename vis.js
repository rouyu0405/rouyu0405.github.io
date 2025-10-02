console.log("vis.js loaded");

//******************************VIZ*****************************//
const tooltip = document.getElementById('tooltip');
const rects = document.querySelectorAll('svg rect');

rects.forEach(rect => {
    rect.addEventListener('mouseenter', (e) => {
        const value = e.target.getAttribute('data-value');
        tooltip.textContent = `Number of Metro Lines: ${value}`;
        tooltip.style.display = 'block';
    });

    rect.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY - 20) + 'px';
    });

    rect.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});


//******************************VIZ ART*****************************//
const polyline = document.getElementById('poly-graph');
const clickArea = document.getElementById('poly-click-area');
const length = polyline.getTotalLength();

let position = 0;
let animationId;
let isMoving = false;
let colors = ['green', 'blue', 'red', 'orange'];
let currentColorIndex = 0;

polyline.style.strokeDasharray = length;
polyline.style.strokeDashoffset = 0;

function animateRight() {
    if (!isMoving) return;
    position += 1;
    if (position > 800) position = 0;
    polyline.setAttribute('transform', `translate(${position}, 0)`);
    clickArea.setAttribute('transform', `translate(${position}, 0)`);
    animationId = requestAnimationFrame(animateRight);
}

function start() {
    if (!isMoving) {
      isMoving = true;
      animateRight();
    }
}

function stop() {
    isMoving = false;
    if (animationId) cancelAnimationFrame(animationId);
}

function redrawStroke() {
    polyline.style.strokeDashoffset = length;
    let startTime = null;
    function redraw(time) {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / 1000;
      const offset = Math.max(length * (1 - progress), 0);
      polyline.style.strokeDashoffset = offset;

      if (progress < 1) {
        requestAnimationFrame(redraw);
      }
    }
    requestAnimationFrame(redraw);
}

function changeColor() {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    polyline.style.stroke = colors[currentColorIndex];
    redrawStroke();
}

clickArea.addEventListener('click', changeColor);
