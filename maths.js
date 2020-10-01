var answer;
var score = 0;
var backgroundImages = [];

function nextQuestion() {
  const n1 = Math.round(Math.random() * 4);
  const n2 = Math.round(Math.random() * 5);

  document.getElementById('n1').innerHTML = n1;
  document.getElementById('n2').innerHTML = n2;

  answer = n1 + n2;
}

function checkAnswer() {
  const prediction = predictImage();
  prediction === answer ? improveGarden(++score) : destroyGarden(--score);

  if (score < 0) {
    score = 0;
  }

  console.log(score);
}

function improveGarden(point) {
  if (point <= 6) {
    backgroundImages.push(`url('images/background${point}.svg')`);
    document.body.style.backgroundImage = backgroundImages;
  } else {
    alert('Well done! Your math garden is in full bloom! Want to start again?');
    score = 0;
    backgroundImages = [];
    document.body.style.backgroundImage = backgroundImages;
  }
}

function destroyGarden(point) {
  if (point >= 0) {
    backgroundImages.pop();
    document.body.style.backgroundImage = backgroundImages;
  }
}
