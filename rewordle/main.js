let txtSource = 'words.txt';
let words = [];
let word = '';
let attempt = 0;
let gameInProgress = false;

let rows = document.querySelectorAll('.row');
let input = document.querySelector('.input');
let button = document.querySelector('.button');

fetch(txtSource).then(txt => txt.text()).then(data => {
	words = data.split('\n');
	initGame();
});

input.addEventListener('input', event => {
	let value = event.target.value;
	if(value.length > 5){
		input.value = input.value.slice(0, 5);
	}

	let letters = rows[attempt].querySelectorAll('.letter');
	letters.forEach((item, index) => {
		item.innerHTML = input.value.slice(index, index + 1);
	});
});

document.querySelector('.button').addEventListener('click', e => {
	e.preventDefault();
	check();
});

document.querySelector('.resetButton').addEventListener('mouseup', resetGame);
document.querySelector('.message').addEventListener('mouseup', resetGame);

document.querySelector('.aboutButton').addEventListener('mouseup', e => {
	document.querySelector('.aboutContainer').classList.add('active');
});
document.querySelector('.closeButton').addEventListener('mouseup', e => {
	document.querySelector('.aboutContainer').classList.remove('active');
});

function resetGame(){
	attempt = 0;
	input.value = '';
	document.querySelector('.message').className = 'message';
	setTimeout(() => {
		document.querySelector('.messageContainer').classList.remove('active');
	}, 300);
	let allLetters = document.querySelectorAll('.letter');
	allLetters.forEach(item => {
		item.innerHTML = '';
		item.className = 'letter';
	});

	initGame();
}

function initGame(){
	word = getRandomWord();
	gameInProgress = true;
	input.disabled = false;
	input.focus();
	console.log(word);
}

function getRandomWord(){
	let randomNumber = Math.floor(Math.random() * words.length);
	return words[randomNumber];
}

function check(){
	if(input.value.length !== 5){
		console.log('Invalid input');
		return;
	}
	//TODO: add check for valid words (dictionary API????)

	input.value = input.value.toLowerCase();
	let answers = input.value.split('');
	let solutions = word.split('');
	let hints = [0, 0, 0, 0, 0];
	for(let i = 0; i < 5; i++){
		if(answers[i] === solutions[i]){
			hints[i] = 2;
		}
	}

	for(let i = 0; i < 5; i++){
		if(hints[i] === 2) continue;
		for(let j = 0; j < 5; j++){
			if(answers[i] === solutions[j] && i !== j && hints[j] !== 2){
				hints[i] = 1;
			}
		}
	}

	let letters = rows[attempt].querySelectorAll('.letter');
	for(let i = 0; i < 5; i++){
		setTimeout(checkLetter, i*300, hints[i], letters[i]);
	}

	if(input.value === word){
		setTimeout(winGame, 1500);
	}else{
		attempt++;
		input.focus();
	}
	
	if(attempt === 6){
		setTimeout(loseGame, 1500);
	}

	input.value = '';
}

function checkLetter(hint, element){
	switch(hint){
		case 0: element.classList.add('l-wrong'); break;
		case 1: element.classList.add('l-semi'); break;
		case 2: element.classList.add('l-right'); break;
	}
}

function winGame(){
	let message = document.querySelector('.message');
	message.className = 'message';
	message.innerHTML = "Nice!! 🎉🎉🎉<br>Click to restart";
	document.querySelector('.messageContainer').classList.add('active');
	message.classList.add('active');
}

function loseGame(){
	let message = document.querySelector('.message');
	message.className = 'message';
	message.innerHTML = "The answer was "
		+ word.toUpperCase()
		+ "!<br>Click to restart";
	document.querySelector('.messageContainer').classList.add('active');
	message.classList.add('lost');
	message.classList.add('active');
}