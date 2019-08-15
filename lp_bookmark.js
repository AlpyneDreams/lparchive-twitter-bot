javascript: (function(){
let out = [];
for (let img of document.getElementById("content").getElementsByTagName("img")) {
	out.push({src:img.src,text:img.previousSibling.previousSibling.previousSibling.textContent});
}
navigator.clipboard.writeText(JSON.stringify(out, null, "\t") + ",\n").catch(console.error);
})();