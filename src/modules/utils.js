//Lunch menus

import {fetchData} from './network';
import SodexoData from './sodexo-data';
import MyllyData from './mylly-data';
import FazerData from './fazer-data';

const printMenu = (menu, targetId) => {
  const ulElement = document.querySelector('#' + targetId);
  ulElement.innerHTML = '';
  for (const item of menu) {
    const li = document.createElement('li');
    li.textContent = item;
    ulElement.appendChild(li);
  }
};

//Sodexo Myyrmäki
fetchData(SodexoData.dataUrl).then(data => {
  const courses = SodexoData.createMenus(data.courses);
  console.log('MYRTSI COURSES', courses);
  printMenu(courses, 'sodexoMenu');
});

//Sodexo Myllypuro
fetchData(MyllyData.dataUrl).then(data => {
  const courses = MyllyData.createMenus(data.courses);
  console.log('MYLLYPURO', courses);
});

const getDayIndex = () => {
  let weekday = new Date().getDay() - 1;
  // weekend no service, use fridays menu
  if (weekday >= 5) {
    weekday = 4;
  } else if (weekday < 0) {
    weekday = 4;
  }
  return weekday;
};

//Fazer Karaportti
fetchData(FazerData.dataUrlFi, {},'fazer-php').then(data => {
  const courses = FazerData.createDayMenu(data.LunchMenus, getDayIndex());
  console.log('FAZER COURSES', courses);
  printMenu(courses, 'fazerMenu');
});

const utils = {};
export default utils;
