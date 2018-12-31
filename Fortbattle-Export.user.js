// ==UserScript==
// @name         Fort Battle to CSV Exporter
// @description  Exports battles from the-west to csv spreadsheet format
// @version      0.51
// @author       jarograv
// @match           https://*.the-west.net/game.php*
// @match           https://*.the-west.de/game.php*
// @match           https://*.the-west.pl/game.php*
// @match           https://*.the-west.nl/game.php*
// @match           https://*.the-west.se/game.php*
// @match           https://*.the-west.ro/game.php*
// @match           https://*.the-west.com.pt/game.php*
// @match           https://*.the-west.cz/game.php*
// @match           https://*.the-west.es/game.php*
// @match           https://*.the-west.ru/game.php*
// @match           https://*.the-west.com.br/game.php*
// @match           https://*.the-west.org/game.php*
// @match           https://*.the-west.hu/game.php*
// @match           https://*.the-west.gr/game.php*
// @match           https://*.the-west.dk/game.php*
// @match           https://*.the-west.sk/game.php*
// @match           https://*.the-west.fr/game.php*
// @match           https://*.the-west.it/game.php*
// @downloadURL     https://raw.githubusercontent.com/jarograv/Fortbattle-Export/master/Fortbattle-Export.user.js
// @updateURL       https://raw.githubusercontent.com/jarograv/Fortbattle-Export/master/Fortbattle-Export.user.js
// @grant        	none
// @run-at          document-end
// ==/UserScript==
var fortbattleImport = {
	scriptWindow: {
		registerWestApi: function() {
			var content = "Fortbattle-Export, developed by jarograv. Feedback, bug reports, and ideas can be posted on the international forum.<br><br> <b>How to use:</b> <br>1. Enter the ID of the first battle you want to export.<br>2. Enter the ID of the second battle you want to export. Alternatively, leave this field blank if you just want to export a single battle.<br>3. Click the \"Export\" button.<br>";
            var rangeStart = new west.gui.Textfield('rangeStart','text');
            var rangeEnd = new west.gui.Textfield('rangeEnd','text');
            var saveBtn = new west.gui.Button("Export", function () {
				new UserMessage("Running script...", UserMessage.TYPE_SUCCESS).show();
				fortbattleImport.runScript.runExport();
			});
			TheWestApi.register('Fortbattle-Export', 'Fortbattle-Export', '2.63', Game.version.toString(), 'jarograv', 'https://github.com/jarograv/Fortbattle-Export').setGui($('<div>' + content +
      '</div>').append('<br><div><b>First battle ID:</b>').append(rangeStart.getMainDiv()).append('</div><br><div><b>Last battle ID:</b></div>').append(rangeEnd.getMainDiv()).append('<br>').append(saveBtn.getMainDiv()).append('<br><i>If you do not know how to get the battle ID\'s <a href="https://github.com/jarograv/Fortbattle-Export/blob/master/Battle%20ID%20Instructions.png?raw=true">click here</a>.</i><br><i>It is recommended that you do not attempt to export more than 50 battles at once.</i>'));
		}
	},
	runScript: {
        runExport: function() {
            /*
TODO:
- way to check fort size
- calculations for % filled
- support for other languages
*/
var rangeStart = parseInt(document.getElementById('rangeStart').value);
var rangeEnd = parseInt(document.getElementById('rangeEnd').value);
if (isNaN(rangeEnd)) {rangeEnd=rangeStart};
var execute = function(){
	var rangeSize = rangeEnd - rangeStart + 1;
	var battlesToGet = Array.from({length: rangeSize}, (v, k) => k+rangeStart);
	var battleData = [];
	var fields = [];
	var promises = [];
	for (let battleId of battlesToGet) {
	  promises.push(
			new Promise(function (resolve, reject) {
				Ajax.remoteCallMode('fort_battleresultpage', 'get_battle', {battle_id: battleId}, function(resp) {
					var jsonAttack = resp.stats.result.attackerlist;
					fields = Object.keys(jsonAttack[0]);
					for (n = 0; n < jsonAttack.length; n++) {
						var record = Object.values(jsonAttack[n])
						var jsonDefence = resp.stats.result.defenderlist
						var defenceLength = jsonDefence.length;
						var enemiesKod = 0;
						for(var i = 0; i < defenceLength; i++){
							if(jsonDefence[i].killedby == jsonAttack[n].westid)
								enemiesKod++;
							} //Find number of enemies killed
						var date = new Date(resp.stats.result_date*1000+7200000);
						var estimatedBonds = 1;
						if (resp.stats.result.outcome == "DEFENDER_WIPED" || resp.stats.result.outcome == "FLAGLOST") {estimatedBonds++};
						estimatedBonds += jsonAttack[n].hitcount * 0.1;
						estimatedBonds += jsonAttack[n].dodgecount * 0.1;
						estimatedBonds += jsonAttack[n].totalcauseddamage * 0.0005;
						estimatedBonds += enemiesKod;
						estimatedBonds += jsonAttack[n].onlinecount * 0.1;
						if (estimatedBonds > 26) {estimatedBonds = 26};
						battleData.unshift("\n" + record.join(',')
						+ "," +  (jsonAttack[n].totalcauseddamage / jsonAttack[n].hitcount).toFixed(2)
						+ "," +  enemiesKod
						+ "," +  "Attacker"
						+ "," +  resp.stats.result.roundsplayed
						+ "," +  resp.stats.result.outcome
						+ "," +  resp.stats.result.fortname
						+ "," +  resp.stats.result.declarername
						+ "," +  resp.stats.result.attackertownname
						+ "," +  resp.stats.result.defendertownname
						+ "," +  resp.stats.attacker_count
						+ "," +  resp.stats.defender_count
						+ "," +  "fortSize" //unquote me - do some magic by checking the fort sectors (use an inside sector)
						+ "," +  "[Attacker Percent Filled placeholder]" //based on above
						+ "," +  "[Defender Percent Filled placeholder]" //based on above - might need some magic to get working with both async funcs
						+ "," + battleId.toString()
						+ "," +  estimatedBonds.toFixed(0)
						+ "," +  (parseInt(date.getUTCMonth())+1).toString() + "/" + date.getUTCDate() + "/" + date.getUTCFullYear()
						+ "," +  resp.stats.result.attackertownid
						+ "," +  resp.stats.result.defendertownid
						+ "," +  date.getUTCHours() + ":" + date.getUTCMinutes()
						)
					}; //attacker stuff end

					for (n = 0; n < jsonDefence.length; n++) {
						var record = Object.values(jsonDefence[n]);
						var attackLength = jsonAttack.length;
						var enemiesKod = 0;
						for(var i = 0; i < attackLength; i++){
							if(jsonAttack[i].killedby == jsonDefence[n].westid)
								enemiesKod++;
							}; //Find number of enemies killed
						var date = new Date(resp.stats.result_date*1000+7200000);
						var estimatedBonds = 1;
						if (resp.stats.result.outcome == "FINALROUND" || resp.stats.result.outcome == "ATTACKER_WIPED") {estimatedBonds++};
						estimatedBonds += jsonDefence[n].hitcount * 0.1;
						estimatedBonds += jsonDefence[n].dodgecount * 0.1;
						estimatedBonds += jsonDefence[n].totalcauseddamage * 0.0005;
						estimatedBonds += enemiesKod;
						estimatedBonds += jsonDefence[n].onlinecount * 0.1;
						if (estimatedBonds > 26) {estimatedBonds = 26};
						battleData.unshift("\n" + record.join(',')
						+ "," +  (jsonDefence[n].totalcauseddamage / jsonDefence[n].hitcount).toFixed(2)
						+ "," +  enemiesKod
						+ "," +  "Defender"
						+ "," +  resp.stats.result.roundsplayed
						+ "," +  resp.stats.result.outcome
						+ "," +  resp.stats.result.fortname
						+ "," +  resp.stats.result.declarername
						+ "," +  resp.stats.result.attackertownname
						+ "," +  resp.stats.result.defendertownname
						+ "," +  resp.stats.attacker_count
						+ "," +  resp.stats.defender_count
						+ "," +  "fortSize" //unquote me - do some magic by checking the fort sectors (use an inside sector)
						+ "," +  "[Attacker Percent Filled placeholder]" //based on above
						+ "," +  "[Defender Percent Filled placeholder]" //based on above - might need some magic to get working with both async funcs
						+ "," + battleId.toString()
						+ "," +  estimatedBonds.toFixed(0)
						+ "," +  (parseInt(date.getUTCMonth())+1).toString() + "/" + date.getUTCDate() + "/" + date.getUTCFullYear()
						+ "," +  resp.stats.result.attackertownid
						+ "," +  resp.stats.result.defendertownid
						+ "," +  date.getUTCHours() + ":" + date.getUTCMinutes()
						)
					} //defender stuff end
					resolve();
				});
			})
		);
	}
	Promise.all(promises).then(function (value) {
		battleData.unshift(fields.join(',') + ",Average Damage Inflicted,Enemies KOd,Player Side,Number of Rounds in Battle,	Outcome,Fort Name,Digger Name,Attacking Town,Defending Town,Number of Attackers,Number of Defenders,Fort Size,Attacker Percent Filled,Defender Percent Filled,BattleID,Estimated Bonds,Date,Attacker Town ID,Defender Town ID,Time") // add header column
		function download(text, name, type) {
            var a = document.createElement("a");
            var file = new Blob([text], {
                type: type
            });
            a.href = URL.createObjectURL(file);
            a.download = name;
            a.dispatchEvent(new MouseEvent('click'));
        }
		download(battleData, 'battleData.csv', 'text/csv');
	});
}
execute();
        }
	}
};

fortbattleImport.scriptWindow.registerWestApi();
