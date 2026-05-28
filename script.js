// 화면에서 사용할 HTML 요소를 가져옵니다.
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const timeDisplay = document.getElementById("timeDisplay");
const warningMessage = document.getElementById("warningMessage");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// 타이머 상태를 저장하는 변수입니다.
let timerId = null;
let totalSeconds = 30;
let initialSeconds = 30;
let isRunning = false;

// 숫자를 항상 두 자리로 보여주기 위한 함수입니다. 예: 7 -> 07
function padNumber(number) {
  return String(number).padStart(2, "0");
}

// 초 단위 시간을 MM:SS 형식으로 화면에 표시합니다.
function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  timeDisplay.textContent = `${padNumber(minutes)}:${padNumber(remainingSeconds)}`;
}

// 입력된 분과 초를 읽어 전체 초로 바꿉니다.
function getInputSeconds() {
  const minutes = Number(minutesInput.value) || 0;
  const seconds = Number(secondsInput.value) || 0;

  return minutes * 60 + seconds;
}

// 경고 효과를 켜거나 끄는 함수입니다.
function setAlertState(isAlert) {
  document.body.classList.toggle("alert", isAlert);
  warningMessage.classList.toggle("show", isAlert);
}

// 초 입력값은 0부터 59까지만 허용합니다.
function limitSecondsInput() {
  let seconds = Number(secondsInput.value);

  if (seconds < 0) {
    seconds = 0;
  }

  if (seconds > 59) {
    seconds = 59;
  }

  secondsInput.value = seconds;
}

// 입력값이 바뀌면 아직 실행 중이 아닐 때 화면 표시도 같이 바꿉니다.
function syncDisplayWithInputs() {
  limitSecondsInput();

  if (!isRunning) {
    totalSeconds = getInputSeconds();
    initialSeconds = totalSeconds;
    updateDisplay(totalSeconds);
    setAlertState(false);
  }
}

// 타이머를 1초씩 줄이는 함수입니다.
function tick() {
  if (totalSeconds > 0) {
    totalSeconds -= 1;
    updateDisplay(totalSeconds);
  }

  if (totalSeconds === 0) {
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
    setAlertState(true);
  }
}

// START 버튼을 누르면 타이머를 시작합니다.
function startTimer() {
  if (isRunning) {
    return;
  }

  setAlertState(false);

  if (totalSeconds === 0) {
    totalSeconds = getInputSeconds();
    initialSeconds = totalSeconds;
  }

  if (totalSeconds <= 0) {
    updateDisplay(0);
    return;
  }

  isRunning = true;
  timerId = setInterval(tick, 1000);
}

// PAUSE 버튼을 누르면 현재 시간에서 일시정지합니다.
function pauseTimer() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
}

// RESET 버튼을 누르면 처음 입력했던 시간으로 되돌립니다.
function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
  totalSeconds = initialSeconds;
  updateDisplay(totalSeconds);
  setAlertState(false);
}

// 버튼과 입력창에 이벤트를 연결합니다.
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
minutesInput.addEventListener("input", syncDisplayWithInputs);
secondsInput.addEventListener("input", syncDisplayWithInputs);

// 처음 페이지가 열렸을 때 기본 시간을 표시합니다.
updateDisplay(totalSeconds);
