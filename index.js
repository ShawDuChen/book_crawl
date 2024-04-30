
const async = require('async')
const { formatString, createDirectory, checkFileExist, createFile, mergeBookContent } = require('./common/file')
const { random, sleep } = require('./common/utils')
const { resolveArticleContent, resolveArticleHTML } = require('./common/dom')
const { getArticle, getArticleList } =  require('./common/req')

const { BOOK_ID, BOOK_NAME, BOOK_OFFSET, ONCE_CRAWL_COUNT, ONCE_CRAWL_INTERVAL } = require('./common/config')

async function crawlMain(bookID, offset = 0, cb = () => {}) {
  const articleListBody = await getArticleList(bookID)
  const { bookName, result: articleUrls } = resolveArticleHTML(articleListBody, bookID)
  await createDirectory(bookName);
  async.mapLimit(articleUrls.slice(offset), ONCE_CRAWL_COUNT, async (item) => {
    const filename = `${bookName}/${formatString(item.title)}`
    const exist = await checkFileExist(filename);
    if (exist) { // 增加一层已存在则跳过爬取
      return `${bookName}/${item.title}`
    }
    const data = await getArticle(item.url);
    const { content } = resolveArticleContent(data);
    if (!content) return filename
    await createFile(filename, content)
    await sleep(random(...ONCE_CRAWL_INTERVAL))
    return filename
  }, (err, results) => {
    if (err) throw err;
    console.log(results.length);
    cb && cb.call(results);
  })
}

crawlMain(BOOK_ID, BOOK_OFFSET, () => {
  const crawlBookName = BOOK_NAME;
  mergeBookContent(`./docs/${crawlBookName}`, crawlBookName, '.md')
  mergeBookContent(`./docs/${crawlBookName}`, crawlBookName, '.txt')
})
