const today = new Date().toISOString().split('T')[0];

const dataUrlFi = `https://www.foodandco.fi/api/restaurant/menu/week?language=fi&restaurantPageId=270540&weekDate=${today}`;
const dataUrlEn = `https://www.foodandco.fi/api/restaurant/menu/week?language=en&restaurantPageId=270540&weekDate=${today}`;

/**
 *
 * @param {Array} lunchMenus - menu data
 * @param {Number} day
 * @returns {Array} daily menu
 */
const createDayMenu = (lunchMenus, day) => {
  const dayMenu = lunchMenus[day].SetMenus.map(setMenu => {
    //const mealName = setMenu.Name;
    let meals = '';
    for (const meal of setMenu.Meals) {
      //console.log(meal);
      meals += meal.Name + ', ';
    }
    return meals;
  });
  return dayMenu;
};

const FazerData = {dataUrlEn, dataUrlFi, createDayMenu};
export default FazerData;
