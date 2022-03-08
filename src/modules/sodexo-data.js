const today = new Date().toISOString().split('T')[0];

const dataUrl = `https://www.sodexo.fi/ruokalistat/output/daily_json/152/${today}`;
//const dataUrl = `https://www.sodexo.fi/ruokalistat/output/daily_json/152/2022-02-28`;

const coursesEn = [];
const coursesFi = [];

/**
 * Create menus from sodexo data
 * @param {string} menu
 * @param {string} lang - language
 */
const createMenus = (menu, lang = 'fi') => {
  const courses = Object.values(menu);
  //console.log(courses);
  for (const course of courses) {
    coursesEn.push(course.title_en);
    coursesFi.push(course.title_fi);
  }
  return coursesFi;
};

const SodexoData = {dataUrl, createMenus, coursesFi};
export default SodexoData;
