let player = document.getElementById('boydancer');
let gameContainer = document.getElementById('game-container');
let rainbowContainer = document.getElementById('rainbow-container');

function ForEachNode(f, par)
{
	var no = par.childNodes;
	for (var i = 0; i < no.length; i++)
	{
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
    for (var i = 0; i < 6; i++ ) {
        color += LettersList[Math.round(Math.random() * 15)];
    }
    return color;
}

var Msgs = new Array();
Msgs[0] = 'Hax?';
Msgs[1] = 'LOL!';

function Rand(tb)
{
  return tb[Math.floor(tb.length * Math.random())];
}

for (var i = 0; i < 2; i++)
{
  var p = document.createElement('P');
  var txt = document.createTextNode(Rand(Msgs));
  p.appendChild(txt);
    rainbowContainer.appendChild(p);
}

setInterval(function()
{
	ForEachNode(function(n){
		if (n.style != undefined)
    {
      var col = GetRandomColor();
	    n.style.backgroundColor = col;
        n.style.color = ReverseColor(col);
    }
	}, rainbowContainer);
}, 200);


const onMouseMove = (e) =>{
    player.style.left = e.pageX + 'px';
    player.style.top = e.pageY +'px';
}

gameContainer.addEventListener('mousemove', onMouseMove);
// document.removeEventListener('mousemove', onMouseMove);