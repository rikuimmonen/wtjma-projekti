/**
 * Creates a map for navigation and routing
 * @param {string} parentElementName The name of the parent of the <section>-elements
 * @returns {map} List of ids of <section>-elements and their corresponding indexes
 */

const createPageList = (parentElementName) => {
  const pages = document.querySelectorAll(parentElementName + ' > *');
  const pageList = new Map();

  pages.forEach((element, index) => {
    pageList.set('#' + element.id, index);
  });

  return pageList;
};

/**
 * Populates navigation with correct links to <section>-elements
 * @param {string} parentElementName The name of the element that wraps the navigation, usually 'nav
 * @param {map} pageList created with createPageList-function
 */

const createNav = (parentElementName, pageList) => {
  const parent = document.querySelector(parentElementName);
  const ul = document.createElement('ul');
  const pageIds = [...pageList.keys()];

  pageIds.forEach((pageId) => {
    const title = document.querySelector(pageId + ' h2').innerText;
    const li = document.createElement('li');
    const a = document.createElement('a');

    li.appendChild(a);
    ul.appendChild(li);

    a.innerText = title;
    a.href = pageId;
    a.addEventListener('click', (event) => {
      event.preventDefault();
      location = event.target.href;
    });
  });

  parent.appendChild(ul);

  window.addEventListener('DOMContentLoaded', () => {
    app.showPage(pageList);
  });

  window.addEventListener('hashchange', () => {
    app.showPage(pageList);
  });
};

/**
 * Displays the <section> corresponding with the current page's URL's hash (eg. #lunch)
 * @param {map} pageList created with createPageList-function
 */

const showPage = (pageList) => {
  const pageIds = [...pageList.keys()];

  pageIds.forEach((id) => {
    document.querySelector(id).style.display = 'none';
  });

  if (pageList.has(location.hash)) {
    document.querySelector(location.hash).style.display = 'block';
  } else {
    document.querySelector(pageIds[0]).style.display = 'block';
  }
};

/**
 * Changes the URL hash to next or prev item on the pageList
 * @param {map} pageList created with createPageList-function
 * @param {boolean} forward does the link go backwards or forwards on the pageList
 */

const nextPage = (pageList, forward = true) => {
  let current = pageList.get(location.hash) || 0;
  let next;

  if (forward) {
    next = current + 1;

    if (next >= pageList.size) {
      next = 0;
    }
  } else {
    next = current - 1;

    if (next < 0) {
      next = pageList.size - 1;
    }
  }

  location.hash = [...pageList.keys()][next];
};

/**
 * Add prev and next buttons to sections
 * @param {map} pageList created with createPageList-function
 */

const addSectionNavButtons = (pageList) => {
  const pageIds = [...pageList.keys()];

  for (const id of pageIds) {
    const next = document.createElement('button');
    next.innerHTML = '&rarr;';
    next.addEventListener('click', () => {
      app.nextPage(pageList);
    });

    const prev = document.createElement('button');
    prev.innerHTML = '&larr;';
    prev.addEventListener('click', () => {
      app.nextPage(pageList, false);
    });

    document.querySelector(id).appendChild(prev);
    document.querySelector(id).appendChild(next);
  }
};

const app = {
  createPageList,
  createNav,
  showPage,
  nextPage,
  addSectionNavButtons,
};

export default app;
