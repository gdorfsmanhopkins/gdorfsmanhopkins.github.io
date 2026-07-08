async function loadSharedComponents() {
  const components = [
    { selector: '#header-placeholder', path: '/header.html' },
    { selector: '#sidebar-placeholder', path: '/sidebar.html' },
    { selector: '#footer-placeholder', path: '/footer.html' }
  ];

  await Promise.all(components.map(async ({ selector, path }) => {
    const placeholder = document.querySelector(selector);
    if (!placeholder) {
      return;
    }

    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) {
        console.error('Could not load component:', path, response.status);
        return;
      }
      placeholder.outerHTML = await response.text();
    } catch (error) {
      console.error('Error loading component:', path, error);
    }
  }));

  highlightCurrentPageNav();
}

function highlightCurrentPageNav() {
  const menu = document.querySelector('#menu');
  if (!menu) {
    return;
  }

  const currentPath = location.pathname.replace(/\/index\.html$/, '/');
  menu.querySelectorAll('li').forEach((li) => li.classList.remove('selected'));

  const navLinks = Array.from(menu.querySelectorAll('a'));
  for (const link of navLinks) {
    const filename = location.pathname.split("/").pop().toLowerCase();

    const aliases = {
      "publications.html": "research.html",
      "art.html": "research.html",
      "illustration.html": "research.html",
      "initiatives.html": "research.html"
    };

    const mapped = aliases[filename];
    const href = link.getAttribute('href');

    const hrefFilename = href.split("/").pop().toLowerCase();

    if (mapped && hrefFilename === mapped) {
        link.closest("li")?.classList.add("selected");
        return;
    }

    if (!href) {
      continue;
    }

    const linkPath = new URL(href, location.origin).pathname.replace(/\/index\.html$/, '/');
    const isHomeLink = linkPath === '/';
    const matchPrefix = isHomeLink ? linkPath : linkPath.replace(/\.html$/, '/');

    if (isHomeLink ? currentPath === '/' : currentPath === linkPath || currentPath.startsWith(matchPrefix)) {
      link.closest('li')?.classList.add('selected');
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', loadSharedComponents);
