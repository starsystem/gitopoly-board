var tile = function () {
	var	tile = [],
		board = [],
		username = '',
		repos = {},
		totalRepos = 0,
		totalStars = 0,
		sortable = [],
		page = 1,
		played = 0;
	function getTile (inputField, existingBoard) {
		username = inputField || '';
		board = existingBoard || [];
		return getRepos();
	}
	function getRepos () {
		return fetch('http://api.github.com/users/' + username + '/repos?page=' + page).then( function (r) {
			page = getNextPage(r.headers.get('Link'));
			if(r.status === 200) return r.json();
		}).then( function (j) {
			j.map(function (repo) {
				if (!repo.fork && repo.language !== null) {
					totalRepos ++;
					totalStars += repo.stargazers_count;
					if (repos[repo.language])
						repos[repo.language].push({name: repo.name, size: repo.size});
					else
						repos[repo.language] = [{name: repo.name, size: repo.size}];
				}
			});
		}).then( function () {
			if (page) getRepos(page); else draw();
		}).then( function () { return [tile, board]; } ).catch(console.log);
	}
	function getNextPage (headerLink) {
		var next = null;
		if(headerLink){
			var pagers = headerLink.split(', ');
			for (var i in pagers) {
				var arr = pagers[i].split('; ');
				// Check rel="next" and get page
				if (/rel="(.*?)"/g.exec(arr[1])[1] == 'next') next = /page=(.*?)>/g.exec(arr[0])[1];
			}
		}
		return next;
	}
	function draw () {
		for (var language in repos) sortable.push([language, repos[language]]);
		sortable.sort(function(a, b) {
			return a[1].length - b[1].length;
		});
		// Check playable properties
		var max = (totalStars < 100) ? 4 : (totalStars < 1000) ? 5 : 6;
		var playable = Math.min(totalRepos, max);
		// console.log(JSON.stringify(sortable,null,2), playable);
		var cornerName = randomElement(["release", "milestone", "bug", "fatal error"]);
		tile.push({"type": "corner", "name": cornerName});
		addProperty();
		if (playable > 1) addProperty();
		var firstChance = randomElement(["issue", "pull request"]);
		tile.push({"type": "chance", "name": firstChance});
		if (playable > 4) addProperty();
		tile.push({"type": "property", "name": "software package", "rent": 25, "maintain": 200, "unmaintain": 100 });
		sortable.splice(sortable.length-1, 1); // change language
		if (playable > 2) {
			if (playable > played) addProperty();
			var secondChance = randomElement(["issue", "pull request"]);
			tile.push({"type": "chance", "name": secondChance});
			if (playable > played) addProperty();
			if (playable > played) addProperty();
			var hardware = randomElement(["database", "server"]);
			tile.push({"type": "hardware", "name": hardware, "maintain": 150, "unmaintain": 75 });
		}
		// console.log(JSON.stringify(tile,null,2));
		render(tile);
		return board.push.apply(board, tile);
	}
	function randomElement (array) {
		var randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}
	function addProperty () {
		if (sortable.length) {
			if (sortable[sortable.length-1][1].length === 0) sortable.splice(sortable.length-1, 1);
			var gruppo = sortable[sortable.length-1];
			console.log(gruppo[1]);
			var randomRepository = Math.floor(Math.random() * gruppo[1].length);
			var nextTile = {
				"type": "repository",
				"language": gruppo[0],
				"user": username,
				"name": gruppo[1][randomRepository].name,
				"size": gruppo[1][randomRepository].size,
			};
			tile.push(nextTile);
			sortable[sortable.length-1][1].splice(randomRepository, 1);
			played++;
		}
	}
	function render (t) {
		var div = document.getElementById('tile');
		t.map( function (e) {
			var space = createSpace(e);
			div.appendChild(space);
		});
	}
	function createSpace (e) {
		var	lan = '' || e.language,
			div = document.createElement('div'),
			header = document.createElement('header'),
			info = document.createElement('div'),
			note = document.createElement('div');
		div.classList.add('spaceDiv', e.type);
		header.innerHTML = e.name;
		switch (e.type) {
			case 'property':
				info.innerHTML = 'rent: ' + e.rent;
				note.innerHTML = 'maintain: ' + e.maintain + '<br>unmaintain: ' + e.unmaintain;
				break;
			case 'repository':
				info.innerHTML = 'size: ' + e.size;
				header.classList.add(e.language);
				header.innerHTML += '<br>' + e.language;
				break;
			case 'chance':
				break;
			default:

		}
		div.appendChilds([header, info, note]);
		return div;
	}
	return {
		getTile: getTile
	};
};
