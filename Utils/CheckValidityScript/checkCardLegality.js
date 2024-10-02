const fs = require("fs");
const readline = require("readline");

//#region utils

//Metodo per effettuare i console.debug, basato su isDebugMode
function CustomConsole(textListToSee) {
	//Metodo per effettuare un singolo console.
	//Usato direttamente per il dato in input se è string o object
	function SingleConsole(textToSee) {
		try {
			console.debug(
				new Date().toISOString().replace("T", " ").replace("Z", ""),
				textToSee
			);
		} catch (errorMessage) {
			console.debug(errorMessage);
		}
	}

	//Controllo se è array
	if (Array.isArray(textListToSee)) {
		//Se array lo cicla e chiama SingleConsole per ogni valore
		textListToSee.forEach(function (singleTextToSee) {
			SingleConsole(singleTextToSee);
		});
	} else {
		//Se non è array, chiama il valore direttamente
		SingleConsole(textListToSee);
	}
}

const reset = "\x1b[0m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";

//#endregion utils

//#region Main

CustomConsole(yellow + "START" + reset);

// Controlla se il file 'cardList.txt' esiste
fs.access("cardList.txt", fs.constants.F_OK, (errorMessageExistCardList) => {
	//Controllo di sicurezza
	if (errorMessageExistCardList) {
		CustomConsole(red + "File NOT Found [cardList]" + reset);

		CustomConsole(yellow + "END" + reset);
		return;
	}

	//Se invece il file esiste
	CustomConsole(blue + "1 - File Found [cardList]" + reset);

	const fs = require("fs");

	// Controlla se il file 'ScryfallAllCards.json' esiste
	fs.access(
		"ScryfallAllCards.json",
		fs.constants.F_OK,
		(errorMessageExistScryfallAllCards) => {
			//Controllo di sicurezza
			if (errorMessageExistScryfallAllCards) {
				CustomConsole(
					red +
					"File NOT Found [ScryfallAllCards]" +
					reset
				);

				CustomConsole(yellow + "END" + reset);
				return;
			}

			//Se invece il file esiste
			CustomConsole(blue + "2 - File Found [ScryfallAllCards]" + reset);

			// Se il file esiste, leggilo
			fs.readFile(
				"ScryfallAllCards.json",
				"utf8",
				(errorMessageScryfallAllCards, fileDataScryfallAllCards) => {
					//Controllo di sicurezza
					if (errorMessageScryfallAllCards) {
						CustomConsole(
							red + errorMessageScryfallAllCards + reset
						);

						CustomConsole(yellow + "END" + reset);
						return;
					}

					// Parsea il contenuto del file JSON
					let jsonDataScryfallAllCards = JSON.parse(
						fileDataScryfallAllCards
					);

					//Se riesce a leggere il file
					CustomConsole(
						blue +
						"3 - File reading started [ScryfallAllCards]" +
						reset
					);

					// Legge il file 'cardList.txt' nella stessa cartella
					fs.readFile(
						"cardList.txt",
						"utf8",
						(errorMessageCardList, fileDataCardList) => {
							//Controllo di sicurezza
							if (errorMessageCardList) {
								CustomConsole(
									red + errorMessageCardList + reset
								);

								CustomConsole(yellow + "END" + reset);
								return;
							}

							//Se riesce a leggere il file
							CustomConsole(
								blue +
								"4 - File reading started [cardList]" +
								reset
							);

							//Si spezza il contenuto del file delle carte in un array di str
							const rowArray = fileDataCardList.split("\n");

							CustomConsole(blue +
								"Row Found: " + rowArray.filter((singleCardRow) => singleCardRow
									.trim()
									.replace(/[0-9\s]/g, "") != "").length +
								reset)

							//Cicla ogni riga del file delle carte
							rowArray.forEach((singleCardRow) => {
								//Controllo di sicurezza
								if (
									singleCardRow
										.trim()
										.replace(/[0-9\s]/g, "") == ""
								) {
									return;
								}
								//cerca se trova una carta con quel nome ed uscita prima o nel 2003
								const findObj = jsonDataScryfallAllCards.find(
									(singleJsonDataScryfallAllCards) => {
										return (
											singleJsonDataScryfallAllCards.name
												.trim()
												.replace(/[0-9\s]/g, "")
												.toLowerCase() ==
											singleCardRow
												.trim()
												.replace(/[0-9\s]/g, "")
												.toLowerCase() &&
											parseInt(
												singleJsonDataScryfallAllCards.released_at.split(
													"-"
												)[0] ?? ""
											) <= 2003
										);
									}
								);
								//Stampa il risultato
								CustomConsole(
									(findObj != null
										? green + "OK "
										: red + "NO ") +
									singleCardRow +
									reset
								);
							});

							CustomConsole(yellow + "END" + reset);
						}
					);
				}
			);
		}
	);
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("", () => {
	rl.close();
});

//#endregion Main
