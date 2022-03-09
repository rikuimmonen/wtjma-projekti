//Lunch menus

import {fetchData} from './network';
import SodexoData from './sodexo-data';
import MyllyData from './mylly-data';
import FazerData from './fazer-data';
import LuovaData from './luova-data';

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

const printMenu = (menu) => {
  const ul = document.createElement('ul');
  for (const course of menu) {
    console.log(course);
    const li = document.createElement('li');
    li.textContent = course;
    ul.appendChild(li);
  }
  document.querySelector('#lunch header').after(ul);
};

const getLunch = () => {
  const storedCampus = JSON.parse(localStorage.getItem('location')) || { "location": "" };
  const campusName = storedCampus.nameFi;
  switch (campusName) {
    case 'Arabian kampus':
      fetchData(LuovaData.dataUrl, {}, 'allorigins').then(data => {
        const courses = LuovaData.createMenus(data[getDayIndex() + 1]);
        console.log('LUOVA COURSES', courses);
        printMenu(courses);
      });
      break;
    case 'Karamalmin kampus':
      fetchData(FazerData.dataUrlFi, {}, 'fazer-php').then(data => {
        const courses = FazerData.createDayMenu(data.LunchMenus, getDayIndex());
        console.log('FAZER COURSES', courses);
        printMenu(courses);
      });
      break;
    case 'Myllypuron kampus':
      fetchData(MyllyData.dataUrl).then(data => {
        const courses = MyllyData.createMenus(data.courses);
        console.log('MYLLYPURO', courses);
        printMenu(courses);
      });
      break;
    case 'Myyrmäen kampus':
      fetchData(SodexoData.dataUrl).then(data => {
        const courses = SodexoData.createMenus(data.courses);
        console.log('MYRTSI COURSES', courses);
        printMenu(courses);
      });
      break;
    default:
      console.log('lol');
  }
};

/*//Sodexo Myyrmäki
fetchData(SodexoData.dataUrl).then(data => {
  const courses = SodexoData.createMenus(data.courses);
  //console.log('MYRTSI COURSES', courses);
  //printMenu(courses, 'sodexoMenu');
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
  //printMenu(courses, 'fazerMenu');
});

//Luova Arabia
fetchData(LuovaData.dataUrl, {}, 'allorigins').then(data => {
  //console.log('LUOVA DATA', data[getDayIndex()+1]);
  const courses = LuovaData.createMenus(data[getDayIndex()+1]);
  console.log('LUOVA COURSES', courses);
  //printMenu(courses, 'luovaMenu');
});*/

getLunch();

const utils = {getDayIndex, printMenu, getLunch};
export default utils;
