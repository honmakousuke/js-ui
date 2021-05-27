const root = document.querySelector(".js-carousel");
const container = root.querySelector(".js-carouselContainer");
const stage = root.querySelector(".js-carouselStage");
const content = root.querySelector(".js-carouselContent");
const items = root.querySelectorAll(".js-carouselItem");
const footer = root.querySelector(".js-carouselFooter");

const itemsLength = items.length;
const lastIndex = itemsLength - 1;
let currentIndex;

const nav = createIndicator(itemsLength);
const indicator = nav.list;
const indicatorButtons = nav.buttons;
const prevButton = createButton(["Carousel-button", "_prev"], "前のパネルを表示");
const nextButton = createButton(["Carousel-button", "_next"], "次のパネルを表示");
const controllersDisabledStatus = {
  prev: false,
  next: false
};

const thresholdBase = 0.3;
const pointer = {
  startX: 0,
  startY: 0,
  moveX: 0,
  moveY: 0,
  hold: false,
  click: false,
};
let currentTransformValue = "";

const autoInterval = 3000;
let autoPlay = true;
let timeoutId = null;

const playButton = createButton(["Carousel-playButton"], "自動再生を開始する");
const pauseButton = createButton(["Carousel-pauseButton"], "自動再生を停止する");

function createButton(classNames, text) {
  const button = document.createElement("button");
  const textNode = document.createTextNode(text);
  button.setAttribute("type", "button");
  // IE11はElement.classList.addに複数の引数が指定できない
  classNames.forEach(function (className) {
    button.classList.add(className);
  });
  // IE11に対応しない場合
  // button.classList.add.apply(button.classList, classNames);
  // またはスプレッド演算子が使えるなら
  // button.classList.add(...classNames);
  button.appendChild(textNode);
  return button;
}

function createIndicator(count) {
  const ol = document.createElement("ol");
  const buttons = [];
  for (let i = 0; i < count; i++) {
    const li = document.createElement("li");
    const button = createButton(["Carousel-indicatorButton"], i + 1);
    li.classList.add("Carousel-indicatorItem");
    li.appendChild(button);
    ol.appendChild(li);
    buttons.push(button);
  }
  ol.classList.add("Carousel-indicator");

  return {
    list: ol,
    buttons: buttons
  }
}

function appendNavigations() {
  const controllersFragment = document.createDocumentFragment();
  const footerFragment = document.createDocumentFragment();
  controllersFragment.appendChild(prevButton);
  controllersFragment.appendChild(nextButton);
  container.appendChild(controllersFragment);
  footerFragment.appendChild(playButton);
  footerFragment.appendChild(pauseButton);
  footerFragment.appendChild(indicator);
  if (autoPlay) {
    playButton.disabled = true;
  } else {
    pauseButton.disabled = true;
  }
  footer.appendChild(footerFragment);
}

function onClickPrevButton(event) {
  const prevIndex = currentIndex - 1;
  if (prevIndex < 0) {
    return;
  }
  changeItem(prevIndex);
}

function onClickNextButton(event) {
  const nextIndex = currentIndex + 1;
  if (nextIndex > lastIndex) {
    return;
  }
  changeItem(nextIndex);
}

function updateControllerDisabledProp(button, key, disablingCondition) {
  const needUpdate = disablingCondition !== controllersDisabledStatus[key];
  if (!needUpdate) {
    return;
  }
  button.disabled = disablingCondition;
  controllersDisabledStatus[key] = disablingCondition;
}

function updateIndicatorDisabledProp(index) {
  if (currentIndex > -1) {
    indicatorButtons[currentIndex].disabled = false;
  }
  indicatorButtons[index].disabled = true;
}

function changeItem(index) {
  if (index === currentIndex) {
    return;
  }
  slideAnim(index);
  updateControllerDisabledProp(prevButton, "prev", index === 0);
  updateControllerDisabledProp(nextButton, "next", index === lastIndex);
  updateIndicatorDisabledProp(index);
  currentIndex = index;
  if (autoPlay) {
    autoNext();
  }
}

function slideAnim(index) {
  const distance = -100 * index;
  const transformValue = "translateX(" + distance + "%)";
  content.style.transform = transformValue;
  currentTransformValue = transformValue;
}

function onClickIndicatorButton(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() !== "button") {
    return;
  }
  const index = indicatorButtons.indexOf(target);
  changeItem(index);
}

function pointerDown(clientX, clientY) {
  pointer.startX = clientX;
  pointer.startY = clientY;
  pointer.hold = true;
  content.style.transitionDuration = "0s";
  pause();
}

function onTouchstart(event) {
  if (event.targetTouches.length > 1) {
    return;
  }
  const targetTouch = event.targetTouches[0];
  pointerDown(targetTouch.clientX, targetTouch.clientY);
}

function onPointerdown(event) {
  // if (event.pointerType !== "touch" || !event.isPrimary) {
  if (!event.isPrimary) {
    return;
  }
  event.preventDefault();
  pointerDown(event.clientX, event.clientY);
}

function pointerMove(clientX, clientY) {
  const moveX = clientX - pointer.startX;
  const additionalTransformValue = `translateX(${moveX}px)`;
  pointer.moveX = moveX;
  pointer.moveY = clientY - pointer.startY;
  content.style.transform = currentTransformValue + " " + additionalTransformValue;
}

function onTouchmove(event) {
  if (event.targetTouches.length > 1 || !pointer.hold) {
    return;
  }
  const targetTouch = event.targetTouches[0];
  pointerMove(targetTouch.clientX, targetTouch.clientY);
}

function onPointermove(event) {
  // if (event.pointerType !== "touch" || !event.isPrimary || !pointer.hold) {
  if (!event.isPrimary || !pointer.hold) {
    return;
  }
  event.preventDefault();
  pointerMove(event.clientX, event.clientY);
}

function pointerUp() {
  const nextIndex = getIndexSwipeEnd();
  content.style.transitionDuration = "";
  if (nextIndex === currentIndex) {
    content.style.transform = currentTransformValue;
  } else {
    changeItem(nextIndex)
  }
  if (!pointer.moveX && !pointer.moveY) {
    pointer.click = true;
  } else {
    resetPointerObj();
  }
  pointer.startX = 0;
  pointer.moveX = 0;
  pointer.hold = false;
  play();

  // function getIndexSwipeEnd() { ... }
  function getIndexSwipeEnd() {
    const absoluteMoveX = Math.abs(pointer.moveX);
    const addIndex = pointer.moveX > 0 ? -1 : 1;
    if (
      (absoluteMoveX < container.clientWidth * thresholdBase) ||
      (currentIndex === 0 && addIndex === -1) ||
      (currentIndex === lastIndex && addIndex === 1)
    ) {
      return currentIndex;
    }
    return currentIndex + addIndex;
  }
}

function onTouchend(event) {
  if (event.targetTouches.length > 1 || !pointer.hold) {
    return;
  }
  pointerUp();
}

function onPointerup(event) {
  // if (event.pointerType !== "touch" || !event.isPrimary || !pointer.hold) {
  if (!event.isPrimary || !pointer.hold) {
    return;
  }
  event.preventDefault();
  pointerUp();
}

// クリック時のイベントハンドラを追加
function onClick(event) {
  if (!pointer.click) {
    event.preventDefault();
    return;
  }
  resetPointerObj();
}

// pointerオブジェクトをリセットする関数を追加した
function resetPointerObj() {
  pointer.startX = 0;
  pointer.startY = 0;
  pointer.moveX = 0;
  pointer.moveY = 0;
  pointer.hold = false;
  pointer.click = false;
}

function addTouchActionNone() {
  stage.style.touchAction = "none";
}

function autoNext() {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(function () {
    const nextIndex = currentIndex + 1;
    const targetIndex = nextIndex > lastIndex ? 0 : nextIndex;
    changeItem(targetIndex);
  }, autoInterval)
}

function play() {
  autoPlay = true;
  autoNext();
}

function pause() {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  autoPlay = false;
}

function onPointerenter(event) {
  if (event.pointerType === "touch") {
    return;
  }
  pause();
}

function onPointerleave(event) {
  if (event.pointerType === "touch") {
    return;
  }
  play();
}

function onClickPlayButton(event) {
  playButton.disabled = true;
  pauseButton.disabled = false;
  play();
}

function onClickPauseButton(event) {
  pauseButton.disabled = true;
  playButton.disabled = false;
  pause();
}

function init() {
  prevButton.addEventListener("click", onClickPrevButton, false);
  nextButton.addEventListener("click", onClickNextButton, false);
  playButton.addEventListener("click", onClickPlayButton, false);
  pauseButton.addEventListener("click", onClickPauseButton, false);
  indicator.addEventListener("click", onClickIndicatorButton, false);
  if ("PointerEvent" in window) {
    addTouchActionNone();
    stage.addEventListener("pointerdown", onPointerdown, false);
    stage.addEventListener("pointermove", onPointermove, false);
    stage.addEventListener("pointerup", onPointerup, false);
    stage.addEventListener("pointercancel", onPointerup, false);
    stage.addEventListener("pointerleave", onPointerup, false);
    stage.addEventListener("pointerenter", onPointerenter, false);
    stage.addEventListener("pointerleave", onPointerleave, false);
  } else if ("ontouchstart" in windows) {
    stage.addEventListener("touchstart", onTouchstart, false);
    stage.addEventListener("touchmove", onTouchmove, false);
    stage.addEventListener("touchend", onTouchend, false);
    stage.addEventListener("touchcancel", onTouchend, false);
  } else {
    stage.addEventListener("mouseenter", onPointerenter, false);
    stage.addEventListener("mouseleave", onPointerleave, false);
  }
  stage.addEventListener("click", onClick, false);
  appendNavigations();
  changeItem(0);
}

init();

