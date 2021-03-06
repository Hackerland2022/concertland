
let gameContainer = $('#game-container');
let rainbowContainer1 = document.getElementById('rainbow-container1');
let rainbowContainer2 = document.getElementById('rainbow-container2');

let colorBlock = document.querySelector('.colorBlock');
let player = $('#boydancer');
let dancer = document.querySelector("#girldancer");

function ForEachNode(f, par) {
    var no = par.childNodes;
    for (var i = 0; i < no.length; i++) {
        f(no[i]);
        if (no[i].childNodes.length > 0)
            ForEachNode(f, no[i]);
    }
}

function Pad(num) {
    if (num.length < 2) {
        return "0" + num;
    } else {
        return num;
    }
}

function ReverseColor(hex) {
    if (hex.length != 7 || hex.indexOf('#') != 0) {
        return null;
    }
    var r = (255 - parseInt(hex.substring(1, 3), 16)).toString(16);
    var g = (255 - parseInt(hex.substring(3, 5), 16)).toString(16);
    var b = (255 - parseInt(hex.substring(5, 7), 16)).toString(16);
    var inverse = "#" + Pad(r) + Pad(g) + Pad(b);
    return inverse;
}

LettersList = '0123456789ABCDEF'.split('');

function GetRandomColor() {
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += LettersList[Math.round(Math.random() * 15)];
    }
    return color;
}

var Msgs = new Array();
Msgs[0] = 'DANCE';


function Rand(tb) {
    return tb[Math.floor(tb.length * Math.random())];
}
for (let i = 0; i < 12; i++) {
    let p = document.createElement('P');
    let txt = document.createTextNode(Rand(Msgs));
    p.appendChild(txt);
    
    rainbowContainer2.appendChild(p);
    // rainbowContainer1.appendChild(p);
}

for (let i = 0; i < 12; i++) {
    let p = document.createElement('P');
    let txt = document.createTextNode(Rand(Msgs));
    p.appendChild(txt);
    
    rainbowContainer1.appendChild(p);
}

setInterval(function () {
    ForEachNode(function (n) {
        if (n.style != undefined) {
            var col = GetRandomColor();
            n.style.backgroundColor = col;
            n.style.color = ReverseColor(col);
        }
    }, rainbowContainer2);
}, 200);

setInterval(function () {
    ForEachNode(function (n) {
        if (n.style != undefined) {
            var col = GetRandomColor();
            n.style.backgroundColor = col;
            n.style.color = ReverseColor(col);
        }
    }, rainbowContainer1);
}, 200);


const onMouseMove = (e) => {
    player.css({ left: e.pageX - gameContainer.offset().left, top: e.pageY - gameContainer.offset().top, right: e.pageX - gameContainer.offset().right })

    // player.css({left:e.pageX - gameContainer.offset.left + 'px',top:e.pageY - gameContainer.offset.top + 'px'})
    // console.log(gameContainer.offset().left, gameContainer.offset().top);


}

function changeFloorColor() {
    colorBlock.addEventListener("mousemove", function (event) {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        event.target.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        // console.log(event.target);
    });

}


//create dance floor
for (i = 0; i < 300; ++i) {
    var elem = document.createElement("div");

    elem.style.width = "50px";
    elem.style.height = "50px";
    elem.style.cssFloat = "left";
    elem.style.border = "1px solid black";

    //   elem.onmouseover = changeColor;

    colorBlock.appendChild(elem);
}

// document.removeEventListener('mousemove', onMouseMove);

// =============================================================
// =============================================================


var outDim = gameContainer.offset();
outDim.right = (outDim.left + gameContainer.width());
outDim.bottom = (outDim.top + gameContainer.height());
gameContainer.on('mousemove', function (e) {
    var x = (e.clientX) ;
    var y = (e.clientY);
    var x_allowed = x >= outDim.left && x <= (outDim.right - player.width());
    var y_allowed = y >= outDim.top && y <= (outDim.bottom - player.height());
    if (y_allowed) {
        player.css({
            top: y - player.height()  + 'px',
        });
    } else {
        //fine tune tweaks
        if (y >= outDim.top) {
            player.css({
                top: (outDim.bottom - player.height()) + 'px',
            });
        }
        if (y <= (outDim.bottom - player.height())) {
            player.css({
                top: outDim.top  + 'px',
            });
        }
    }

    if (x_allowed) {
        player.css({
            left: x - outDim.left + 'px'
        });
    } else {
        //fine tune tweaks
        if (x >= outDim.left) {
            player.css({
                left: outDim.right - outDim.left - player.width() + 'px',
            });
        }
        if (x <= (outDim.right - player.width())) {
            player.css({
                left: outDim.left - outDim.left + 'px',
            });
        }
    }


});



gameContainer.append(player);
gameContainer.append(dancer);
gameContainer.append(colorBlock);

// gameContainer.on('mousemove', onMouseMove)

