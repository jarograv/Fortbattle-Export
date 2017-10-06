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
	VersionControl: {
		version: 0.1,
		isOutdated: function() {
			return fortbattleImport.localData.latestVersion > fortbattleImport.VersionControl.version;
		},
		notifyOutdated: function() {
			if (fortbattleImport.VersionControl.isOutdated()) {
				new west.gui.Dialog('Fortbattle-Export is outdated', 'There\'s a new version of available. Do you want to install it?', west.gui.Dialog.SYS_WARNING).addButton("Install!", function() {
					window.open('https://raw.githubusercontent.com/jarograv/Fortbattle-Export/master/Fortbattle-Export.user.js', '_blank');
				}).addButton("Close", function() {}).show();
			}
		}
	},
	localData:{
		init: function() {
		
		}
	}
}