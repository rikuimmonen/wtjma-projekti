const today = new Date().toISOString().split('T')[0];

const dataUrl = `https://www.sodexo.fi/ruokalistat/output/daily_json/158/${today}`;

/**
 * Create menus from sodexo data
 * @param {string} menu
 * @param {string} lang - language
 */
const createMenus = (menu, lang = 'fi') => {
  const courses = Object.values(menu);
  const returnCourses = [];
  for (const course of courses) {
    if (lang === 'fi') {
      returnCourses.push(course.title_fi);
    } else {
      returnCourses.push(course.title_en);
    }
  }
  return returnCourses;
};

const MyllyData = {dataUrl, createMenus};
export default MyllyData;
