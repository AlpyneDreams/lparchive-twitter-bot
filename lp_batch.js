const config = require('./config')

const fs = require('fs')
const pathlib = require('path')
const { JSDOM } = require('jsdom')
var request = require("request-promise-native")
var ProgressBar = require('progress')

batchPages(45).then(out => {
    fs.writeFileSync(config.filenames.images, out)
})

async function batchPages(count) {
    let bar = new ProgressBar('[:bar] :current / :total', {total: count})
    let out = `[\n`
    for (let i = 1; i <= count; i++) {
        bar.tick()
        out += getJSON(await parsePage(i), i == count)
    }
    out += '\n]'

    return out
}

function getJSON(data, isLast = false) {
    if (isLast) {
        return JSON.stringify(data, null, "\t") + "\n"
    } else {
        return JSON.stringify(data, null, "\t") + ",\n"
    }
}

async function parsePage(n = 1) {
    let body = await request(config.getImagePath(n))
    const dom = new JSDOM(body)
    let document = dom.window.document
    // insert dummy image to catch text after final image in page
    document.getElementById("content").appendChild(document.createElement('IMG'))
    let out = []
    let lastimg = document.getElementById("content").querySelector("h3")
    for (let img of document.getElementById("content").getElementsByTagName("img")) {
        if (img.src.endsWith(config.emotes.suffix)) continue
        let txt = ""
        if (lastimg) {
            let node = lastimg.nextSibling
            while (node) {
                if (node.tagName == 'IMG') {
                    if (node.src.endsWith(config.emotes.suffix))
                        txt += `:${pathlib.basename(node.src, config.emotes.suffix).replace(config.emotes.prefix, '')}:`
                    else
                        break
                } else if (node.nodeType != dom.window.Node.COMMENT_NODE) {
                    if (node.tagName == 'BR') {
                        txt += '\n'
                    } else {
                        txt += node.textContent.replace(/^[\n\t]+/gi, '')
                    }
                }
                node = node.nextSibling
            }
        }
        txt = txt.replace(/^(\n)+|(\n)+$/g, '')
        if (txt.trim().length > 0 || img.src.length > 0)
            out.push({ src: img.src, text: txt })
        lastimg = img
    }

    return out
}

