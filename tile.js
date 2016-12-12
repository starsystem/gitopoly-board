function tile (username, board) {
	this.username = username;
	this.board = board || [];
	this.repos = {};
	this.page = 1;
	this.repoTotal = 0;
	this.stars = 0;
	this.url = 'http://api.github.com/users/' + this.username + '/repos?page=' + this.page;
}

tile.prototype = {
	getNextPage: function (headerLink) {
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
	},
	getRepos: function () {
		fetch(this.url).then( function (r) {
			this.page = this.getNextPage(r.headers.get('Link'));
			if(r.status === 200) return r.json();
		}).then( function (j) {
			j.map(function (repo) {
				if (!repo.fork && repo.language !== null) {
					this.repoTotal++;
					this.stars += repo.stargazers_count;
					if (this.repos[repo.language])
						this.repos[repo.language].push({name: repo.name, size: repo.size});
					else
						this.repos[repo.language] = [{name: repo.name, size: repo.size}];
				}
			});
		}).then( function () {
			if (!this.page) this.getRepos(this.page); else this.draw();
		}).catch(console.log);
	},
	draw: function () {

	}
};

var tile = new tile('petrosh');
console.log(tile.getRepos());
