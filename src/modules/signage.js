const clock = (parent) => {
  const time = new Date(Date.now());

  const hours = time.getHours();
  const minutes = time.getMinutes() < 10 ?
    '0' + time.getMinutes() :
    time.getMinutes();
  parent.innerHTML = hours + '.' + minutes;

  setTimeout(() => clock(parent), 1000);
};

const carousel = (slides, pageIndicator, current, displayTime) => {
  if (current === slides.length) {
    current = 0;
  }

  slides.forEach((element, index) => {
    if (index === current) {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  });

  pageIndicator.innerHTML = `${current + 1} / ${slides.length}`;

  current++;

  setTimeout(() => carousel(slides, pageIndicator, current, displayTime),
    displayTime);
};

//const indicator = document.querySelector('#indicator');
//indicator.style.animation = `indicator ${displayTime / 1000}s linear infinite`;

/*
const lunchList = document.querySelector('#lunch ul');
let lunchFontSize = 1;
lunchList.style.lineHeight = 1.5;

while (lunchList.scrollHeight > lunchList.clientHeight) {
  lunchFontSize = 0.95 * lunchFontSize;
  lunchList.style.fontSize = lunchFontSize * 0.95 + 'em';
}
*/

const signage = {
  clock,
  carousel,
};

export default signage;
