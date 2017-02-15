console.log('JS loaded');

function setup() {

  $(window).on('beforeunload', function() {
    $(window).scrollTop(0);
  });

  const $police = $('.policemen');
  const $right = $('#right');
  const $left = $('#left');
  const $artist = $('.gArtist');
  const $section = $('.graff');
  const $begin = $('.play');
  const $scoreboard = $('.score');
  const $warning = $('.warning');
  const $timer = $('.time');
  const $shake = $('.shake');
  const $winning = $('.winning');
  const $menu = $('.menu');
  // const $winningBackground = $('.winningBackground');
  const $tryAgain = $('.tryAgain');
  const $howToGuide = $('.howToGuide');
  const $info = $('.howToPlay');
  let currentSection = 0;
  const x = 0.03;
  let mousedown = false;
  let policeInSight = false;
  const randomTime = Math.ceil(Math.random()*8500);
  const timeUp = 2000;
  const timeDown = 2000;
  let currentOpacity = null;
  let newOpacity = null;
  let score = 0;
  let warnings = 0;
  let timeRemaining = 60;
  let intervalId = null;
  let blinkerInterval = null;
  let slowly = null;

  $begin.on('click' , ()=>{
    firstSound();
    startTime();
    setTimeout(() => {
      policeUp();
    }, 2000);
    setTimeout(() => {
      $menu.removeClass('intro');
    }, 2000);
    $('html, body').animate({ scrollTop: $(document).height() }, 2000, () => {
      $('html').addClass('locked');
    });
    event.preventDefault();
  });

  function startTime() {
    intervalId = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        checkWin();
        $timer.html('Time Remaining: '+timeRemaining);
      }
    }, 1000);
  }

  function howToPlay() {
    $howToGuide.css('visibility', 'visible');
    setInterval(() => {
      $howToGuide.css('visibility', 'hidden');
    }, 15000);
  }

  function firstSound() {
    $shake[0].play();
    setTimeout(function(){
      $shake[0].pause();
    },2500);
  }


  function appear(){
    console.log('inside appear()');
    $police.animate({ top: 775 }, timeUp, disappear);
  }

  function disappear(){
    policeInSight = true;
    setTimeout(() => {
      $police.animate({ top: 867 }, timeDown, policeUp);
    }, randomTime);
  }

  function moveRight(){
    $artist.animate({ left: '+=53px' }, 'slow');
    currentSection++;
    $artist.css('transform', 'scaleX(1)');
  }

  function moveLeft(){
    $artist.animate({ left: '-=53px' }, 'slow');
    currentSection--;
    $artist.css('transform', 'scaleX(-1)');
  }

  function turnAround() {
    $artist.css('transform', 'scaleX(1)');
  }

  $('#right').mousedown(function(){
    slowly = setInterval(function() {
      mousedown = true;
      sprayWall();
    }, 100);
  }).mouseup(function() {
    mousedown = false;
    clearInterval(slowly);
  });

  function sprayWall() {
    // find the div covering the current wall section
    // update the opacity of that div
    currentOpacity = parseFloat($section.eq(currentSection).css('opacity'));
    newOpacity = currentOpacity + x;
    $section.eq(currentSection).css('opacity', newOpacity);
    if (parseFloat(newOpacity)<1){
      score++;
    }
    $scoreboard.html('Completed: ' + Math.round(score/5.28) + ' %');
    checkCaught();
  }

  function policeUp() {
    policeInSight = false;
    setTimeout(() => {
      appear();
    }, randomTime);
  }

  function checkCaught() {
    if (mousedown === true && policeInSight === true){
      warnings++;
      $warning.html('Warnings: ' + warnings);
    }
    if (warnings >= 1){
      $warning.css('color', '#f00');
    }
    if (warnings === 2){
      blinkerInterval = setInterval(blinker, 500);
    }
    if (warnings === 3){
      //some code to stop everything and offer reset button
    }
  }


  function blinker() {
    $warning.fadeOut(200);
    $warning.fadeIn(200);
  }

  function checkWin() {
    if(timeRemaining === 0 && warnings < 3 ){
      // $menu.css('visibility', 'hidden');
      // $winningBackground.css('visibility', 'visible');
      $winning.html('Sick One Blud! You got '+ Math.round(score/5.28) + '% of the painting done!');
      // $winning.css('visibility', 'visible');
      // $tryAgain.css('visibility', 'visible');
      $(window).scrollTop(0);
      // console.log('working');
    }
  }

  function reset() {
    clearInterval(intervalId);
    policeInSight = false;
    mousedown = false;
    $menu.addClass('intro');
    $winning.html('');
    $scoreboard.html('Completed: 0%');
    $warning.html('Warnings: 0');
    $warning.css('color', '#000');
    $section.css('opacity', '0');
    $artist.css('left', 'auto');
    clearInterval(blinkerInterval);
    currentOpacity = null;
    newOpacity = null;
    score = 0;
    warnings = 0;
    timeRemaining = 120;
    currentSection = 0;
    $timer.html('Time Remaining: '+timeRemaining);
    $(window).scrollTop(0);
  }


  $right
    .on('mousedown', sprayWall)
    .on('mouseup', moveRight);
  $left
    .on('mousedown', moveLeft)
    .on('mouseup', turnAround);
  $tryAgain.on('click', reset);
  $info.on('click', howToPlay);
}

$(() => setup());
