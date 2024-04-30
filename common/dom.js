const cheerio = require('cheerio')
const { formatString } = require('./file')
const { BASE_URL, LIST_SELECTOR, BOOK_NAME_SELECTOR, CHAPTER_NAME_SELECTOR, CONTENT_SELECTOR } = require('./config')
function resolveArticleHTML(body, bookID) {
  const $ = cheerio.load(body)
  const $list = $(LIST_SELECTOR)
  const result = [];
  $list.each((index, el) => {
    const $el = $(el)
    const id = `${index}`.padStart(4, '0')
    result.push({
      id,
      title: `${id}${$el.text()}`,
      url: `${BASE_URL}/${$el.attr('href')}`
    })
  })
  const bookName = formatString($(BOOK_NAME_SELECTOR).text())
  console.log('fetch book name is ' + bookName + ' and book size is ' + result.length);
  return { bookName, result }
}

function resolveArticleContent(body) {
  const $ = cheerio.load(body);

  const title = formatString($(CHAPTER_NAME_SELECTOR).text())
  const content = $(CONTENT_SELECTOR).text()

  return { title , content: content.replace(/^\s+|\s+$/g, '') }
}

module.exports = {
  resolveArticleContent,
  resolveArticleHTML
}
