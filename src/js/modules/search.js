const btnSearch = document.querySelectorAll('.header__btn_search');
const search = document.querySelector('.search');

const closeSearch = ({target}) => {
  if (target.closest('.search, .header__btn_search')) {
    return;
  }
  search.classList.remove('search_active');
  document.body.removeEventListener('click', closeSearch);
};

btnSearch.forEach(btn => {
  btn.addEventListener('click', () => {
    search.classList.add('search_active');
    document.body.addEventListener('click', closeSearch, true);
  });
});
