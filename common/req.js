
const request = require('request')
const { BASE_URL } = require('./config')
function getArticleList(articleID) {
  const url = `${BASE_URL}/${articleID}/`
  return new Promise((resolve, reject) => {
    request(url, {}, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response.body)
      }
    })
  })
}

function getArticle(url) {
  return new Promise((resolve, reject) => {
    request(url, {}, (error, response) => {
      if (error) reject(error)
      else resolve(response.body)
    })
  })
}



module.exports = {
  getArticle,
  getArticleList,
  BASE_URL
}
