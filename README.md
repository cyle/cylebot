# CYLEBOT!

Cylebot is an IRC chatbot who makes office life a little more interesting. In many ways, he is custom tailored for life in Emerson College's IT department, but anyone can use this code as a basis for their own bot.

Cylebot has two main forms of interaction: responding directly to things happening in chat, and the random chance of him saying something spontaneously. There are two major blocks of code in cylebot.js -- the first for "responders" and the second for "random speech". The first is very simple: every time something is said in the chatroom, cylebot goes through a list of regular expressions and if any match, he'll interact. There's even a random chance here of him saying something. The second is also simple: every sixty seconds, cylebot rolls a die to see if he will say something.

Cylebot keeps track of the last few things said for later reference and will respond to questions directed at him. Asking "cylebot, how are you?" will illicit a direct response, depending on what you've filled his knowledge base with. He also has several commands:

- <code>!lyric</code> -- returns a random lyric from a Lyrics Wiki based on a preset selection of artists.
- <code>!poem</code> -- returns a random line or lines (if a number is given as well) of poetry from his database of poetry.
- <code>!status</code> -- returns a random status update, based on his knowledge repository, explained later. Equivilent of asking "cylebot, how are you?"
- <code>!sentence</code> -- returns a random sentence from wiktionary.org list of phrases.
- <code>!roll [sides or notation]</code> -- rolls a die for you! even accepts D&D notation, i.e. !roll 4d10
- <code>!song</code> -- returns a random song from a server with a special iTunes library scrubber on it
- <code>!server [server hostname]</code> -- returns the current status of server (based on [my Nagios API](https://github.com/cyle/nagios-cache-api))
- <code>!lastlyric</code> and <code>!lastpoem</code> -- these return what the last lyric or last poem was from

## Requirements

- node.js (running 0.6.7 in production)
- "jerk" node.js module (running 1.1.21 in production)
- MongoDB (running 2.0.2 in production on the same box as the bot)
- Web server (running 1.4.28 in production)
- PHP 5.3+ (running 5.3.6 in production)
- PHP Mongo PECL extension (running 1.2.7 in production)
- an IRC server and channel for him to live on!

## Installation

Just clone this repository somewhere on a server with the above pieces installed. I use the node.js module "forever" to keep him running, but use whatever method you want.

In your web server configuration, add an alias for "/cylebot" to go to the "utils" folder in the "cylebot" main folder.

If your MongoDB instance is not on the same box as cylebot, you'll need to update the whole codebase to reflect this. It's not that hard, just need to add a parameter to every MongoDB instantiation in PHP and cylebot.js

In cylebot.js, the top dozen or so lines are dedicated to configuring cylebot -- if you want to change his name, or who his parents are, or whatever. The names are based on the nicknames used in chat. 

You will also (if you want) need to create a place for him to keep a chatlog to use any of the chat log analysis utilities in the "logs" folder. You'll want to heavily edit the scripts in there as they are tailored specifically for my coworkers, but the basis is there for some neat stuff.

## Usage

He just works! He'll join the chatroom you specify in the cylebot.js file and start doing neat things. To take full advantage, there are a few utilities that help add flavor to him, specifically the "poetry" and "status" utilities. Go to http://your-server.com/cylebot/poetry/ to add poems to his knowledge database and then go to http://your-server.com/cylebot/status/ to add to his general knowledge library he'll tap into to respond to various questions and commands.

## Considerations

There are a lot of commands/things that are very Emerson- or IT-specific. For example, he routinely will ask the chatroom about computer labs on campus, to make sure our student workers are checking up on them. This piece probably isn't useful in any other environment. He also has an array called "innapropriate" to help filter out NSFW words.

The "music"/!song command -- which retrieves a random song selection from an iTunes library -- is a separate piece entirely which I have not yet put on github. It basically just asks my work machine to parse my iTunes library XML file and return a random entry. I'll add this to github at some point.

There are several !commands which rely on outside APIs and services, namely the !lyric, !fact, !status, !define, and !server commands. The !server command requires use of [my Nagios API](https://github.com/cyle/nagios-cache-api), so if you're not doing anything like that, it may be better to just wipe that out. The other four commands listed a minute ago are based on various sites around the web, so the server will need to be able to access those sites for those commands to work.

## Need to do...

I really need to update node.js, jerk, mongodb, among other things, on the server. I'm fairly confident he will run on the latest versions of these software without any problems, but I have yet to test this myself.