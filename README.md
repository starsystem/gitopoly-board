# gitopoly-board
Gitopoly procedural board

- [Wiki: Gitopoly board tile](https://github.com/fork-n-play/fork-n-play.github.io/wiki/Gitopoly#board-tile)
- [Language colors](https://github.com/ozh/github-colors/blob/master/colors.json)
- [octodex](https://github.com/JordanAdams/octotab/blob/master/src/data/octodex.json)

# Board

**Spaces** (10)

- Repos: 4-6
- Corner: 1 (Bug, Fatal Error, Release)
- Packages: 1
- Issues + Pull Requests: 1-2
- Database + Server: 0-1
- Build Failure: 0-1

**Flow**

- Get User Repos (pagination)
- Store (name, language, stars)
- Group by language and sum up all stars
	- Total Stars 0 - 100: 2+2 Repos
	- Total Stars 101 - 1000: 2+3 Repos
	- Total Stars > 1000: 3+3 Repos
- Pick 2 random languages with repo.length > 1

**Issues**

- [`ilife5`](https://github.com/ilife5?utf8=%E2%9C%93&tab=repositories&q=&type=source&language=coffeescript) own 14 Javascript repos and 1 CoffeeScript
- `luliuz` error 404
