export default function updateColor(color) {
  const subTextContainer = document.querySelector('.sub_text_container');
  if (subTextContainer) {
    const subTextSpan = subTextContainer.querySelector('.sub_text_span');
    if (subTextSpan) {
      const colorSpan = document.createElement('span');
      colorSpan.innerText = color;
      colorSpan.classList.add('sub_text_span_' + color);
      subTextSpan.innerText = 'You are ';
      subTextSpan.appendChild(colorSpan);
    }
  }
}
