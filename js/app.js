'use strict'
console.log('Exercise 60 - Game of Life')

const END_IMG = '<img src="img/end2.jpg">'
const DEAD_SOUND = new Audio('sound/the end1.wav')

var gMenLife
var gWomenLife
var gBoysLife
var gGirlsLife
var gPeople
var gYears
var gIdxNums
var gBoard
var gGameInterval
var isFirstBoard

function initGame() {
    isFirstBoard = true
    gMenLife = 0
    gWomenLife = 0
    gBoysLife = 0
    gGirlsLife = 0
    gPeople = 15
    playGame()
}

function playGame() {
    gYears = 0
    gBoard = createBoard()
    randerBoard(gBoard)
    updateLifeTable()
    gGameInterval = setInterval(() => {
        gMenLife = 0
        gWomenLife = 0
        gBoysLife = 0
        gGirlsLife = 0
        gYears += 100
        checkNeighbors(gBoard)
        randerBoard(gBoard)
        updateLifeTable()
        changeHtml('.years', gYears + '.')
        if (checkIfGameOver()) gameOver()
    }, 3000)
}

function restart() {
    changeOpacity('.chance', '0')
    changeHtml('.years', ' ')
    initGame()
}

function gameOver() {
    DEAD_SOUND.play()
    clearInterval(gGameInterval)
    gPeople = 0
    changeHtml('.people', gPeople)
    changeHtml('.board', END_IMG)
    changeOpacity('.chance', '1')
}

function checkIfGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isLive) return false
        }
    }
    return true
}

function updateLifeTable() {
    changeHtml('.men', gMenLife + 'M.')
    changeHtml('.women', gWomenLife + 'M.')
    changeHtml('.man', gBoysLife + 'M.')
    changeHtml('.girls', gGirlsLife + 'M.')
    changeHtml('.people', gPeople + 'M.')
}

function changeOpacity(cell, value) {
    document.querySelector(cell).style.opacity = value
}

function changeHtml(cell, value) {
    document.querySelector(cell).innerHTML = value
}

function checkNeighbors(board) {
    var counter
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            counter = 0
            for (var d = i - 1; d <= i + 1; d++) {
                for (var c = j - 1; c <= j + 1; c++) {
                    if (d < 0 || d >= board.length - 1) continue
                    if (c < 0 || c >= board[0].length - 1) continue
                    if (board[d][c].isLive) counter++
                }
            }
            board[i][j].neighbors = counter
        }
    }
    return board
}

function randerBoard(board) {
    var strHtml = ``
    var newValue
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < board[i].length; j++) {
            if (!isFirstBoard) {
                if (board[i][j].neighbors < 3) board[i][j].isLive = false
                else if (board[i][j].neighbors < 6) board[i][j].isLive = true
                else if (board[i][j].neighbors > 5) board[i][j].isLive = false
            }
            newValue = board[i][j].isLive ? getPerson() : ''
            strHtml += `<td>${newValue}</td>`
        }
        strHtml += `</tr>`
    }
    changeHtml('.board', strHtml)
    isFirstBoard = false
    return strHtml
}

function addLife(board) {
    var idx
    var counter = 0
    gIdxNums = createIdxArr(board)
    while (counter < 15) {
        idx = getIdx(gIdxNums)
        board[idx.i][idx.j].isLive = true
        counter++
    }
    return board
}

function getPerson() {
    var currPerson
    var people = [
        { name: 'man', photo: '&#128104' },
        { name: 'woman', photo: '&#128105' },
        { name: 'boy', photo: '&#128102' },
        { name: 'girl', photo: '&#128103' },
    ]

    currPerson = people[getRandomInt(0, people.length)]

    if (currPerson.name === 'man') gMenLife++
    else if (currPerson.name === 'woman') gWomenLife++
    else if (currPerson.name === 'boy') gBoysLife++
    else if (currPerson.name === 'girl') gGirlsLife++

    gPeople = gMenLife + gWomenLife + gBoysLife + gGirlsLife

    return currPerson.photo
}

function createBoard() {
    var mat = []
    for (var i = 0; i < 5; i++) {
        mat[i] = []
        for (var j = 0; j < 5; j++) {
            mat[i][j] = {
                value: '',
                isLive: false,
                neighbors: 0
            }
        }
    }
    addLife(mat)
    return mat
}

function getIdx(nums) {
    var idx = getRandomInt(0, nums.length - 1)
    var currIdx = nums[idx]
    nums.splice(idx, 1)
    return currIdx
}

function createIdxArr(board) {
    var idxArr = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            idxArr.push({ i, j })
        }
    }
    return idxArr
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}