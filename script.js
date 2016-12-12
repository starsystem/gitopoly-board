Element.prototype.appendChilds = function (elementsArray) {
	for (var i = 0; i < elementsArray.length; i++) {
		if(elementsArray[i]) this.appendChild(elementsArray[i]);
	}
	return true;
};

var	form = document.querySelector('form'), current = [];

form.addEventListener('submit', function (event) {
	event.preventDefault();
	user = document.querySelector('input[type="text"]').value;
	var newTile = tile();
	newTile.getTile(user,current).then( function (t) {
		current = t[1];
	}).catch(console.log);
});
