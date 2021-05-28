
// HamburgerButton clicked
// querySelector: cssセレクタで要素を取得
const $hamburger = document.querySelector('.hamburger');
$hamburger.addEventListener('click', () => {
  $hamburger.classList.toggle('is-active')
});
