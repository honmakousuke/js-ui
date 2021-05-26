const root = document.querySelector(".js-carousel");
const container = root.querySelector(".js-carouselContainer");
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
  controllersFragment.appendChild(prevButton);
  controllersFragment.appendChild(nextButton);
  container.appendChild(controllersFragment);
  footer.appendChild(indicator);
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
}

function slideAnim(index) {
  const distance = -100 * index;
  content.style.transform = "translateX(" + distance +"%)"
}

function onClickIndicatorButton(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() !== "button") {
    return;
  }
  const index = indicatorButtons.indexOf(target);
  changeItem(index);
}

function init() {
  prevButton.addEventListener("click", onClickPrevButton, false);
  nextButton.addEventListener("click", onClickNextButton, false);
  indicator.addEventListener("click", onClickIndicatorButton, false);
  appendNavigations();
  changeItem(0);
}

init();

