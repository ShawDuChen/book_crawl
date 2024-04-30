
const fs = require('fs')
const path = require('path')
const async = require('async')

const DOCS_PATH = path.resolve(__dirname, '../docs');

function createFile(filename, content, suffix = '.txt') {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(DOCS_PATH, filename + suffix), content, {}, (error) => {
      if (error) reject(error);
      else resolve()
    })
  })
}

function createDirectory(dirname) {
  return new Promise((resolve, reject) => {
    const filepath = path.resolve(DOCS_PATH, dirname)
    fs.stat(filepath, (err) => {
      if (err) {
        fs.mkdir(filepath, (error) => {
          if (error )reject(error)
          else resolve()
        })
      } else {
        resolve()
      }
    })
  })
}

function formatString(str = '') {
  return str.replace(/[\\\/\:\*\?\<\>\|]/g, '')
}

function checkDirectoryExist(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err) => {
      resolve(err ? false : true)
    })
  })
}

function checkFileExist(filepath, extension = '.txt') {
  return new Promise((resolve, reject) => {
    const file = path.resolve(DOCS_PATH, filepath + extension);
    fs.stat(file, (err) => {
      resolve(err ? false : true);
    })
  })
}

function readDirector(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, {}, (err, files) => {
      if (err) reject(err)
      else resolve(
        files.map(file => ({
          name: file.replace('.txt', ''),
          path: path.resolve(dir, file)
        }))
      )
    })
  })
}

function readBookContent(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) reject(err)
      else resolve(data.toString())
    })
  })
}

function getMergeBookContent(files = []) {
  return new Promise((resolve, reject) => {
    async.mapLimit(files, 10, async (item) => {
      const content = await readBookContent(item.path)  
      return `## ${item.name}\n\n${content}`;
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result.join('\n\n'))
    })
  })
}

function formatContentSpace(content = '') {
  return content.replace(/(^\s{2,})|(\s{2,}$)|\s{2,}/g, '\n\n');
}

async function mergeBookContent(dir, crawlBookName, extension = '.txt') {
  try {
    const exist = await checkDirectoryExist(dir)
    if (!exist) return
    const files = await readDirector(dir)
    const content = await getMergeBookContent(files)
    await createFile(crawlBookName, formatContentSpace(content), extension)
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  createFile,
  createDirectory,
  formatString,
  checkFileExist,
  checkDirectoryExist,
  readDirector,
  readBookContent,
  formatContentSpace,
  mergeBookContent,
  getMergeBookContent
}
