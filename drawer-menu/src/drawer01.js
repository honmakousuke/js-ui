// import menuContainer from './lib/menu-container';
import './assets/index.scss'; // scssファイルをimport

(function () {
  // HamburgerButton clicked
  // querySelector: cssセレクタで要素を取得
  const $hamburger = document.querySelector('.hamburger');
  $hamburger.addEventListener('click', () => {
    $hamburger.classList.toggle('is-active')
  });

  //全体を囲む要素をid[#wrapper]で指定
  const $wrapper = document.getElementById('wrapper');
  const $navBtn = document.getElementById('nav-btn');

  //クリックしたら navToggle関数実行
  $navBtn.addEventListener('click', navToggle);

  //navToggle関数
  function navToggle() {
    if ($wrapper.classList.contains('nav-open')) {
      navCloseFunc();
    } else {
      navOpenFunc();
    }
  }

  function navOpenFunc() {
    $wrapper.classList.add('nav-open');
  }
  function navCloseFunc() {
    $wrapper.classList.remove('nav-open');
  }
})();


// menuContainer();
