const root = document.querySelector(".js-carousel");
const container = root.querySelector(".js-carouselContainer");
const content = root.querySelector(".js-carouselContent");
const items = root.querySelectorAll(".js-carouselItem");

const itemsLength = items.length;
const lastIndex = itemsLength - 1;
let currentIndex;

const controllers = createControllers();
const prevButton = controllers.prev;
const nextButton = controllers.next;
