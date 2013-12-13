
// cylebot -- version 2.1

var my_name = 'cylebot';
var my_name_match = new RegExp("^(.*)\\b"+my_name+"\\b(.*)$", 'i');

var my_home_chatserver = 'your-irc-server.com';
var my_home_channel = '#AC$';

var my_home_appserver = 'your-app-server.com';
var my_home_musicserver = 'your-music-server.com';

var my_father = 'cyle';
var my_mother = 'molly';
var my_spouse = 'hana';

var my_chatlog = '/node/logs/cylebot_chat.log';

var petnames = [ 'honey', 'babe', 'baby', 'sweetheart', 'sugar bumps', 'angel', 'pumpkinpie', 'honey nut cheerios' ]; // oh dear
var innappropriate = [ 'fuck', 'shit', 'nigger', 'fag', 'rape', 'cunt', 'ass', 'asshole', 'bitch', 'sex' ]; // oh lol

var labs = ['XML', 'ATL', 'APL', 'PEL', 'JRL', '3DL'];

String.prototype.trim=function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};

var jerk = require('jerk');
var util = require('util');
var http = require('http');
var fs = require('fs');

var irc_options = { server: my_home_chatserver, nick: my_name, channels: [ my_home_channel ], log: false, user: { username: my_name, hostname: 'thetubes', servername: 'tube', realname: 'just another bot' } };

var lastmessages = [];
var lastwords = [];
var lyricobj;
var poemobj;
var defineobj;

var botlog = fs.createWriteStream(my_chatlog, { flags: 'a', mode: 0660 });

function rollDie(limit) {
	if (limit == undefined) limit = 6;
	return Math.floor(Math.random()*limit+1);
}

function makeTS() {
	var d = new Date();
	var ts = '';
	ts = ''+((d.getMonth() < 9) ? '0': '')+(d.getMonth()+1)+'-'+((d.getDate() < 10) ? '0': '')+d.getDate()+'-'+d.getFullYear()+' '+((d.getHours() < 10) ? '0': '')+d.getHours()+':'+((d.getMinutes() < 10) ? '0': '')+d.getMinutes()+':'+((d.getSeconds() < 10) ? '0': '')+d.getSeconds()+'';
	return ts;
}

function logMsg(wut) {
	botlog.write(makeTS()+' ['+my_name+'] '+wut+"\n");
	return wut;
}

function filterMsg(wut) {
	var appropriate = true;
	var checkthis = wut.toLowerCase();
	for (var i = 0; i < innappropriate.length; i++) {
		if (checkthis.indexOf(innappropriate[i]) > -1) {
			appropriate = false;
		}
	}
	return appropriate;
}

var irc = jerk(function(j) {
	
	botlog.write(makeTS()+' JOINED SERVER ========== '+"\n");
	
	// autogreet
	j.user_join(function(message) {
		
		// log people coming in
		botlog.write(makeTS()+' '+message.user+' just joined.'+"\n");
		
		setTimeout(function() {
			if (message.user == my_father) {
				message.say(logMsg('oh, hello father'));
			} else {
				message.say(logMsg('oh hai '+message.user));
			}
		}, Math.round(Math.random() * 1000)+1000);
	});
	
	// log people leaving, too
	j.user_leave(function(message) {
		
		botlog.write(makeTS()+' '+message.user+' just left.'+"\n");
		
	});
	
	
	
	// things to say
	
	j.watch_for(/.+/, function(message) {
		
		var chatline = message.match_data[0];
		
		// keep track of the last few things said, include them as possible random talking points
		if (lastmessages.length > 5) {
			var oldline = lastmessages.shift();
		}
		var newline = lastmessages.push(chatline);
		
		// keep track of the last few big words said, include them as possible random talking points
		var chatline_words = chatline.match(/\b([a-z]{9,})\b/gi);
		if (chatline_words != undefined && chatline_words.length > 0) {
			// there are big words to add!
			for (var i = 0; i < chatline_words.length; i++) {
				if (lastwords.length >= 5) {
					var old_word_item = lastwords.shift();
				}
				var new_word_item = lastwords.push(chatline_words[i]);
			}
		}
		
		// put in some kind of logging here (WITH TIMESTAMP)		
		botlog.write(makeTS()+' ['+message.user+'] '+chatline+"\n");
		
		if (message.user == 'rpgbot') { // ignore the RPG Bot entirely
			return;
		}
		
		
		/*
		
			RESPONDERS...
		
		*/
		
		
		// !commands
		if (/^!(.+)$/.test(chatline)) {
			
			if (/!commands\b/i.test(chatline)) {
				message.say(logMsg('Commands: !lyric, !poem [#], !status, !sentence, !roll [#], !song, !define [word], !fact, !server [hostname], !lastlyric, !lastpoem'));
			}
			
			if (/!lyric\b/i.test(chatline)) {
				http.get({host: my_home_appserver, port: 80, path: '/cylebot/lyric.php'}, function(res) {
					res.on('data', function (chunk) {
						var returned = ''+chunk+'';
						if (returned != 'too bad') {
							eval('lyricobj = '+returned);
							if (filterMsg(lyricobj.line)) {
								message.say(logMsg(lyricobj.line));
							}
						} else {
							message.say(logMsg('error getting a lyric... sorry...'));
						}
					});
				});
				return;
			}
			
			if (/!poem\s?(\d{1})?\b/i.test(chatline)) {
				var howmanylines = 1;
				var poem_matches = chatline.match(/!poem\s?(\d{1})?\b/i);
				if (poem_matches[1] != undefined && poem_matches[1] * 1 > 0) {
					howmanylines = poem_matches[1] * 1;
					if (howmanylines > 5) {
						howmanylines = 1;
					}
				}
				http.get({host: my_home_appserver, port: 80, path: '/cylebot/poetry.php?l='+howmanylines}, function(res) {
					res.on('data', function (chunk) {
						var returned = ''+chunk+'';
						eval('poemobj = '+returned);
						if (filterMsg(poemobj.line)) {
							message.say(logMsg(poemobj.line));
						}
					});
				});
				return;
			}
			
			if (/!lastlyric\b/i.test(chatline)) {
				if (lyricobj == undefined) {
					message.say(logMsg('there has not been a lyric spoken yet'));
				} else {
					if (filterMsg(lyricobj.song)) {
						message.say(logMsg('the last lyric was from '+lyricobj.artist+' - '+lyricobj.song));
					} else {
						message.say(logMsg('uhhh i don\'t know where the last lyric is from...'));
					}
				}
				return;
			}
			
			if (/!lastpoem\b/i.test(chatline)) {
				if (poemobj == undefined) {
					message.say(logMsg('there has not been a poem spoken yet'));
				} else {
					message.say(logMsg('the last line of poetry was from "'+poemobj.title+'" by '+poemobj.author));
				}
				return;
			}
			
			if (/^!status$/i.test(chatline)) {
				http.get({host: my_home_appserver, port: 80, path: '/cylebot/status.php'}, function(res) {
					res.on('data', function (chunk) {
						var returned = ''+chunk+'';
						if (filterMsg(returned)) {
							message.say(logMsg(returned));
						}
					});
				});
				return;
			}
			
			if (/^!sentence$/i.test(chatline)) {
				http.get({host: my_home_appserver, port: 80, path: '/cylebot/sentence.php'}, function(res) {
					res.on('data', function (chunk) {
						var returned = ''+chunk+'';
						if (filterMsg(returned)) {
							message.say(logMsg(returned));
						}
					});
				});
				return;
			}
			
			// roll the dice - either # of sides, or D&D style
			if (/^!roll\s?((\d+)|((\d+)d(\d+)))?$/i.test(chatline)) {
				var user_pieces = message.user.split('_');
				var username = user_pieces[0].toLowerCase();
				var roll_matches = chatline.match(/^!roll\s?((\d+)|((\d+)d(\d+)))?$/i);
				if (roll_matches[2] != undefined && roll_matches[2] * 1 > 0) {
					message.say(logMsg(username + ' rolls a '+rollDie(roll_matches[1] * 1)));
				} else if ((roll_matches[4] != undefined && roll_matches[4] * 1 > 0) && (roll_matches[5] != undefined && roll_matches[5] * 1 > 0)) {
					var restext = username +' rolls ';
					var rolltotal = 0;
					for (var i = 0; i < roll_matches[4] * 1; i++) {
						if (i > 0) {
							restext += ', ';
						}
						var roll = rollDie(roll_matches[5] * 1);
						restext += roll;
						rolltotal += roll;
					}
					restext += ' = ' + rolltotal;
					message.say(logMsg(restext));
				} else {
					message.say(logMsg(username + ' rolls a '+rollDie(6)));
				}
				return;
			}
			
			// define a word!
			if (/^!define (\w+)/i.test(chatline)) {
				var define_pieces = chatline.match(/^!define (\w+)$/i);
				if (define_pieces == undefined || define_pieces[1] == undefined) {
					message.say(logMsg("Uhhh I need a word to define..."));
					return;
				}
				var theword = define_pieces[1];
				var thelookup = "/w/api.php?format=json&action=query&titles="+theword+"&prop=revisions&rvprop=content";
				var returned_stuff = '';
				http.get({host: 'en.wiktionary.org', port: 80, path: thelookup, headers: { "User-Agent": "Cylebot" } }, function(res) {
					res.on('data', function (chunk) {
						returned_stuff += ''+chunk+'';
					});
					res.on('end', function() {
						defineobj = JSON.parse(returned_stuff);
						var defineobj = defineobj['query']['pages'];
						//console.log(defineobj);
						if (defineobj['-1'] != undefined) {
							message.say(logMsg("No definition found, sorry!"));
							return;
						}
						var definetxt = '';
						for (var i in defineobj) {
							definetxt = '' + defineobj[i]['revisions'][0]['*'] + '';
						}
						//console.log(definetxt);
						define_matches = definetxt.match(/# (.+)\n/ig);
						if (define_matches == undefined || define_matches[0] == undefined) {
							message.say(logMsg("No definition found, sorry!"));
							return;
						}
						//console.log('definition matches for '+theword+':');
						//console.log(define_matches);
						for (var i = 0; i < define_matches.length; i++) {
							if (/\{\{obsolete\}\}/gi.test(define_matches[i])) {
								continue;
							} else 	if (/\{\{(.*)?rare(.*)?\}\}/gi.test(define_matches[i])) {
								continue;
							} else if (/\{\{(in)?transitive\}\}/.test(define_matches[i])) {
								continue;
							} else {
								the_definition = define_matches[i];
								break;
							}
						}
						if (the_definition == undefined || the_definition.trim() == '') {
							message.say(logMsg("No definition found, sorry!"));
							return;
						}
						//var the_definition = define_matches[0];
						if (/{{plural of\|(.+)}}/i.test(the_definition)) {
							the_definition = the_definition.replace(/{{plural of\|(.+)}}/ig, 'plural of $1');
						}
						if (/{{alternative spelling of\|(.+)}}/i.test(the_definition)) {
							the_definition = the_definition.replace(/{{alternative spelling of\|(.+)}}/ig, 'alternative spelling of $1');
						}
						if (/{{alternative form of\|(.+)}}/i.test(the_definition)) {
							the_definition = the_definition.replace(/{{alternative spelling of\|(.+)}}/ig, 'alternative form of $1');
						}
						the_definition = the_definition.replace(/\{\{([^}]*)\}\}/ig, '');
						the_definition = the_definition.replace(/\[\[([^\|]*\|)?/ig, '');
						the_definition = the_definition.replace(/\]\]/ig, '');
						the_definition = the_definition.substring(2);
						the_definition = the_definition.replace(/'''/g, '');
						the_definition = the_definition.replace(/''/g, '');
						if (the_definition == undefined || the_definition.trim() == '' || the_definition.trim() == '.') {
							message.say(logMsg("No definition found, sorry!"));
							return;
						}
						//console.log('the definition: '+the_definition);
						message.say(logMsg(the_definition.trim()));
					});
				});
			}
			
			// get a fact!
			if (/^!fact$/i.test(chatline)) {
				var returned_stuff = '';
				http.get({host: 'facts.randomhistory.com', port: 80, path: '/'}, function(res) {
					res.on('data', function(chunk) {
						returned_stuff += ''+chunk+'';
					});
					res.on('end', function() {
						var find_fact = /<!-- Fact of the Day Starts -->([^<]+)<!-- Fact of the Day Ends -->/i;
						var fact_matches = returned_stuff.match(find_fact);
						if (fact_matches == undefined || fact_matches[1] == undefined) {
							message.say(logMsg('Oh crap. Error getting a random fact. Sorry.'));
							return;
						}
						var the_fact = fact_matches[1].trim();
						the_fact = the_fact.replace(/\s{2,}/g, ' ');
						the_fact = the_fact.replace(/&rsquo;/gi, "'");
						the_fact = the_fact.replace(/&ldquo;/gi, '"');
						the_fact = the_fact.replace(/&rdquo;/gi, '"');
						message.say(logMsg(the_fact));
					});
					
				});
				return;
			}
			
			// get a song from cyle's itunes library
			if (/^!song$/i.test(chatline)) {
				http.get({host: my_home_musicserver, port: 80, path: '/music.php'}, function(res) {
					res.on('data', function (chunk) {
						var returned = ''+chunk+'';
						message.say(logMsg(returned));
					});
				});
				return;
			}
			
			// get server status from my Nagios API
			if (/^!server (.+)/i.test(chatline)) {
				var server_pieces = chatline.match(/^!server (.+)$/i);
				if (server_pieces == undefined || server_pieces[1] == undefined) {
					message.say(logMsg("Uhhh I need a server to check..."));
					return;
				}
				var theserver = server_pieces[1];
				http.get({host: 'bench.emerson.edu', port: 80, path: '/nagios/?w=host&h='+theserver}, function(res) {
					var returned_text = '';
					res.on('data', function (chunk) {
						returned_text += ''+chunk+'';
					});
					res.on('end', function() {
						var what = '';
						var host = JSON.parse(returned_text);
						//console.log(host);
						if (host.error != undefined) {
							what = host.error + '! i probably do not check on it.';
						} else {
							if (host.b == true) {
								what = 'looks like that server is broken! oh noes...';
							} else if (host.p == true) {
								what = 'looks like that server has a slight problem, but it\'s still up...';
							} else {
								what = 'that server should be fine, i think';
							}
						}
						message.say(logMsg(what));
					});
				});
				return;
			}
			
		} // end if ! commands
		

		// ohhh how nice... hello and goodbye, etc
		
		if (/^(hai|hello|hey|hi|hola|oh hai)$/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('oh hai '+message.user));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/^(bai|bye|goodbye|caio|cya)( cylebot)?$/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('lol cya'));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/^good morning/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('is it morning? i\'ve been here so long...'));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/^good afternoon/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('oh hello'));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		
		
		// respond to your name
		
		if (my_name_match.test(chatline)) {
			var bot_matches = chatline.match(my_name_match);
			var wut = '';
			var said_before = bot_matches[1].toLowerCase();
			var said_after = bot_matches[2].toLowerCase();
			//console.log('cylebot mentioned. said before: "'+said_before+'", said after: "'+said_after+'"');
			if (/^(.*)how are you(.*)$/i.test(chatline)) {
				http.get({host: my_home_appserver, port: 80, path: '/cylebot/status.php'}, function(res) {
					res.on('data', function (chunk) {
						var returned = ''+chunk+'';
						setTimeout(function() {
							if (filterMsg(returned)) {
								message.say(logMsg(returned));
							}
						}, Math.round(Math.random() * 1000)+1000);
					});
				});
				return;
			} else if (said_before == 'thanks ' || said_before == 'thanks, ' || said_before == 'thank you ' || said_before == 'thank you, ') {
				wut = 'you are so welcome';
			} else if (said_before == 'i love you ' || said_before == 'i love you, ' || said_after == ' i love you' || said_after == ', i love you') {
				var roll = rollDie(100);
				if (roll % 2) {
					wut = 'awww i love you too!';
				} else {
					wut = 'ummm that\'s nice';
				}
			} else if (said_before == '' && (said_after == '' || said_after == '?')) {
				wut = 'yes?';
			} else if (said_before == 'oh hai ' && said_after == '') {
				wut = 'oh hai, how are you?';
			} else if (said_before == 'shut up ' || said_before == 'shut up, ') {
				wut = 'that isn\'t nice...';
			} else if (said_after.charAt(said_after.length-1) == '?') {
				var the_question = said_before + said_after;
				the_question = the_question.replace(/[\.,\?;:]/gi, '').toLowerCase().trim();
				//wut = 'the question was: ' + the_question;
				// get first word
				var question_words = the_question.match(/\b\w+\b/gi);
				if (question_words[0] == 'do' || question_words[0] == 'is' || question_words[0] == 'are' || question_words[0] == 'can' || question_words[0] == 'does' || question_words[0] == 'did' || question_words[0] == 'should') {
					var roll = rollDie(5);
					switch (roll) {
						case 1:
						wut = 'probably not';
						break;
						case 2:
						wut = 'oh hell yes';
						break;
						case 3:
						wut = 'hahaha no';
						break;
						case 4:
						wut = 'i think so...';
						break;
						case 5:
						wut = 'maybe perhaps kinda';
						break;
					}
				} else {
					var roll = rollDie(6);
					switch (roll) {
						case 1:
						wut = 'i am confused by the question';
						break;
						case 2:
						wut = "i don't know how to answer that, sorry";
						break;
						case 3:
						wut = 'ask somebody else, i don\'t know';
						break;
						default:
						http.get({host: 'api.adviceslip.com', port: 80, path: '/advice'}, function(res) {
							var returned = '';
							res.on('data', function (chunk) {
								returned += chunk;
							});
							res.on('end', function() {
								console.log(returned);
								var advice = JSON.parse(returned);
								var returntext = message.user.toLowerCase() + ', ' + advice.slip.advice.toLowerCase();
								if (filterMsg(returntext)) {
									message.say(logMsg(returntext));
								}
							});
						});
						return;
					}
					
				}
			} else {
				var roll = rollDie(100);
				if (roll < 30) {
					if (message.user.substr(0,4).toLowerCase() == my_father) {
						wut = 'ok dad...';
					} else if (message.user.substr(0,5).toLowerCase() == my_mother) {
						wut = 'ok mom...';
					} else if (message.user.substr(0,4).toLowerCase() == my_spouse) {
						wut = 'ok '+petnames[rollDie(petnames.length)-1]+'...';
					} else {
						wut = 'uh okay';
					}
					setTimeout(function() {
						message.say(logMsg(wut));
					}, Math.round(Math.random() * 1000)+1000);
					return;
				} else if (roll >= 30 && roll <= 50) {
					wut = 'uh what';
					setTimeout(function() {
						message.say(logMsg(wut));
					}, Math.round(Math.random() * 1000)+1000);
					return;
				} else {
					http.get({host: my_home_appserver, port: 80, path: '/cylebot/sentence.php'}, function(res) {
						res.on('data', function (chunk) {
							var returned = ''+chunk+'';
							returned = message.user.toLowerCase() + ', ' + returned;
							if (filterMsg(returned)) {
								message.say(logMsg(returned));

							}
						});
					});
					return;
				}
			}
			var roll = rollDie(100);
			if (roll > 60) {
				wut = message.user.toLowerCase() + ', ' + wut;
			}
			setTimeout(function() {
				message.say(logMsg(wut));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
			
			
		// off hours - chance to just not say anything
		var rightnow = new Date();
		if (rightnow.getHours() < 9 || rightnow.getHours() > 17 || rightnow.getDay() == 0 || rightnow.getDay() == 6) {
			if (rollDie(2) == 1) {
				return;
			}
		}
		
		
		
		// generic meme responders....
		
		if (/^i can break these cuffs$/i.test(chatline)) {
			message.say(logMsg('You can\'t break those cuffs!'));
			return;
		}
		
		if (/death metal/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('oh hell yeah death metal'));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/^gimme dat bass$/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('Perchance is someone inquiring for an obsequious selection of that bass?'));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/help ?desk/i.test(chatline)) {
			if (rollDie(10) <= 3) {
				setTimeout(function() {
					message.say(logMsg('HERLPDERRSSSSSS'));
				}, Math.round(Math.random() * 1000)+1000);
				return;
			}
		}
		
		if (/\bnom\b/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('nom nom nom'));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/^hip hip!?$/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('horray!'));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/^what /i.test(chatline)) {
			if (rollDie(10) <= 3) {
				setTimeout(function() {
					message.say(logMsg('some people say the cucumbers taste better pickled...'));
				}, Math.round(Math.random() * 1000)+1000);
				return;
			}
		}
		
		if (/^welp/i.test(chatline)) {
			if (rollDie(10) <= 5) {
				setTimeout(function() {
					message.say(logMsg('you\'re tellin me'));
				}, Math.round(Math.random() * 1000)+1000);
				return;
			}
		}
		
		if (/(z|9)/i.test(chatline)) {
			if (rollDie(10) <= 3) {
				setTimeout(function() {
					message.say(logMsg('delicious!'));
				}, Math.round(Math.random() * 1000)+1000);
				return;
			}
		}
		
		if (/youtube.com/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('don\'t click on that link!'));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/\btwitter\b/i.test(chatline)) {
			var wut = '';
			switch (rollDie(3)) {
				case 1:
				wut = 'twitter!? kill it with fire!';
				break;
				case 2:
				wut = 'twitter is for losers';
				break;
				case 3:
				wut = 'twitter ugh';
				break;
			}
			setTimeout(function() {
				message.say(logMsg(wut));
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
			
			
		if (/space jam/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('Everybody get up, it\'s time to slam now! We got a real jam goin down!'));
				setTimeout(function() {
					message.say(logMsg('Welcome to the SPACE JAM!'));
				}, Math.round(Math.random() * 1000)+1000);
			}, Math.round(Math.random() * 1000)+1000);
			return;
		}
		
		if (/^ho+p(!)?$/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('THERE IT IS!'));
			}, Math.round(Math.random() * 1000));
			return;
		}
		
		if (/^who+mp(!)?$/i.test(chatline)) {
			setTimeout(function() {
				message.say(logMsg('THERE IT IS!'));
			}, Math.round(Math.random() * 1000));
			return;
		}
		
		if (/(respect|r e s p e c t)/i.test(chatline)) {
			setTimeout(function() {
				var wut = '';
				var roll = rollDie(4);
				switch (roll) {
					case 1:
					wut = 'find out what it means to me';
					break;
					case 2:
					wut = 'sock it to me, sock it to me';
					break;
					case 3:
					wut = 'immabout to give you allll my money';
					break;
					case 4:
					wut = 'r e s p e c t & tcb';
					break;
				}
				message.say(logMsg(wut));
			}, Math.round(Math.random() * 1000));
			return;
		}
		
		
		// Highlights thing. only do it if it's > 75 chars
		if (chatline.length > 75 && rollDie(5) == 1) {
			var wordpieces = chatline.match(/\b[\w']{4,}\b/gi);
			var randomwords = [];
			if (wordpieces.length > 5) {
				while (randomwords.length < 4) {
					var randomword = wordpieces[Math.floor(Math.random() * wordpieces.length)];
					randomword = randomword.charAt(0).toUpperCase() + randomword.slice(1);
					var alreadythere = false;
					for (var jj = 0; jj < randomwords.length; jj++) {
						if (randomwords[jj] == randomword) {
							alreadythere = true;
						}
					}
					if (!alreadythere) {
						randomwords.push(randomword); 
					}
				}
				var themsg = '';
				for (var kk = 0; kk < randomwords.length; kk++) {
					themsg = themsg + randomwords[kk] + '. ';
				}
				setTimeout(function() {
					if (filterMsg(themsg)) {
						message.say(logMsg(themsg));
					}
				}, Math.round(Math.random() * 1000)+500);
				return;
			}
		}
		
		
		
		
		// random talk... if nothing else...........
		var roll = rollDie(500);
		//console.log('someone spoke: rolled a '+roll+' for possible response');
		var wut = '';
		switch (roll) {
			case 1:
			wut = 'welp.';
			break;
			case 2:
			wut = 'what are you talking about?';
			break;
			case 3:				
			var matches = chatline.match(/\b[\w']+\b/gi);
			if (matches != null && matches.length > 0) {
				if (filterMsg(matches[matches.length-1])) {
					wut = 'so what about "'+matches[matches.length-1]+'"?';
				} else {
					wut = 'hmm.';
				}
			} else {
				wut = 'i do not understand.';
			}
			break;
			case 4:
			case 5:
			case 6:
			case 7:
			http.get({host: my_home_appserver, port: 80, path: '/cylebot/sentence.php'}, function(res) {
				res.on('data', function (chunk) {
					wut = ''+chunk+'';
					setTimeout(function() {
						if (filterMsg(wut)) {
							message.say(logMsg(wut));
						}
					}, Math.round(Math.random() * 1000)+1000);
				});
			});
			break;
			case 8:
			wut = "does anybody know what they're talking about?";
			break;
			case 9:
			var rolltwo = rollDie(4);
			switch (rolltwo) {
				case 1:
				wut = "that's silly";
				break;
				case 2:
				wut = "i'm worried";
				break;
				case 3:
				wut = "that's a bit unwise";
				break;
				case 4:
				wut = "that's a bit upsetting";
				break;
			}
			break;
			default:
			wut = '';
		}
		if (wut != '') {
			setTimeout(function() {
				message.say(logMsg(wut));
			}, Math.round(Math.random() * 1000)+1000);
		}
		
	}); // end of responses

	
}).connect(irc_options);




// every 60 seconds, maybe say something random.....

setInterval(function() {
	var rightnow = new Date();
	var roll = 0;
	var offhours = false;
	if (rightnow.getHours() < 9 || rightnow.getHours() > 17) {
		offhours = true;
	} else if (rightnow.getDay() == 0 || rightnow.getDay() == 6) {
		offhours = true;
	}
	if (offhours) {
		roll = rollDie(700);
	} else {
		roll = rollDie(450);
	}
	//console.log('random chance every 60 seconds: rolled a '+roll);
	switch (roll) {
		case 1:
		var rollagain = rollDie(4);
		switch (rollagain) {
			case 1:
			irc.say(my_home_channel, logMsg('welp...'));
			break;
			case 2:
			irc.say(my_home_channel, logMsg('la la la'));
			break;
			case 3:
			irc.action(my_home_channel, logMsg('is experiencing a random glitch in his programming'));
			break;
			case 4:
			irc.say(my_home_channel, logMsg('omar comin\', yo!'));
			break;
		}
		break;
		case 2:
		if (offhours) {
			return;
		}
		irc.say(my_home_channel, logMsg('so what\'s new, ladies?'));
		break;
		case 3:
		case 4:
		if (offhours) {
			return;
		}
		var restext = '';
		var randomlab = labs[Math.floor(Math.random()*labs.length)];
		var rollagain = rollDie(3);
		switch (rollagain) {
			case 1:
			restext += 'so how is the '+randomlab+' doing?';
			break;
			case 2:
			restext += 'what\'s going on in the '+randomlab+'?';
			break;
			case 3:
			restext += 'anyone checked the '+randomlab+' recently?';
			break;
		}
		irc.say(my_home_channel, logMsg(restext));
		break;
		case 5:
		if (offhours) {
			return;
		}
		if (lastmessages.length > 0) {
			//var whichmessage = Math.floor(Math.random()*lastmessages.length)
			var matches = lastmessages[lastmessages.length-1].match(/\b(\S+)\b/gi);
			// check that there at least two words there...
	//		if (matches.length >= 2) {
	//			irc.say('#AC$', 'so what about "'+matches[matches.length-2]+' '+matches[matches.length-1]+'"?');
	//		} else if (matches.length == 1) {
				if (matches != undefined && matches.length > 0) {
					if (filterMsg(matches[matches.length-1])) {
						irc.say(my_home_channel, logMsg('so what about "'+matches[matches.length-1]+'"?'));
					} else {
						irc.say(my_home_channel, logMsg('hmm.'));
					}
				}
	//		}
		}
		break;
		case 6:
		case 7:
		case 8:
		http.get({host: my_home_appserver, port: 80, path: '/cylebot/lyric.php'}, function(res) {
			res.on('data', function (chunk) {
				var returned = ''+chunk+'';
				if (returned != 'too bad') {
					eval('lyricobj = '+returned);
					//message.say(lyricobj.line);
					if (filterMsg(lyricobj.line)) {
						irc.say(my_home_channel, logMsg(lyricobj.line));
					}
				}
			});
		});
		break;
		case 9:
		case 10:
		case 11:
		http.get({host: my_home_appserver, port: 80, path: '/cylebot/poetry.php'}, function(res) {
			res.on('data', function (chunk) {
				var returned = ''+chunk+'';
				eval('poemobj = '+returned);
				if (filterMsg(poemobj.line)) {
					irc.say(my_home_channel, logMsg(poemobj.line));
				}
			});
		});
		break;
		case 12:
		case 13:
		case 14:
		if (!offhours) {
			return;
		}
		var rollagain = rollDie(3);
		switch (rollagain) {
			case 1:
			irc.action(my_home_channel, logMsg('preens the outer layers of his circuitry.'));
			break;
			case 2:
			irc.say(my_home_channel, logMsg('I wonder where everyone went...'));
			break;
			case 3:
			irc.say(my_home_channel, logMsg('someday I\'m going to leave this server farm.'));
			break;
		}
		break;
		case 15:
		case 16:
		case 17:
		case 18:
		if (offhours) {
			return;
		}
		http.get({host: my_home_appserver, port: 80, path: '/cylebot/sentence.php'}, function(res) {
			res.on('data', function (chunk) {
				var returned = ''+chunk+'';
				if (filterMsg(returned)) {
					irc.say(my_home_channel, logMsg(returned));
				}
			});
		});
		break;
		case 19:
		if (offhours) {
			return;
		}
		if (lastwords.length > 0) {
			// pick a random word and define it
			var random_word = lastwords[(rollDie(lastwords.length) - 1)];
			var thelookup = "/w/api.php?format=json&action=query&titles="+random_word+"&prop=revisions&rvprop=content";
			var returned_stuff = '';
			http.get({host: 'en.wiktionary.org', port: 80, path: thelookup, headers: { "User-Agent": "Cylebot" } }, function(res) {
				res.on('data', function (chunk) {
					returned_stuff += ''+chunk+'';
				});
				res.on('end', function() {
					defineobj = JSON.parse(returned_stuff);
					var defineobj = defineobj['query']['pages'];
					if (defineobj['-1'] != undefined) {
						return;
					}
					var definetxt = '';
					for (var i in defineobj) {
						definetxt = '' + defineobj[i]['revisions'][0]['*'] + '';
					}
					define_matches = definetxt.match(/# (.+)\n/ig);
					if (define_matches == undefined || define_matches[0] == undefined) {
						return;
					}
					for (var i = 0; i < define_matches.length; i++) {
						if (/\{\{obsolete\}\}/gi.test(define_matches[i])) {
							continue;
						} else 	if (/\{\{(.*)?rare(.*)?\}\}/gi.test(define_matches[i])) {
							continue;
						} else if (/\{\{(in)?transitive\}\}/.test(define_matches[i])) {
							continue;
						} else {
							the_definition = define_matches[i];
							break;
						}
					}
					if (the_definition == undefined || the_definition.trim() == '') {
						return;
					}
					if (/{{plural of\|(.+)}}/i.test(the_definition)) {
						the_definition = the_definition.replace(/{{plural of\|(.+)}}/ig, 'plural of $1');
					}
					if (/{{alternative spelling of\|(.+)}}/i.test(the_definition)) {
						the_definition = the_definition.replace(/{{alternative spelling of\|(.+)}}/ig, 'alternative spelling of $1');
					}
					if (/{{alternative form of\|(.+)}}/i.test(the_definition)) {
						the_definition = the_definition.replace(/{{alternative spelling of\|(.+)}}/ig, 'alternative form of $1');
					}
					the_definition = the_definition.replace(/\{\{([^}]*)\}\}/ig, '');
					the_definition = the_definition.replace(/\[\[([^\|]*\|)?/ig, '');
					the_definition = the_definition.replace(/\]\]/ig, '');
					the_definition = the_definition.substring(2);
					the_definition = the_definition.replace(/'''/g, '');
					the_definition = the_definition.replace(/''/g, '');
					if (the_definition == undefined || the_definition.trim() == '' || the_definition.trim() == '.') {
						return;
					}
					irc.say(my_home_channel, logMsg(random_word + ': ' + the_definition.trim()));
				});
			});
		}
		break;
	}
}, 60000);
