javascript: (function(){
let out = [];
let lastimg = document.getElementById("content").querySelector("h3");
for (let img of document.getElementById("content").getElementsByTagName("img")) {
	let txt = "";
	if (lastimg) { 
		let node = lastimg.nextSibling;
		while (node.tagName != "IMG") {
			txt += node.textContent.replace(/^[\n\t]+/gi, '');
			node = node.nextSibling;
		}
	}
	out.push({ src: img.src, text: txt });
	lastimg = img;
}
navigator.clipboard.writeText(JSON.stringify(out, null, "\t") + ",\n").catch(console.error);
})();