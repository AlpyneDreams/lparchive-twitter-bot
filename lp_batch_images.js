const BASE_IMAGE_PATH = 'https://lparchive.org/Half-Life-2/Update %n/'
const BASE_FILE_PATH = 'Update%n/'

const fs = require('fs')
var request = require("request")
var ProgressBar = require('progress')

const data = require('./lp.json')

fs.rmdirSync('images', {recursive: true})
fs.mkdirSync('images')

// count total images for progress bar
let totalImages = 0
for (let page of data) for (let bit of page) if (bit.src) totalImages++

let bar = new ProgressBar('Images: [:bar] :current / :total', { total: totalImages })

let pageNumber = 1
for (let page of data) {
    let pageFolder = 'images/' + BASE_FILE_PATH.replace('%n', pageNumber)
    fs.mkdirSync(pageFolder)
    for (let bit of page) {
        if (bit.src) {
            if (Array.isArray(bit.src)) {
                for (let i of bit.src) {
                    fetchImage(pageFolder + i, BASE_IMAGE_PATH.replace('%n', pageNumber) + i, bar)
                }
            } else {
                fetchImage(pageFolder + bit.src, BASE_IMAGE_PATH.replace('%n', pageNumber) + bit.src, bar)
            }
        }
    }
    pageNumber++
}

async function fetchImage(filename, url) {
    let req = request(url)
    req.pipe(fs.createWriteStream(filename))
    req.on('response', () => {
        bar.tick()
    })
}
