import {getBooks, getLabels} from "./serviceBook.js";

const getStars = n => {
  const starts = [];
  for (let i = 0; i < 5; i++) {
    let str = '';
    if (i === 0) {
      str = `<img class="cart__rating-star" src="img/star.svg" alt="Рейтинг ${n} из 5">`
    } else if (i < n) {
      str = `<img class="cart__rating-star" src="img/star.svg" alt="">`
    } else {
      str = `<img class="cart__rating-star" src="img/star-o.svg" alt="">`
    }
    starts.push(str)
  }

  return starts;
}

export  const renderBook = async () => {
  const libraryList = document.querySelector('.library__list');

  const book = await getBooks();
  const labels = await getLabels();

  libraryList.textContent = '';

  book.map(({id, author, description, image, label, rating, title}) => {
    const item = document.createElement('li');
    item.innerHTML = `
    <a href="/#/book?id=${id}">
      <article class="cart">
        <div class="cart__wrapper">
          <img src="http://localhost:3024/${image}" alt="обложка 1984" class="cart__image">

          <p class="cart__label">${labels[label]}</p>
        </div>

        <div class="cart__content">
          <h3 class="cart__title">${title}</h3>

          <p class="cart__author">${author}</p>

          <p class="cart__description">${description.substring(0, 80)}...</p>

          <div class="cart__rating">
            ${getStars(rating).join('')}
          </div>
        </div>
      </article>
    </a>
    `;
    libraryList.append(item);
  })
};
