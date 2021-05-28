const aboutContainer = () => {
  const container = document.createElement("div");
  const message = 'About webpack.';
  container.innerHTML = `<p>${message}</p>`;
  return container;
};

export default aboutContainer;
