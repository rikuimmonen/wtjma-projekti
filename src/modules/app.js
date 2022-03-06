const createPageList = (parentElementName) => {
  const pages = document.querySelectorAll(parentElementName + ' > *');
  const pageList = new Map();

  pages.forEach((element, index) => {
    pageList.set('#' + element.id, index);
  });

  return pageList;
};

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
};

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

const app = { createPageList, createNav, showPage, nextPage };
export default app;