// Initialisations
cols = 4
rows = 5
var chiffreMax
var tabNbDiscovered = new Array()	// Combien de fois on a dévoilé tel chiffre ? À chaque fois qu'on le dévoile plus d'une fois sans succès, c'est une erreur
var nbClicked // On en est à combien de case dévoilées ? 1 puis 2 puis 3->1
var damierNbDiscovered	// Combien de paires on a dévoilé au total. Arrivé à chiffreMax : on a terminé
var buttonFirstClicked
var nbErreurs


function restart(nbPaires)
{
	if (nbPaires == 3) { cols = 3; rows = 2 }
	if (nbPaires == 4) { cols = 4; rows = 2 }
	if (nbPaires == 6) { cols = 4; rows = 3 }
	if (nbPaires == 8) { cols = 4; rows = 4 }
	if (nbPaires == 10) { cols = 5; rows = 4 }
	if (nbPaires == 12) { cols = 6; rows = 4 }
	if (nbPaires == 16) { cols = 8; rows = 4 }
	if (nbPaires == 20) { cols = 8; rows = 5 }
	if (nbPaires == 22) { cols = 11; rows = 4 }
	if (nbPaires == 24) { cols = 8; rows = 6 }
	if (nbPaires == 26) { cols = 13; rows = 4 }
	if (nbPaires == 28) { cols = 8; rows = 7 }
	init()
}


function init()
{
	console.log("Initialisation du jeu");

	var resteAPlacer = new Array()	// Combien de fois il reste à placer tel chiffre, lors de la construction du damier
	chiffreMax = cols * rows / 2
	nbErreurs = 0
	$('#erreurs').text(0)
	nbClicked = 0
	damierNbDiscovered = 0

	// Vidage du tableau
	$('#damier').html('');

	for (i = 1 ; i <= chiffreMax ; i++)
	{
		resteAPlacer[i] = 2
		tabNbDiscovered[i] = 0
	}

	for (j = 0 ; j < rows ; j++) {
		$('#damier').append('<tr>');

		for (i = 0 ; i < cols ; i++)
		{
			do
				unChiffre = parseInt(Math.random() * chiffreMax + 1)
			while (resteAPlacer[unChiffre]==0)

			// Construit un code HTML qui ressemblera à ça :
			// <div id=1-5 data-nb=13 data-devoilee=0><span>13</span></div>
			$('#damier').append('<td><div id="' + i + '-' + j + '" data-nb="' + unChiffre + '" data-devoilee="0"><span>' + unChiffre + '</span></div>')
			resteAPlacer[unChiffre]--
		}
	}
	$('#damier td > div span').css('visibility', 'hidden')

	$('#damier div').on('click', function()
	{
		// Si c'est le premier bouton cliqué, on enregistre sa valeur
		if (nbClicked == 0) {
			$('#damier div span').css('visibility','hidden') // On cache les valeurs affichées sur les boutons
			buttonFirstClicked = $(this)
		}
		// Si c'est le deuxième bouton cliqué, on vérifie le résultat (2 cas)
		else if (nbClicked == 1 && $(this).attr('id') != buttonFirstClicked.attr('id')) {
			if ($(this).data('nb') == buttonFirstClicked.data('nb')) { // Cas 1 : on a cliqué la bonne paire...
				$(this).fadeOut(1000)
				$(buttonFirstClicked).fadeOut(1000)
				damierNbDiscovered++
				if (damierNbDiscovered == chiffreMax) // ... et on a peut-être terminé la partie
				{
					setTimeout("victory()", 800)
				}
			}
			else { // Cas 2 : 2 cas d'erreur
				if (tabNbDiscovered[buttonFirstClicked.data('nb')]) nbErreurs++ // Le premier chiffre était déjà dévoilé : je n'avais plus droit à l'erreur
				else if ($(this).data('devoilee')) nbErreurs++ // La deuxième case était déjà dévoilée : je n'aurai pas dû la re-cliquer
			}
			tabNbDiscovered[$(this).data('nb')]++ // On retient qu'on a dévoilé ce chiffre. Plus droit à l'erreur !
			tabNbDiscovered[$(buttonFirstClicked).data('nb')]++ // On retient qu'on a dévoilé ce chiffre. Plus droit à l'erreur !
			$(this).data('devoilee', 1) // On retient qu'on a dévoilé cette case. Plus droit à l'erreur !
			$(buttonFirstClicked).data('devoilee', 1) // On retient qu'on a dévoilé ce chiffre. Plus droit à l'erreur !
		}
		// On divulgue le bouton cliqué et on incrémente son nombre de discovery (inutile : 0 ou 1 suffisent)
		$(this).children().css('visibility', 'visible')
		nbClicked = (nbClicked+1) % 2
		$('#erreurs').text(nbErreurs)
	});
}

function victory() {
	if (nbErreurs)
		alert ('Terminé avec ' + nbErreurs + ' erreur' + (nbErreurs > 1 ? 's' : '') + '.')
	else
		alert ('Manche parfaite !!! Bravo !!!')
	init()
}