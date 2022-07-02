var isHolding = {
    a: false,
    d: false
}

var keypress;

window.onload = function() {
    const idolSinging = document.getElementById('idolSinging');
    const audienceCheer = document.getElementById('audienceCheer');
    const scream = document.getElementById('scream');
    const startBtn = document.getElementById("startBtn");

    document.addEventListener('keydown', function (event) {
        var keyIndex = getKeyIndex(event.key);
    
        if (Object.keys(isHolding).indexOf(event.key) !== -1
          && !isHolding[event.key]) {
          isHolding[event.key] = true;
          
          console.log(isHolding);
          //keypress[keyIndex].style.display = 'block';
    
/*           if (isPlaying && tracks[keyIndex].firstChild) {
            judge(keyIndex);
          } */
        }
      });
    
      document.addEventListener('keyup', function (event) {
        if (Object.keys(isHolding).indexOf(event.key) !== -1) {
          var keyIndex = getKeyIndex(event.key);
          isHolding[event.key] = false;
          //keypress[keyIndex].style.display = 'none';
          console.log(isHolding);
        }
      });

      var getKeyIndex = function (key) {
        if (key === 'a') {
          return 0;
        } else if (key === 'd') {
          return 1;
        }
      };
      
      startBtn.addEventListener("click", function() {
        var modal = document.getElementById("instructionModal");
        modal.style.display = "none";
      });
}

