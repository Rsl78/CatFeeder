// Get DOM elements
const feeder = document.getElementById('feeder');
const cat = document.getElementById('cat');
const cat2 = document.getElementById('cat2');
const scorePointText = document.getElementById('score_point');
const first = document.getElementById('first')
const second = document.getElementById('second')
const third = document.getElementById('third')

// variables
const list = [first, second, third];
const leaderBoardList = [];
let isMoving = false;
let status = 'cry';
let gameIsRunning = false;
let startTime;
let runningTime = 0;
let intervalId;

const getElementPosition = (element) => {
    let positionX = element.offsetLeft;
    let positionY = element.offsetTop;
    return [positionX, positionY];
}

let [feederPositionX, feederPositionY] = getElementPosition(feeder);
let [catPositionX, catPositionY] = getElementPosition(cat);

const addListeners = () => {
    feeder.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    if (localStorage.getItem('leaderBoard') === null) {
        let stringifyLeaderBoard = JSON.stringify(leaderBoardList);
        localStorage.setItem('leaderBoard', stringifyLeaderBoard);
    }
}

const startTimer = () => {
    startTime = Date.now();
    intervalId = setInterval(updateTimer, 1);
    setTimeout(stopTimer, 5000);
}

const updateTimer = () => {
    const currentTime = Date.now();
    runningTime = currentTime - startTime;
    const seconds = Math.floor((runningTime % (1000 * 60)) / 1000);
    const milliseconds = runningTime % 100;
    scorePointText.innerHTML = `${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

const stopTimer = () => {
    clearInterval(intervalId);
    gameIsRunning = false;
}

const setStatus = () => {
    let distance = (Math.round(calculateDistance() - 142))
    if (isMoving) {
        return 'otw'
    } else if (Math.abs(distance) < 50 && !isMoving) {
        return 'gotIt'
    } else {
        return 'cry'
    }
}

//comment added for checking
const showSetStoreItem = (time) => {
    const store = localStorage.getItem('leaderBoard');
    if (store === null) {
        return;
    }
    const parsedData = JSON.parse(store);
    if (parsedData?.length > 0) {
        const newData = [...parsedData, time];
        newData.sort();
        console.log(newData);
        const topThree = newData.slice(0, 3);
        localStorage.setItem("leaderBoard", JSON.stringify(topThree));
    } else {
        localStorage.setItem("leaderBoard", JSON.stringify([time]));
    }
}

const mouseUp = () => {
    window.removeEventListener('mousemove', feederMove, true);
    isMoving = false;
    status = setStatus();
    changeText(status);

    if (status === 'gotIt') {
        stopTimer();
        showSetStoreItem(scorePointText.innerHTML);
        changeLeaderBoard();
    }
}

const mouseDown = (e) => {
    e.preventDefault();
    isMoving = true;
    if (!gameIsRunning) {
        gameIsRunning = true;
        startTimer();
    }
    window.addEventListener('mousemove', feederMove, true);
    status = setStatus();
    changeText(status);
}

const feederCurrentPosition = (xValue, yValue) => {
    feederPositionX = xValue - 50; //50
    feederPositionY = yValue - 220; //220
    return [feederPositionX, feederPositionY];
}

const calculateDistance = () => {
    return Math.sqrt(Math.pow((catPositionX - feederPositionX), 2) + Math.pow((catPositionY - feederPositionY), 2));
}

const changeDistanceText = (distance) => {
    const distancePosition = document.getElementById('position');
    let distanceText;
    if (distance < 50) {
        distanceText = 0;
    } else {
        distanceText = distance;
    }
    distancePosition.innerText = distanceText
}

const changeCatImage = (distance) => {
    if (distance < 300) {
        cat.style.display = 'none';
        cat2.style.display = 'block';
    } else {
        cat.style.display = 'block';
        cat2.style.display = 'none';
    }
}

const changeText = (status) => {
    const statusPosition = document.getElementById('right_side_content');
    if (status === 'otw') {
        statusPosition.innerText = "Milk is on the way";
    } else if (status === 'gotIt') {
        statusPosition.innerText = "Yay! I love milk";
    } else if (status === 'cry') {
        statusPosition.innerText = 'OH! Don\'t do that...'
    }
}

const changeLeaderBoard = () => {
    const storedLeaderBoard = JSON.parse(localStorage.getItem('leaderBoard'));
    for (let i = 0; i < storedLeaderBoard.length; i++) {
        list[i].innerHTML = storedLeaderBoard[i];
    }
}

const feederMove = (e) => {
    const [feederPositionX, feederPositionY] = feederCurrentPosition(e.clientX, e.clientY)
    feeder.style.top = feederPositionY + 'px';
    feeder.style.left = feederPositionX + 'px';
    let distance = Math.abs((Math.round(calculateDistance() - 142)))
    changeDistanceText(distance);
    changeCatImage(distance);
}

addListeners();
changeLeaderBoard()









