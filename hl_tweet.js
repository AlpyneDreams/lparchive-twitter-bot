const images = require('./hl.json')

const emotes = {
	gonk: "https://lparchive.org/Half-Life-2/Update%2044/emot-gonk.gif",
	siren: "https://lparchive.org/Half-Life-2/Update%2044/emot-siren.gif",
	argh: "https://lparchive.org/Half-Life-2/Update%2036/emot-argh.gif",
	iceburn: "https://lparchive.org/Half-Life-2/Update%2015/emot-iceburn.gif",
	frown: "https://lparchive.org/Half-Life-2/Update%2013/frown.gif"
}

let index = require('./hl_tweet_num.json')

// END OF CONFIGURATION //

const fs = require('fs')

console.log(`PAGE ${index.page} IMAGE ${index.img}`)

let img = images[index.page - 1][index.img - 1]
console.log(img.text.trim())
console.log(img.src)

// TWEET HERE

if ( images[index.page - 1][index.img] ) {
	index.img++;
} else {
	index.page++;
	index.img = 1;
}

fs.writeFileSync('./hl_tweet_num.json', JSON.stringify(index))

/* 
hl.json contains an array of arrays, one for each page
each array contains every image object on that page
image format:
{
	src: string or array or none
	text: string or none
}

*/



/*let part = 1
for (let page of images) {
	console.log(`PART ${part}: ${page.length} IMAGES`)
	for (let img of page) {
		if (img.text && img.text.length > 0) continue
		if (img.text) {
			console.log(String(img.text).trim())
		}
		if (img.src) {
			console.log(img.src)
		}
	}
	part++;
}*/