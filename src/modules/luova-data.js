const dataUrl = `https://users.metropolia.fi/~rikuimm/luova.php`;

const createMenus = (menu) => {
  const courses = [];
  for (const course of menu.menu) {
    courses.push(course);
  }
  return courses;
};

const LuovaData = {dataUrl, createMenus};
export default LuovaData;
