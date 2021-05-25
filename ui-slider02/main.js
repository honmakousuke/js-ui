const root = document.querySelector(".js-carousel");
const container = root.querySelector(".js-carouselContainer");
const content = root.querySelector(".js-carouselContent");
const items = root.querySelectorAll(".js-carouselItem");

const itemsLength = items.length;
const lastIndex = itemsLength - 1;
let currentIndex;

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

function appendNavigations() {
  const controllersFragment = document.createDocumentFragment();
  controllersFragment.appendChild(prevButton);
  controllersFragment.appendChild(nextButton);
  container.appendChild(controllersFragment);
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

function changeItem(index) {
  if (index === currentIndex) {
    return;
  }
  slideAnim(index);
  updateControllerDisabledProp(prevButton, "prev", index === 0);
  updateControllerDisabledProp(nextButton, "next", index === lastIndex);
  currentIndex = index;
}

function slideAnim(index) {
  const distance = -100 * index;
  content.style.transform = "translateX(" + distance +"%)"
}

function init() {
  prevButton.addEventListener("click", onClickPrevButton, false);
  nextButton.addEventListener("click", onClickNextButton, false);
  appendNavigations();
  changeItem(0);
}

init();
