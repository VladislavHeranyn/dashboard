function fadeToggle(element, display = 'block') {
  if (element.style.display === 'none') {
    element.style.display = display;
    element.style.opacity = 1;
  } else {
    element.style.display = 'none';
    element.style.opacity = 0;
  }
}

function fadeIn(element, display = 'block') {
  element.style.display = display;
  element.style.opacity = 1;
}
function fadeOut(element) {
  element.style.display = 'none';
  element.style.opacity = 0;
}

export default {
  fadeToggle,
  fadeOut,
  fadeIn
};
