
// const BASE_URL = 'https://www.biquge7.xyz'
// const BASE_URL = 'https://www.biqg.cc'
// const BASE_URL = 'https://www.biquge11.cc/'
// const BASE_URL = 'https://www.ttxs7.com'
// const BASE_URL = 'https://www.beqege.com/'
// const BASE_URL = 'https://www.biquzw789.info'
// const BASE_URL = 'https://www.biquge66.net'

// 爬取的基础网站
const BASE_URL = 'https://www.biqg.cc'

// 一次爬取的最大数量
const ONCE_CRAWL_COUNT = 20;

// 爬取一次的休眠间隔(s)
const ONCE_CRAWL_INTERVAL = [5, 10]

// 书名选择器
const BOOK_NAME_SELECTOR = '.info h1'

// 列表选择器
const LIST_SELECTOR = '.listmain a'

// 章节名选择器
const CHAPTER_NAME_SELECTOR = '.wap_none'

// 内容选择器
const CONTENT_SELECTOR = '#chaptercontent'

// 书ID
const BOOK_ID = 'book/43200'

// 书名
const BOOK_NAME = '星环使命'

// 偏移量
const BOOK_OFFSET = 0

module.exports = {
  ONCE_CRAWL_COUNT,
  ONCE_CRAWL_INTERVAL,
  BASE_URL,
  LIST_SELECTOR,
  BOOK_NAME_SELECTOR,
  CHAPTER_NAME_SELECTOR,
  CONTENT_SELECTOR,
  BOOK_ID,
  BOOK_NAME,
  BOOK_OFFSET
}
