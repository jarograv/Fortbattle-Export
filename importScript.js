/*
TODO:
- way to check fort size
*/
var promptIds = prompt("Enter the battle id(s) you want to get. Either enter a single id (ex. 12345) or a range of ids seperated by a dash (-) (ex. 12345-67890");
var promptIds = promptIds.split("-");
var idsToGet = promptIds.map(Number);
var rangeStart = Math.min.apply(null, idsToGet);
var rangeEnd = Math.max.apply(null, idsToGet);
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
        a.click();
    }
    download(battleData, 'battleData.csv', 'text/csv');
});