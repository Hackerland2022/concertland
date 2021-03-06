window.onload = function () {
    const audienceCheer = document.getElementById("audienceCheer");
    const scream = document.getElementById("scream");
    const startBtn = document.getElementById("startBtn");
    const trackContainer = document.querySelector(".track-container");
    const keypress = document.querySelectorAll(".keypress");
    const game = document.getElementById("game");
    const stats = document.getElementById("stats");
    const comboText = document.querySelector(".hit__combo");
    const scoreCount = document.getElementById("score_count");
    const endGame = document.getElementById("endGame");
    var id = null;

    var isHolding = {
        a: false,
        d: false,
    };

    var hits = { good: 0, bad: 0, miss: 0 };

    var a = {
        color: "rgba(28, 121, 228, 1)",
        next: 0,
        notes: [
            { duration: 4, delay: 4.2 },
            { duration: 4, delay: 12.2 },
            { duration: 4, delay: 20.4 },
            { duration: 4, delay: 28.1 },
            { duration: 4, delay: 35.5 },
            { duration: 4, delay: 39.5 },
            { duration: 4, delay: 43.5 },
            { duration: 4, delay: 47.4 },
            { duration: 4, delay: 49.5 },
        ],
    };

    var d = {
        color: "rgba(28, 121, 228, 1)",
        next: 0,
        notes: [
            { duration: 4, delay: 2.2 },
            { duration: 4, delay: 6.2 },
            { duration: 4, delay: 10.2 },
            { duration: 4, delay: 18.5 },
            { duration: 4, delay: 22.4 },
            { duration: 4, delay: 26.2 },
            { duration: 4, delay: 29.9 },
            { duration: 4, delay: 33.6 },
            { duration: 4, delay: 37.3 },
            { duration: 4, delay: 39.5 },
            { duration: 4, delay: 41.3 },
            { duration: 4, delay: 47.4 },
        ],
    };

    var song = {
        duration: 56,
        sheet: [a, d],
    };

    var multiplier = {
        good: 1,
        bad: 0.5,
        miss: 0,
    };

    var isPlaying = false;
    var combo = 0;
    var maxCombo = 0;
    var score = 0;
    var animation = "moveDown";
    var startTime;
    var tracks;

    var initialiseNotes = function () {
        var noteElement;
        var trackElement;

        while (trackContainer.hasChildNodes()) {
            trackContainer.removeChild(trackContainer.lastChild);
        }

        song.sheet.forEach(function (key, index) {
            trackElement = document.createElement("div");
            trackElement.classList.add("track");

            key.notes.forEach(function (note) {
                noteElement = document.createElement("div");
                noteElement.classList.add("note");
                noteElement.classList.add("note--" + index);
                noteElement.style.backgroundColor = key.color;
                noteElement.style.animationName = animation;
                noteElement.style.animationTimingFunction = "linear";
                noteElement.style.animationDuration = note.duration + "s";
                noteElement.style.animationDelay = note.delay + "s";
                noteElement.style.animationPlayState = "paused";
                trackElement.appendChild(noteElement);
            });

            trackContainer.appendChild(trackElement);
            tracks = document.querySelectorAll(".track");
        });
    };

    document.addEventListener("keydown", function (event) {
        var keyIndex = getKeyIndex(event.key);

        if (Object.keys(isHolding).indexOf(event.key) !== -1 && !isHolding[event.key]) {
            isHolding[event.key] = true;
            keypress[keyIndex].style.border = "2px white solid";
            scream.play();

            if (isPlaying && tracks[keyIndex].firstChild) {
                judge(keyIndex);
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (Object.keys(isHolding).indexOf(event.key) !== -1) {
            var keyIndex = getKeyIndex(event.key);
            isHolding[event.key] = false;
            keypress[keyIndex].style.border = "none";
        }
    });

    var getKeyIndex = function (key) {
        if (key === "a") {
            return 0;
        } else if (key === "d") {
            return 1;
        }
    };

    startBtn.addEventListener("click", function () {
        var modal = document.getElementById("instructionModal");
        modal.style.display = "none";
        startGame();
    });

    function startGame() {
        isPlaying = true;
        startTime = Date.now();
        game.style.display = "flex";
        stats.style.display = "block";
        endGame.style.display = "none";
        startTimer(song.duration);
        document.getElementById("song").play();
        initialiseNotes();
        document.querySelectorAll(".note").forEach(function (note) {
            note.style.animationPlayState = "running";
        });
    }

    var judge = function (index) {
        var timeInSecond = (Date.now() - startTime) / 1000;
        var nextNoteIndex = song.sheet[index].next;
        var nextNote = song.sheet[index].notes[nextNoteIndex];
        var perfectTime = nextNote.duration + nextNote.delay;
        var accuracy = Math.abs(timeInSecond - perfectTime);
        var hitJudgement;

        if (accuracy > (nextNote.duration - 1) / 4) {
            return;
        }

        hitJudgement = getHitJudgement(accuracy);
        updateHits(hitJudgement);
        updateCombo(hitJudgement);
        updateMaxCombo();
        calculateScore(hitJudgement);
        removeNoteFromTrack(tracks[index], tracks[index].firstChild);
        updateNext(index);
    };

    var updateHits = function (judgement) {
        hits[judgement]++;
    };

    var calculateScore = function (judgement) {
        score += 1000 * multiplier[judgement];
        scoreCount.innerHTML = `Score: ${score}`;
    };

    var updateCombo = function (judgement) {
        if (judgement === "miss") {
            combo = 0;
        } else {
            ++combo;
        }

        comboText.innerHTML = `Combo: ${combo}`;
    };

    var updateMaxCombo = function () {
        maxCombo = maxCombo > combo ? maxCombo : combo;
    };

    var getHitJudgement = function (accuracy) {
        if (accuracy < 0.2) {
            audienceCheer.play();
            return "good";
        } else if (accuracy < 0.3) {
            audienceCheer.play();
            return "bad";
        } else {
            return "miss";
        }
    };

    var removeNoteFromTrack = function (parent, child) {
        parent.removeChild(child);
    };

    var updateNext = function (index) {
        song.sheet[index].next++;
    };

    var startTimer = function (duration) {
        var display = document.querySelector(".summary__timer");
        var timer = duration;
        var minutes;
        var seconds;

        display.style.display = "block";
        display.style.opacity = 1;

        var songDurationInterval = setInterval(function () {
            minutes = Math.floor(timer / 60);
            seconds = timer % 60;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.innerHTML = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(songDurationInterval);
                showResult();
                comboText.style.transition = "all 1s";
                comboText.style.opacity = 0;
            }
        }, 1000);
    };

    function showResult() {
        document.getElementById("endGame").style.display = "flex";
        document.getElementById("finalScore").innerHTML = `Score: ${score}`;
        game.style.display = "none";
        stats.style.display = "none";
    }
};
