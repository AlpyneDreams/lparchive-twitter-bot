const config = require('./config')

const fs = require('fs')
var request = require("request")
var ProgressBar = require('progress')

const data = require(config.filenames.images)

fs.rmdirSync(config.folders.images, {recursive: true})
fs.mkdirSync(config.folders.images)

// count total images for progress bar
let totalImages = 0
for (let page of data) for (let bit of page) if (bit.src) totalImages++

let bar = new ProgressBar('Images: [:bar] :current / :total', { total: totalImages })

let pageNumber = 1
for (let page of data) {
    let pageFolder = config.getImageFolder(pageNumber)
    fs.mkdirSync(pageFolder)
    for (let bit of page) {
        if (bit.src) {
            if (Array.isArray(bit.src)) {
                for (let i of bit.src) {
                    fetchImage(pageFolder + i, config.getImagePath(pageNumber) + i, bar)
                }
            } else {
                fetchImage(pageFolder + bit.src, config.getImagePath(pageNumber) + bit.src, bar)
            }
        }
    }
    pageNumber++
}

async function fetchImage(filename, url) {
    let req = request(url)
    let stream = fs.createWriteStream(filename)
    req.pipe(stream)
    stream.on('close', () => {
        bar.tick()
    })
}
