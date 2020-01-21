const fs = require('fs')
const { JSDOM } = require('jsdom')
var request = require("request-promise-native")
var ProgressBar = require('progress')

batchPages(45).then(out => {
    fs.writeFileSync('lp.json', out)
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
    let body = await request(`https://lparchive.org/Half-Life-2/Update ${n}/`)
    const dom = new JSDOM(body)
    let document = dom.window.document

    let out = []
    let lastimg = document.getElementById("content").querySelector("h3")
    for (let img of document.getElementById("content").getElementsByTagName("img")) {
        let txt = ""
        if (lastimg) {
            let node = lastimg.nextSibling
            while (node.tagName != "IMG") {
                txt += node.textContent.replace(/^[\n\t]+/gi, '')
                node = node.nextSibling
            }
        }
        out.push({ src: img.src, text: txt })
        lastimg = img
    }

    return out
}

