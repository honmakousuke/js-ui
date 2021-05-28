import helloMessage from './hello.txt';

const helloContainer = () => {
  const container = document.createElement("div");
  container.innerHTML = "<p>" + helloMessage + "</p>";  // hello.txtを出力
  return container;
};

export default helloContainer;
