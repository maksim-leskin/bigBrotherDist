export const getBooks = async (id) => {
  const response = await fetch(`http://localhost:3024/api/books/${id || ''}`);
  if (response.ok) {
    return response.json();
  }

  throw new Error(response.statusText);
}

export const getLabels = async () => {
  const response = await fetch('http://localhost:3024/api/label');
  if (response.ok) {
    return await response.json();
  }

  throw new Error(response.statusText);
}


export const addBooks = async (data) => {
  console.warn(data)

  const response = await fetch('http://localhost:3024/api/books', {
    method: "POST",
    body: JSON.stringify(data)
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(response.statusText);
}

const updateData = async (id, data) => {
  const response = await fetch(`http://localhost:3024/api/books/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(response.statusText);
};


// const data = {
//   title: "Путешествия Души",
//     author: "Майкл Ньютон",
//   description: "То что описано в книге, окончательно снимает завесу тайны с самого загадочного процесса, который ожидает каждого из нас. Все, оказывается, не так плохо, как нам представляли на протяжении многих тысячелетий различные религиозные учения. Эта книга помогает нам взглянуть на смерть более оптимистично – не как на ужасное наказание, а как на возможность чудесного перехода в другую, полную свободы и духовных переживаний жизнь. Из этой книги Вы узнаете, как происходит удивительный процесс перевоплощения души: кто нас встретит после физической смерти, куда мы направимся дальше, кто являются нашими Гидами и ангелами хранителями, чем они занимаются и чем мы занимаемся после смерти, а также какая структура и иерархия существуют в том неизвестном нам мире. Вы также узнаете, почему и как мы выбираем свое тело, страну, в которой мы живем, профессию, друзей и даже «врагов». И все это не чьи-то выдумки и домыслы, не легенды и мифы различных религий, а результаты научно обоснованных исследований, проведенных одним из лучших гипнотерапевтов нашего времени доктором Майклом Ньютоном.",
// }




// (async () => {
//   console.log(await  getBooks())
//     console.log(await  getBooks("29132711381"))
//
// })();

