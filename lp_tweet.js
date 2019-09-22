

const FILENAMES = {
	images: './lp.json',
	emotes: './lp_emotes.json',
	index: './lp_state.json'
}

// END OF CONFIGURATION //

const images = require(FILENAMES.images)
const emotes = require(FILENAMES.emotes)
let index = require(FILENAMES.index)


const fs = require('fs')

console.log(`PAGE ${index.page} IMAGE ${index.img}`)

let img = images[index.page - 1][index.img - 1]


if (img.text) {
	let text = img.text.trim()
	let matches = text.match(/:\w+:/gi)

	if (matches) for (let m of matches) {
		let name = m.slice(1, -1)
		if (name in emotes) {
			// HANDLE EMOTES HERE
		
			console.log(m)
			if (emotes[name].text) {
				text = text.replace(m, emotes[name].text)
			}
		}
	}
	console.log(text)
}

if (img.src) {
	
	if (Array.isArray(img.src)) {
		for (let i of img.src) {
			console.log(i)
		}
	} else {
		// just one image
		console.log(img.src)
	}
	
}

// TWEET HERE

if ( !index.pause ) {

	if ( images[index.page - 1][index.img] ) {
		index.img++;
	} else {
		index.page++;
		index.img = 1;
	}
	
	fs.writeFileSync(FILENAMES.index, JSON.stringify(index))
}

/*
lp_state.json
{
	page: page number, starts at 1
	img: image number, starts at 1
	pause: (bool) whether to increment page and image number
}
*/
/* 
lp.json contains an array of arrays, one for each page
each array contains every image object on that page
image format:
{
	src: string or array or none
	text: string or none
}

*/
