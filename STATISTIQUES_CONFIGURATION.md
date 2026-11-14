# Statistiques ARRAHMA — activation nécessaire

Compte configuré : associationarrahma.goatcounter.com. Le compteur public est autorisé et le tableau de bord est réservé aux utilisateurs connectés. Collecte limitée aux pages, sessions et événements de téléchargement ; provenances, appareils, tailles d’écran, langues et localisation désactivés. Vérifications de production à effectuer après déploiement.

## Activation du compte

1. Créer le compte de l’association sur https://www.goatcounter.com/signup avec une adresse contrôlée par l’association. Le propriétaire définit lui-même son mot de passe et valide toute vérification humaine ou condition contractuelle.
2. Garder le tableau de bord **privé**. Ne pas activer l’accès public aux statistiques détaillées.
3. Dans les paramètres du site, autoriser uniquement le compteur de visites public (« Allow adding visitor counts on your website »). Cela n’est pas la publication du tableau de bord.
4. Le nom exact attribué au compte (partie avant `.goatcounter.com`) doit remplacer null dans analytics-config.json. Aucun jeton API ni mot de passe ne doit être placé dans le dépôt.
5. Vérifier le domaine autorisé : associationarrahma2025-oss.github.io. Désactiver la collecte des provenances, appareils, langues, tailles d’écran et localisations si elle n’est pas nécessaire ; garder la collecte des visites individuelles désactivée.
6. Publier le code puis ouvrir une page du site public. Vérifier la remontée des pages, un clic sur chacune des quatre fiches, le compteur TOTAL et la fermeture des statistiques détaillées à un visiteur non connecté. Ne pas désactiver le blocage des aperçus locaux pour gonfler les chiffres.
7. Le propriétaire ajoute ensuite les comptes de l’équipe autorisés dans GoatCounter. Le nom et la liste des membres restent à fournir ; ne pas les inventer.

## Ce qui est mesuré

- Compteur global GoatCounter (`TOTAL`), affiché sous « Visites du site », avec jusqu’à quatre heures de cache côté service.
- Pages consultées : chemin de page, sans paramètres ni fragment ; titre ; provenance limitée à l’origine.
- Événements : clics sur les quatre liens de téléchargement, sans bloquer les téléchargements. Cela ne prouve pas l’enregistrement du fichier.
- Aucun compteur de personnes connectées en temps réel et aucune inscription ou présence à une activité n’est ajoutée.
- Les pages de l’espace équipe et les aperçus ne sont pas comptés.

## Vie privée et fonctionnement

Les signaux DNT/GPC et le choix de désactivation sont respectés. Le choix de désactivation utilise localStorage ; si le navigateur le bloque, le choix n’est conservé que pendant la page en cours. Un compteur indisponible affiche un tiret, jamais un nombre inventé ou un zéro trompeur. Le site et les téléchargements fonctionnent si le prestataire est indisponible.

La protection des détails repose sur la connexion du service, pas sur un mot de passe dans JavaScript ni un chemin « secret ». La page statistiques.html est seulement un point d’entrée public vers le tableau de bord authentifié et un accès au choix de confidentialité.

Documentation officielle : https://www.goatcounter.com/help/start ; https://www.goatcounter.com/help/visitor-counter ; https://www.goatcounter.com/help/js ; https://www.goatcounter.com/help/privacy .
