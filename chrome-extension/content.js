(() => {
  const el =
    document.querySelector('article') ||
    document.querySelector('main') ||
    document.querySelector('.post-content') ||
    document.body;

  return {
    text: el.innerText.slice(0, 50000),
    title: document.title,
    url: location.href,
  };
})();
