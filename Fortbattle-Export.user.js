// ==UserScript==
// @name         Fort Battle to CSV Exporter
// @description  Exports battles from the-west to csv spreadsheet format
// @version      0.1
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
	versionControl: {
		version: 0.1,
		isOutdated: function() {
			return fortbattleImport.localData.storage.latestVersion > fortbattleImport.versionControl.version;
		},
		notifyOutdated: function() {
			if (fortbattleImport.versionControl.isOutdated()) {
                console.log("Fortbattle-Export is outdated");
				new west.gui.Dialog('Fortbattle-Export is outdated', 'There\'s a new version of available. Do you want to install it?', west.gui.Dialog.SYS_WARNING).addButton("Install!", function() {
					window.open('https://raw.githubusercontent.com/jarograv/Fortbattle-Export/master/Fortbattle-Export.user.js', '_blank');
				}).addButton("Close", function() {}).show();
			}
		}
	},
	localData:{
        storage: null,
        init: function() {
            $.get("https://raw.githubusercontent.com/jarograv/Fortbattle-Export/master/localData.json", function(data) {
                fortbattleImport.localData.storage = data;
                fortbattleImport.versionControl.notifyOutdated();
            }).fail(function() {
            });
        }
	},
	scriptWindow: {
		registerWestApi: function() {
			var content = "Fortbattle-Export, developed by jarograv. Feedback, bug reports, and ideas can be posted on the international forum.<br><br> <b>How to use:</b> <br>1. Enter the ID of the first battle you want to import.<br>2. Enter the ID of the second battle you want to import. Alternatively, leave this field blank if you just want to import a single battle.<br>3. Click the \"Export\" button.<br>";
            var rangeStart = new west.gui.Textfield('rangeStart','text');
            var rangeEnd = new west.gui.Textfield('rangeEnd','text');
            var saveBtn = new west.gui.Button("Export", function () {
				fortbattleImport.runScript.runExport();
			});
			TheWestApi.register('Fortbattle-Export', 'Fortbattle-Export', '2.63', Game.version.toString(), 'jarograv', 'https://github.com/jarograv/Fortbattle-Export').setGui($('<div>' + content +
      '</div>').append('<br><div><b>First battle ID:</b>').append(rangeStart.getMainDiv()).append('</div><br><div><b>Last battle ID:</b></div>').append(rangeEnd.getMainDiv()).append('<br>').append(saveBtn.getMainDiv()).append('<br><i>If you do not know how to get the battle ID\'s <a href="https://github.com/jarograv/Fortbattle-Export/blob/master/Battle%20ID%20Instructions.png?raw=true">click here</a>.</i><br><i>It is recommended that you do not attempt to import more than 25 battles.</i>'));
		}
	},
	runScript: {
        runExport: function() {
            $.getScript('https://rawgit.com/jarograv/Fortbattle-Export/master/importScript.js', function() {
            });
        }
	}
};

fortbattleImport.localData.init();
fortbattleImport.scriptWindow.registerWestApi();