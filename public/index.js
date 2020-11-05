const gamesDiv = $('#games');
const tagsDiv = $('#tags');

let games;
let tags;
let selectedGameId;

function onGame(gameId) {
  selectedGameId = gameId;
}

function onTag(tagId) {
  if (!selectedGameId) {
    throw Error('gtfo');
  }

  axios.post('/relations', { gameId: selectedGameId, tagId});
}

Promise.resolve()
  .then(() => axios.get('/games'))
  .then((response) => {
    games = response.data;
  })
  .then(() => axios.get('/tags'))
  .then((response) => {
    tags = response.data;
  })
  .then(() => {
    _.sortBy(games, 'title')
      .forEach((game) => {
        gamesDiv.append(`<div class="game" onclick="onGame('${game.id}')"><input type="radio" id="${game.id}" name="title"><label for="${game.id}">${game.title}</label></div>`)
      });

    _(tags).groupBy('category')
      .mapKeys((tags, category) => category === 'null' ? 'other' : category )
      .toPairs()
      .sortBy(([category]) => category)
      .forEach(([category, tags]) => {
        const buttons = _(tags)
          .sortBy('name')
          .map((tag) => `<button class="tag" onclick="onTag('${tag.id}')">${tag.name}</button>`)
          .value();

        tagsDiv.append(`
          <div class="category">
            <p class="subtitle">${_.upperFirst(category)}</p>
            ${buttons.join('\n')}
          </div>
        `)
      });
  });
