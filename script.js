//----------------Declarations--------------------

const gridRows = document.getElementsByClassName('gridRow');
const keyBoard = document.getElementsByClassName('keyBoard')[0];
let squares = [
];


for (i=0; i < gridRows.length + 1; i++) {
    squares.push(document.getElementsByClassName(`row${[i]}`));
}

let keyWord;
let keyWordCaps;
let keyWordSplit;
// console.log(squares);



//random word api 
const settings = {
	"async": false,
	"crossDomain": true,
	"url": "https://random-word-api.herokuapp.com/word?length=5",
	"method": "GET",
    "origin": "no-cors"
};


$.ajax(settings).done(function (response) {
// console.log(response);
keyWord = String(response[0]);
});
//------------------------

//dictionary api ----------------------------------------------------
let wordLookup;

//activation button
const definitionButton = document.querySelector('.definitionButton');

//button listener
definitionButton.addEventListener('click', () => {
    wordLookup = keyWord;

    let settings2 = {
        "async": false,
        "crossDomain": true,
        "url": `https://api.dictionaryapi.dev/api/v2/entries/en/${wordLookup}`,
        "method": "GET",
        "origin": "no-cors"
    };

    $.ajax(settings2).done(function (response) {
        console.log(response);
        // console.log(response[0].meanings[0].definitions)
        // console.log(response[0].phonetic)
        // wordDefinition = response;
        pasteDef(response);
    });
    defCont.style.display = 'flex';
    setTimeout(() => {
        defCont.classList.add('visible');
    }, 10);
    
})

defCont = document.getElementsByClassName('defCont')[0];
defClose = document.getElementsByClassName('defClose')[0];
defClose.addEventListener('click', () => {
    defCont.classList.remove('visible');
    setTimeout(() => {
        defList.innerHTML = '';
        defCont.style.display = 'none';
    }, 300);
});
defWord = document.getElementsByClassName('defWord')[0];
defPhon = document.getElementsByClassName('defPhon')[0];
defList = document.getElementsByClassName('defList')[0];

function pasteDef(definition) {
    if (defCont.style.display !== 'flex') {
    defWord.innerHTML = `${keyWord}`;
    if (definition[0].phonetic !== undefined) {
    defPhon.innerHTML = `${definition[0].phonetic}`
    }
    let definitions = definition[0].meanings[0].definitions
    for (i=0; i < definitions.length; i++) {
        console.log(definitions[i].definition);
        let definition = document.createElement('p');
        definition.innerHTML = definitions[i].definition;
        defList.appendChild(definition);
    }
    }

}

///-------------











//-------KeyWord Set and Split for Checks --------
// keyWord = 'plonk'
// keyWordCaps = keyWord.toUpperCase();
// keyWordSplit = keyWordCaps.split('');
// console.log(keyWordSplit);
// console.log(keyWord);
keyWordSplit = keyWord.toUpperCase().split('');
//-------------------------

















var i = 0;
let score = 0;
function wordCheck(row, keyWordSplit) {   
  setTimeout(function() {   
    for (inT=0; inT < 5; inT++) {
        if (row[inT].value === keyWordSplit[inT]) {
            charCount[`${row[inT].value}`] -= 1;
            // console.log(charCount);
        };
    }
    if (i < 5) {           
        squareCheck(row[i], keyWordSplit[i]);
        i++;
        wordCheck(row, keyWordSplit);   //repeats 4 times 
        winFunc();  
    } else if(i === 5) {
        // console.log('Row has been checked, setting interval to 0')
        i = 0;
        score = 0;
        // console.log(i);
    }             
  }, 500)
};

let winRow;
function winFunc() {
    if (score === 5) {
        // console.log('wincheck');
        sharePrint();
        winRow = targetRow - 1;
        definitionButton.style.top = `${(winRow * 53) - 25}px`;
        definitionButton.style.display = 'flex';
        definitionButton.style.opacity = '1';
        keyBoard.style.opacity = '0';
        setTimeout(() => {
        keyBoard.style.opacity = '1'; 
        }, 2300);
        setTimeout(() => {
        // alert('You win');
        squares.forEach(element => {
           for(i=0;i<element.length;i++) {
                element[i].style.margin = '150px';
                let squareMargin = element[i];
                setTimeout(() => {
                    squareMargin.style.margin = '3px';
                }, 2000);
           }
        })
        i = 0;
        let winTitle = document.createElement('h1');
        winTitle.innerHTML = 'You Win!';
        document.body.appendChild(winTitle);
        winTitle.classList.add('winTitle');
        setTimeout(() => {
            winTitle.classList.add('winGrow');
        }, 10);
        setTimeout(() => {
            winTitle.classList.remove('winGrow');
            setTimeout(() => {
                document.body.removeChild(winTitle);
            }, 500);
        }, 1500);

        }, 300);
    } 
}


// counts instances of letters in keyword
let charCount = {};
function charCountF() {
charCount = {};
for (const char of keyWordSplit) {
    if (charCount[char] === undefined) {
    charCount[char] = 1;
    } else {
    charCount[char] += 1;
    }
}
// console.log(charCount);
}
charCountF();
//-----------

function squareCheck(row, keyWord) {
        if (row.value.toUpperCase() === keyWord.toUpperCase()) {
            score += 1;
            // console.log(`score = ${score}`);
            row.style.backgroundColor = '#6ca965';
            letterKeys[getKeyboardIndex(row.value)].classList.add('keyCorrect');
            row.style.border = 'none';
            row.style.transform = 'scale(1.05)';
            setTimeout(() => {
                row.style.transform = 'scale(1)';
            }, 500);
        } else if(keyWordSplit.includes(`${row.value}`)) {
            // console.log(`Letter ${row.value} included ${charCount[row.value]} times`);
            if (charCount[row.value] > 0) {
                row.style.backgroundColor = '#c8b653';
                letterKeys[getKeyboardIndex(row.value)].style.backgroundColor = '#c8b653';
                row.style.border = 'none';
                charCount[row.value] -= 1;
            } else {
                letterKeys[getKeyboardIndex(row.value)].style.backgroundColor = '#3A3A3C';
                row.style.backgroundColor = '#3A3A3C';
                row.style.border = 'none';
            }
        } else {
            row.style.backgroundColor = '#3A3A3C';
            row.style.border = 'none';
            letterKeys[getKeyboardIndex(row.value)].style.backgroundColor = '#3A3A3C';
        }
        return(score);
}



// ------------------------

let targetRow = 1;
let stage = 0;
window.addEventListener('keydown', e => {
    // console.log(`target row = ${targetRow}`);
    // console.log(`stage = ${stage}`);
    let targetSquare = squares[targetRow][stage];
    if(stage !==5) {
        if (targetSquare.value === '' && e.key!='Backspace' && e.key!='Enter') {
            squares[targetRow][stage].value = `${e.key.toUpperCase()}`;
            squares[targetRow][stage].style.transform = 'scale(1.1)';
            let targetRow2 = targetRow;
            let stage2 = stage;
            setTimeout(() => {
                squares[targetRow2][stage2].style.transform = 'scale(1)';
            }, 200);
            stage += 1;
        }
    }
    if(e.key === 'Backspace') {
        squares[targetRow][stage - 1].value = '';
        stage -= 1;
    }else if(e.key === 'Enter') {
        if (stage === 5) {
            wordCheck(squares[targetRow], keyWordSplit)
            targetRow += 1;
            score = 0;
            stage = 0;
            charCount = {};
            charCountF();
        } else {
            alert('please enter 5 letters');
        }
    } else {
        return;
    }
 
})

keys = document.getElementsByClassName('key');
// console.log(keys);
Array.from(keys).forEach(key => {
    key.addEventListener('click', () => {
        // console.log(`stage = ${stage}`);
        let targetSquare = squares[targetRow][stage];
        if (stage !==5) {
            if (targetSquare.value === '' && stage != 5 && key.innerHTML.length === 1) {
                squares[targetRow][stage].value = `${key.innerHTML}`;
                squares[targetRow][stage].style.transform = 'scale(1.1)';
                let targetRow2 = targetRow;
                let stage2 = stage;
                setTimeout(() => {
                    squares[targetRow2][stage2].style.transform = 'scale(1)';
                }, 200);
                stage += 1;
            }
        }
        if(key.innerHTML.length === 39) {
            squares[targetRow][stage - 1].value = '';
            stage -= 1;
        }else if(key.innerHTML.length === 5){
            // console.log('enter');
            if (stage === 5) {
                wordCheck(squares[targetRow], keyWordSplit)
                targetRow += 1;
                score = 0;
                stage = 0;
                charCount = {};
                charCountF();
            } else {
                alert('please enter 5 letters');
            }
        } else {
            return;
        }
    
    })
})



const letterKeys = document.querySelectorAll('.letR');

let keyArray = [];
letterKeys.forEach(key => {
    keyArray.push(key.innerHTML);
});

function getKeyboardIndex(keyVal) {
    let keyValue = keyVal
    let keyIndex = keyArray.findIndex( key => {
        return key === keyValue;
    })
    return keyIndex;
}




//cheat
hintB = document.querySelector('.hint');

hintB.addEventListener('click', () => {
    alert(keyWord);
});


//result share function
const shareCont = document.querySelector('.shareCont');
const shareTitle = document.getElementById('shareTitle');

let result = [];
let resultElement;
function sharePrint() {
    shareTitle.innerHTML = 'Share your score!'
    for (let rowI = 1; rowI < 7; rowI++) {
        for(i=0; i < 5; i++) {
            for (let j = 5; j < 51; j += 6) {
                if (result.length === j) {
                    result.push('<br>')
                }
            }
            // console.log(squares[1][i]);
            if (squares[rowI][i].style.backgroundColor === 'rgb(108, 169, 101)') {
                // console.log('green');
                result.push('🟩');
            } else if(squares[rowI][i].style.backgroundColor === 'rgb(200, 182, 83)') {
                // console.log('yellow');
                result.push('🟨');
            } else if(squares[rowI][i].style.backgroundColor === 'rgb(58, 58, 60)') {
                // console.log('black');
                result.push('⬛');
            }
        }
    }
    // console.log(result)
    let resultString = result.join('');
    let tries = targetRow - 1;
    let scoreText = `Will'dle&#8482; ${tries}/6<br>`
    resultElement = document.createElement('p')
    resultElement.innerHTML = scoreText + resultString;
    shareCont.appendChild(resultElement);
    // console.log(resultString)
}




//share button ----------------------------

const shareBtn = document.querySelector('.shareShow');
const shareClose = document.querySelector('.shareClose');

shareBtn.addEventListener('click', () => {
    shareCont.classList.toggle('show');
})

shareClose.addEventListener('click', () => {
    shareCont.classList.toggle('show');
})

// function copyToClipboard() {
//     let target = resultElement.innerHTML;
//     console.log(target)
//     document.execCommand("Copy");
//     alert(`Score copied to clipboard.`)
//     setTimeout( function(){
//         window.getSelection().empty();
//     },10)
// }



//--------------