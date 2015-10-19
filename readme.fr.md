# The Art of Node
## Une introduction à Node.js

Si vous souhaitez découvrir Node et que les connaissances énoncées ci-après vous sont familières, ce document est fait pour vous :

- Un langage de script, tel que JavaScript, Ruby, Python, Perl, etc. Si vous n'êtes pas programmeur, vous préfèrerez sans doute précéder cette lecture par la découverte de [JavaScript for Cats](http://jsforcats.com/). :cat2:
- Git & Github qui sont les outils de collaboration privilégiés par la communauté. Rassurez-vous, pas besoin d'être expert, quelques connaissances basiques suffiront. Au besoin, voici trois superbes tutos pour bien démarrer avec git : [1](http://skli.se/2012/09/22/introduction-to-git/), [2](http://ericsteinborn.com/github-for-cats/#/), [3](http://opensourcerer.diy.org/)

Ce court livre est une oeuvre en cours de réalisation. Si vous l'aimez, **donnez-moi un dollar** via
[gittip](https://www.gittip.com/maxogden/) pour me permettre d'y consacrer du temps !

[![donate](donate.png)](https://www.gittip.com/maxogden/)

## Sommaire

- [Apprentissage Interactif de Node](#apprentissage-interactif-de-node)
- [Comprendre Node](#comprendre-node)
- [Modules de base](#modules-de-base)
- [Callbacks](#callbacks)
- [Evenements](#evenements)
- [Flux](#flux)
- [Modules & npm](#modules)
- [Développement côté client avec npm](#developpez-cote-client-avec-npm)
- [Suivez le mouvement !](#suivez-le-mouvement)

## Apprentissage Interactif de Node

Par expérience, j'ai appris que la simple lecture d'un guide ne se suffit pas à elle-même. Gardez votre éditeur de texte favoris sous la main et écrivez du node en parallèle ! Apprendre en codant est le meilleur moyen d'intégrer les concepts que vous lirez.

### NodeSchool.io

[NodeSchool.io](http://nodeschool.io/) est une série d'ateliers opensource et gratuits qui vous enseignerons les principes de Node.js, et plus encore pour les curieux !

[Learn You The Node.js](https://github.com/rvagg/learnyounode#learn-you-the-nodejs-for-much-win) est le cours introductif aux ateliers NodeSchool.io. Il met en scène les principaux cas d'utilisation de Node.js. Il est conçu pour être utilisé directement en ligne de commande.

[![learnyounode](https://github.com/rvagg/learnyounode/raw/master/learnyounode.png)](https://github.com/rvagg/learnyounode#learn-you-the-nodejs-for-much-win)

Installez-le avec npm:

```
# install
npm install learnyounode -g

# start the menu
learnyounode
```

## Comprendre Node

Node.js est un projet opensource conçu pour vous aider à écrire des programmes JavaScript qui interagissent avec des réseaux, des Filesystems ou toute autre source d'I/O (entrée/sortie, lecture/ecriture). Et c'est tout! Node n'est qu'une plateforme simple et stable qui vous encourage à construire des modules par dessus.

Avec quelques exemples, tout sera plus clair. Ci-après le diagramme d'une application que j'ai réalisé avec Node et qui présente de nombreuses sources d'I/O:

![server diagram](server-diagram.png)

Rassurez-vous, vous n'avez pas besoin de tout comprendre à ce graphe. Le but est de vous montrer qu'un simple processus node (l'hexagone au centre) peut agir comme un hub entre les différentes sources d'I/O (en orange et violet sur le diagramme).

Usuellement, produire ce type de système induit deux conséquences probables:

- D'excellentes performances a l'exécution, mais aux prix de difficultés dans l'écriture (comme partir de zéro pour écrire un serveur web en C)
- Une simplicité d'écriture, mais de faibles performances, ou un manque de robustesse (comme quand quelqu'un essaye d'envoyer un fichier de 5Go sur votre serveur et qu'il crash)

L'objectif poursuivit par Node est de trouver l'équilibre entre ces deux situations : Être accessible tout en offrant des performances optimales.

Attention, Node n'est ni :

  - Un framework web (comme Rails ou Django, même s'il peut être utilisé pour produire ce genre de choses)
  - Un langage de programmation (Il est basé sur JavaScript mais node n'est pas son propre langage)

Au lieu de cela, Node se situe quelque part au milieu. On peut dire qu'il est à la fois :

  - Conçu pour être simple et donc relative facile à comprendre et utiliser
  - Adapté aux programmes fondés sur des I/O, nécessitants rapidité et capacité à gérer de nombreuses connections

A bas niveau, Node peut se décrire comme un outil permettant l'écriture de deux types de programmes majeurs :

  - Les programmes de Réseaux qui utilisent les protocoles du web: HTTP, TCP, UDP, DNS and SSL
  - Les programmes qui lisent et écrivent des données dans les filesystem ou dans les processus locaux ou en mémoire.

Qu'est-ce qu'un programme "fondé sur des I/O" ? Voici quelques exemples de sources:

  - Bases de données (e.g. MySQL, PostgreSQL, MongoDB, Redis, CouchDB)
  - APIs (e.g. Twitter, Facebook, Notifications Push Apple)
  - HTTP/connections WebSocket (des utilisateurs d'une application web)
  - Fichiers (redimensionnement d'images, editeur video, radio internet)

Node gère les I/O de manière [asynchrone](http://en.wikipedia.org/wiki/Asynchronous_I/O) ce qui le rend très efficace dans la gestion de processus simultanés. Prenons un exemple: si vous commander un cheeseburger dans un fast-food, ils prendront votre commande et vous feront patienter le temps que votre plat soit prêt. Pendant ce temps, ils prendront les commandes des autres clients et n'auront aucun mal à démarrer la cuissons de leur cheeseburger en parralèle. Maintenant imaginez un peu si vous deviez attendre votre sandwich au comptoire, empêchant tous les clients derrière vous de commander jusqu'à ce que votre produit soit prêt ! On appelle cela l'**I/O Bloquante** car toutes les I/O se produisent l'une après l'autre. Node, à contrario, est **non-bloquante**, ce qui signifie qu'il peut cuire plusieurs cheeseburgers à la fois !

Quelques exemples amusants de choses permises par la nature non-bloquante de Node :

  - Contrôler des [quadricopters volants](http://nodecopter.com)
  - Ecrire des bots IRC
  - Créer des [robots marcheurs bipèdes](http://www.youtube.com/watch?v=jf-cEB3U2UQ)

## Modules de base

Pour commencer, je vous suggère d'installer Node sur votre machine. Le plus simple est de vous rendre sur [nodejs.org](http://nodejs.org) et de cliquer sur 'Install'.

Node possède nativement un petit groupe de modules (qui réponds communément au nom de 'Node core' - 'Coeur de Node') qui sont présenté en tant qu'API publique, et avec lesquels nous sommes censés écrire nos programmes. Pour travailler avec un file system, il y a le module 'fs', et pour les réseaux, les modules comme `net` (TCP), `http`, `dgram` (UDP).

En sus de `fs` et des modules de réseau, le Coeur de Node propose d'autres modules de base. Il existe un module pour gérer les requêtesDNS de manière asynchrones nommé `dns`, un autre pour récupérer les informations spécifiques à l'OS comme la path du tmpdir nommé `os`, encore un pour allouer des morceaux de mémoire nommé `buffer`, d'autres pour parser les url et les paths (`url`, `querystring`, `path`), etc. La plus part, sinon tous, sont là pour gérer le principal cas d'utilisation de node: Ecrire rapidement des programmes qui parlent aux files systems et aux réseaux.

Node possède plusieurs cordes à son arc pour gérer les 'I/O: des callbacks, des évènements, des streams - 'flux' et des modules. Si vous arrivez à apprendre comment ces quatre structures fonctionnent, alors vous serez capable d'aller dans n'importe lequel des module core de Node, et de comprendre comment vous interfacer avec eux.

## Callbacks

Voilà le sujet le plus important si vous voulez comprendre comment utiliser node. On retrouve les callbacks à peu près partout dans Node. Ils n'ont pas été inventés par node cependant, ils font simplement parti intégrante de JavaScript.

Les Callbacks sont des fonctions qui s'exécutent de manière asynchrone ou plus tard dans le temps. Au lieu de lire le code de haut en bas de manière procédurale, les programmes asynchrones peuvent exécuter différentes fonctions à différents moments. Cet ordre sera définit en fonction de l'ordre et de la vitesse des précédents appels, comme les requetes HTTP ou bien encore la lecture du file system.

Cette différence peut entrainer des confusions, car déterminer si une fonction est asynchrone our non dépend beaucoup de son contexte. Voici un exemple synchrone, ce qui signifie que que vous pouvez lire ce code de haut en bas comme un livre:

```js
var myNumber = 1
function addOne() { myNumber++ } // define the function
addOne() // run the function
console.log(myNumber) // logs out 2
```

Ce code définit une fonction, puis appel cette fonction, sans attendre quoi que ce soit. Quand la fonction est appelé, elle ajoute immédiatement 1 aux nombre. On peut donc s'attendre à ce qu'après l'appel de cette fonction, le nombre soit égal à 2. De manière assez basique donc, le code synchrone s'exécute de haut en bas.

Node en revanche, utilise essentiellement du code asynchrone. Utilisons Node pour lire notre nombre depuis un fichier appelé `number.txt`:

```js
var fs = require('fs') // require is a special function provided by node
var myNumber = undefined // we don't know what the number is yet since it is stored in a file

function addOne() {
  fs.readFile('number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // logs out undefined -- this line gets run before readFile is done
```

Pourquoi obtenons nous `undefined` quand nous affichons le chiffre cette fois ci ? Dans ce code, nous utilisons la méthode`fs.readFile`, qui est une méthode asynchrone. Tout ce qui doit parler à un disque dur ou à un réseau aura tendance à être asynchrone. Si leur objectif est simplement d'accéder à la mémoire, ou travailler avec le processeur, alors ils seront synchrone. La raison est que l'I/O est effroyablement lent! En guise d'illustration, dites vous que parler avec un disque dur est environ 100,000 fois plus lent qu'une communication avec la mémoire(e.g. RAM).

Quand nous lançons ce programme, toutes ses fonctions sont immédiatement définies, mais elles n'ont pas besoin de s'exécuter immédiatement. C'est un élément fondamental à comprendre en programmation asynchrone. Quand `addOne` est appelé, il démarre `readFile` et enchaine avec le prochain élément prêt à être exécuté. S'il n'y a rien dans la file d'attente, Node attendra les opérations fs/réseau en attente pour terminer, ou il s'arrêtera simplement de tourner et sortira sur la ligne de commande.

Quand `readFile` aura terminé de lire le fichier (cela peut prendre entre quelques millisecondes et plusieurs minutes, en fonction de la vitesse du disque dur) il lancera la fonction `doneReading`, puis lui donnera une erreur (s'il y en a une) ainsi que le contenu du fichier.

La raison pour laquelle nous obtenons `undefined` ci-dessus est qu'il n'existe aucune logique dans notre code pour dire à notre `console.log` d'attendre que le `readFile` ait terminé avant de sortir notre chiffre.

Si vous avez du code que vous voulez pouvoir exécuter encore et encore, ou simplement plus tard, la première étape consiste à encapsuler ce code dans une fonction. Ensuite, vous pouvez indiquer à votre fonction le moment où elle devra l'exécuter. Bien évidemment, donner des noms descriptifs et verbeux à vos fonction aidera grandement.

Les Callbacks ne sont que des fonctions qui s'exécutent plus tard. La clef pour comprendre les callbacks est de réaliser que vous ne savez pas **quand** une opération asynchrone sera terminée, mais vous savez **où** cette opération doit se compléter - la dernière ligne de votre fonction asynchrone ! L'ordre haut-en-bas de déclaration de vos callbacks n'a pas d'importance, seul l'encapsulation logique compte. Commencez par découper votre code en fonction, puis utilisez vos callbacks pour déclarer qu'une fonction requiert qu'une autre se termine.

La méthode `fs.readFile` fournie par node est asynchrone et il se trouve qu'elle prend beaucoup de temps pour se terminer. Mettez-vous à sa place: elle doit aller interroger l'OS, qui à son tour doit se renseigner auprès du file système, qui vit sur le disque dur, qui peut ne pas en trainer de tourner à des miliers de tours par minute. Ensuite il doit utiliser un laser pour lire une donnée, puis la renvoyer à travers toutes les strates successives de votre programme JavaScript. Vous donnez donc à `readFile` une fonction (aussi appelé callback) qu'il appellera une fois qu'il aura récupéré les données de votre file system. Il placera les données qu'il a récupéré dans une variable JavaScript et appellera votre callback avec cette variable. Dans ce cas, la variable est nommé `fileContents` car elle détient le contenu du fichier qui a été lu.

Reprenez l'exemple du restaurant cité au début de ce tuto. Très souvent, vous trouverez dans les restaurant des numéros à poser sur votre table pendant que vous patientez. Ces numéros sont comme des callbacks. Ils indiquent au serveur ce qu'ils doivent faire une fois que votre sandwich est prêt.

Plaçons maintenant notre `console.log` dans une fonction et passons le en callback.

```js
var fs = require('fs')
var myNumber = undefined

function addOne(callback) {
  fs.readFile('number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
    callback()
  })
}

function logMyNumber() {
  console.log(myNumber)
}

addOne(logMyNumber)
```

La fonction `logMyNumber` peut désormais être passée en argument qui deviendra la variable de `callback` dans la fonction `addOne`. Une fois que `readFile` en a terminé, la variable `callback` sera invoquée (`callback()`). Seules les fonctions peuvent être invoquées, donc si vous passez n'importe quoi d'autre qu'une fonction, il en résultera une erreur.

Quand une fonction est invoquée en JavaScript, le code qu'elle renferme est immédiatement exécuté. Dans notre cas, notre console log s'exécutera puisque `callback` est `logMyNumber`. Rappelez-vous, le simple fait de *define* une fonction ne signifie pas qu'elle s'exécutera. Pour ce faire, vous devez *invoke* une fonction.

Pour aller encore plus loin avec cet exemple, voici une liste chronique des évènements qui se produisent à l'éxécution de ce code:

- 1: Le code est parsé, ce qui signifique qu'une quelconque erreur syntaxique casserait le programme. Durant cette phase initiale, il y a 4 choses qui sont définies: `fs`, `myNumber`, `addOne`, and `logMyNumber`. Notez qu'elles sont simplement définies. Aucune fonction n'a encore été invoquée ou appelée pour le moment.
- 2: Quand la dernière ligne de notre programme est exécutée `addOne` est invoqué, puis est passé dans la fonction `logMyNumber` comme 'callback', ce qui est bien ce que nous demandons quand `addOne` est terminé. Cela entraine immédiatement le démarrage de la fonction asynchrone `fs.readFile`. Cette partie du programme prend un peu de temps à se terminer.
- 3: Puisqu'il n'a rien à faire, Node patiente pendant que `readFile` se termine. S'il y avait une quelconque autre tache à réaliser, Node serait disponible pour faire le boulot.
- 4: `readFile` se termine et appelle son callback, `doneReading`, qui à son tour incrémente le nombre et invoque immédiatement la fonction qu'`addOne` a passé, `logMyNumber` (son callback).

La chose la plus troublante quand on programme avec des callbacks est probablement le fait que les fonctions sont de simples objets, encapsulables dans des variables et que l'on peut passer n'importe où avec des noms différents. Affecter des noms simples et descriptifs à vos variables est primordiale pour rendre votre code lisible pour les autres comme pour vous-même. D'une manière générale, si vous voyez une variable comme `callback` ou `cb` vous pouvez partir du principe qu'il s'agit d'une fonction.

Vous avez peut-être entendu les termes de 'evented programming' (programmation évènementielle) ou 'event loop' (boucle d'évènement). Ils se réfèrent à la manière dont `readFile` est implémenté. Node dispatch d'abord les opérations `readFile` puis attends que `readFile` envoi un évènement qu'il a clôturé.
Pendant qu'il patiente, Node peut tranquillement s'affairer ailleurs. Pour s'y retrouver, Node maintient une liste de tâches qui ont été dispatchées mais qui n'ont pas encore reçu de feedback, et boucle dessus indéfiniment jusqu'à ce que l'une d'entre elle soit terminée. Une fois chose faite, Node invoque les éventuels callbacks qui lui sont rattachés.

Voila une version de l'exemple précédent en pseudocode:

```js
function addOne(thenRunThisFunction) {
  waitAMinute(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

Imaginez que vous avez 3 fonctions asynchrones `a`, `b` et `c`. Chacune d'entre elle prend environ 1 minute a être complétée puis lance un callback (qui se voit passé en premier argument). Si vous vouliez dire à node 'lance a, puis b une fois que a est terminé, puis c une fois que b est terminé', cela ressemblerait à cela :

```js
a(function() {
  b(function() {
    c()
  })
})
```
Quand ce code est exécuté, `a` démarrera immédiatement, puis une minute plus tard il appellera `b`, qui une minute plus tard lancera `c`. Au bout de 3 minutes, node s'arrêtera puisqu'il n'y aura plus rien à faire. Bien évidemment, il existe des méthodes plus élégantes pour écrire le code ci-dessus, mais le but est de montrer que si vous avez du code qui doit attendre un autre code asynchrone pour s'exécuter, alors il faut exprimer cette dépendance en disposant votre code dans une fonction qui sera alors passé comme callback.

Le design de node requière un mode de pensé non-linéaire. Considérez donc cette liste d'opérations:

```
read a file
process that file
```

Si vous transformiez cela en pseudocode vous obtiendriez ceci:

```
var file = readFile()
processFile(file)
```

Ce type de code non-linéaire (étape par étape, dans l'ordre) n'est pas la manière dont Node fonctionne. Si ce code devait être exécuté, alors `readFile` et `processFile` devraient être lancés au même moment. Cela n'aurait aucun sens puisque `readFile` mettra du temps à se terminer. A la place, vous devez signifier que `processFile` dépend de `readFile`. C'est exactement à cela que servent les callbacks ! Et parce que javascript fonctionne ainsi, vous pourrez écrire cette dépendance de plusieurs manières:

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}
```

Mais vous pourriez aussi structurer votre code de cette façon et il fonctionnerait toujours:

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}

fs.readFile('movie.mp4', finishedReading)
```

Ou même comme ceci:

```js
var fs = require('fs')

fs.readFile('movie.mp4', function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
})
```

## Evenements
Dans le cas où vous auriez besoin du module d'[evenements](http://nodejs.org/api/events.html), node vous propose 'event emitter', un module utilisé nativement par Node pour l'ensemble des ses API crée.

L'utilisation d'évènements est chose très commune en programmation, plus connu en tant que patron de conception ['Observation'](https://fr.wikipedia.org/wiki/Observateur_(patron_de_conception)) ou encore 'Observateur/Observable'. Tandis que les callbacks sont des relation one-to-one entre la chose qui attend le callback et celle qui appelle ce callback, les évènements répondent au même schema, a l'exception de leur système relationnel many-to-many.

La manière la plus simple d'imaginer les évènements est de considérer le fait qu'ils vous permettent de vous abonner à quelque chose. Vous pouvez dire : 'Quand X, fait Y', alors qu'un callback fonctionnera en 'Fait X puis Y'.

Ci-après une liste de cas d'utilisation où l'on privilégiera les évènements sur l'utilisation de callbacks:

- Canaux de discussion pour envoyer un message à un grand nombre d'observateurs
- Serveurs de jeux qui nécessitent de savoir quand de nouveaux joueurs se connectent, déconnectent, se déplacent, sautent ou tirent
- Moteur de jeu où vous voulez permettre aux développeurs de souscrire à des évènements comme `.on('jump', function() {})`
- Server web bas niveau où l'on veut exposer une API pour facilement accrocher des evenements comme `.on('incomingRequest')` or `.on('serverError')`

Si nous voulions écrire un module qui se connecte à un serveur de chat en utilisant uniquement des callbacks, cela ressemblerait à cela :

```js
var chatClient = require('my-chat-client')

function onConnect() {
  // have the UI show we are connected
}

function onConnectionError(error) {
  // show error to the user
}

function onDisconnect() {
 // tell user that they have been disconnected
}

function onMessage(message) {
 // show the chat room message in the UI
}

chatClient.connect(
  'http://mychatserver.com',
  onConnect,
  onConnectionError,
  onDisconnect,
  onMessage
)
```

Comme vous pouvez le constater, cette méthode est particulièrement lourde, car il faut passer toutes les fonctions dans un ordre spécifique à la fonction `.connect`.
Avec une écriture évènementielle, nous obtiendriont ceci:

```js
var chatClient = require('my-chat-client').connect()

chatClient.on('connect', function() {
  // have the UI show we are connected
})

chatClient.on('connectionError', function() {
  // show error to the user
})

chatClient.on('disconnect', function() {
  // tell user that they have been disconnected
})

chatClient.on('message', function() {
  // show the chat room message in the UI
})
```

L'approche est similaire à la version en Callbacks, mais introduit les méthodes `.on`, qui rattachent des callbacks à un évènement. Ce qui signifie que vous pouvez choisir à quel évènement vous voulez souscrire depuis le `chatClient`. Vous pouvez aussi écouter le même évènement à de multiple reprises avec différents callbacks :

```js
var chatClient = require('my-chat-client').connect()
chatClient.on('message', logMessage)
chatClient.on('message', storeMessage)

function logMessage(message) {
  console.log(message)
}

function storeMessage(message) {
  myDatabase.save(message)
}
```

## Flux

Plus tôt dans le projet node, le file system et les APIs de réseaux avaient leurs schemas de fonctionnement séparés pour gérer les flux d'I/O. Par exemple, les fichiers du file system avaient des 'file descriptors', le module `fs` nécessitaient de la logique supplémentaire pour garder des traces de toutes ces choses, tandis que les modules de réseau ignoraient ces concepts. En dépit de différences sémantiques mineurs comme celles ci, au niveau fondamental, les deux groupes de code duplicaient beaucoup de fonctionnalités quand il s'agissait de lire les données en entrée et en sortir. Les équipes développant node on réalisé qu'il serait confus d'avoir à apprendre deux groupes sémantiques pour faire relativement la même chose, ils ont alors créée une nouvelle API nommé `Stream` à la fois pour le File system et pour le réseau.

Tout l'intéret de node réside dans sa capacité à faciliter l'interaction avec les file system et les réseaux, il était donc sensé d'avoir un seul schema de fonctionnement valable pour toutes les situations. La bonne nouvelle est que la plus part des cas d'utilisation (et il sont peu nombreux quoi qu'il en soit) on été couvert par node, et il est fort peu probable que node évolue de ce côté à l'avenir.

Il y a deux ressources formidables dont vous pouvez commencer à apprendre l'utilisation des flux node. La première est stream-adventure (cf. Apprentissage de Node Interactif), et la seconde s'appelle Stream Handbook.

### Stream Handbook

[stream-handbook](https://github.com/substack/stream-handbook#introduction) est un guide, similaire à celui ci, qui contient des références sur absolument tout ce que vous pouvez avoir besoin de savoir sur les flux.

[![stream-handbook](stream-handbook.png)](https://github.com/substack/stream-handbook)

## Modules

Le Coeur de Node est composé d'une douzaine de modules. Certains bas niveau comme `events` ou `flux`, d'autres plus haut niveau comme `http` et `crypto`.

Ce design est intentionnel. Node core est supposé être léger, et les modules core doivent être réservés à fournir les outils nécessaires au traitement usuel des protocols I/O, de manière cross-platform.

Pour tout le reste, il a [npm](https://npmjs.org/). Tout le monde peut y créer de nouveaux modules qui ajoutront quelqueonque fonctionnalité et la publier sur npm. Au moment ou je vous écris ces lignes, il y a 34,000 modules sur npm.

### Comment trouver un module ?

Imaginez que vous souhaitez convertir un fichier PDF en TXT. Le meilleur moyen est de commencer par chercher `npm search pdf`:

![pdfsearch](npm-search.png)

Et il y a des tonnes de résultats! npm est relativement populaire, et vous trouverez généralement de multiples solutions potentielles pour vos besoins. Si vous filtrez suffisamment bien vos résultats vous devriez vous retrouver avec ceci :

- [hummus](https://github.com/galkahana/HummusJS/wiki/Features) - c++ pdf manipulator
- [mimeograph](https://github.com/steelThread/mimeograph) - api on a conglomeration of tools (poppler, tesseract, imagemagick etc)
- [pdftotextjs](https://npmjs.org/package/pdftotextjs) - wrapper around [pdftotext](https://en.wikipedia.org/wiki/Pdftotext)
- [pdf-text-extract](https://npmjs.org/package/pdf-text-extract) - another wrapper around pdftotext
- [pdf-extract](https://npmjs.org/package/pdf-extract) - wrapper around pdftotext, pdftk, tesseract, ghostscript
- [pdfutils](https://npmjs.org/package/pdfutils) - poppler wrapper
- [scissors](https://npmjs.org/package/scissors) - pdftk, ghostscript wrapper w/ high level api
- [textract](https://npmjs.org/package/textract) - pdftotext wrapper
- [pdfiijs](https://github.com/fagbokforlaget/pdfiijs) - pdf to inverted index using textiijs and poppler
- [pdf2json](https://github.com/modesty/pdf2json/blob/master/readme.md) - pure js pdf to json

Beaucoup de ces modules ont des fonctionnalités similaires, mais présentent des APIs alternatives. Ils requièrent aussi très souvent des dépendances externes comme (`apt-get install poppler`).

Voici une approche pour interpréter ces différents modules:

- `pdf2json` est le seul rédigé en pure JavaScript, ce qui signifie qu'il est aussi le plus simple à installer, notamment sur des petites configurations comme un raspberry pi ou un Windows ou le code natif n'est pas nécessairement cross platform.
- Les modules comme `mimeograph`, `hummus` et `pdf-extract` combinent chacuns de multiples modules bas niveau pour exposer une API haut niveau.
- Beaucoup de ces modules semblent reposer sur les outils de commande unix `pdftotext`/`poppler`.

Comparons les différences entre `pdftotextjs` et `pdf-text-extract`, tous deux étant fondées sur l'utilitaire `pdftotext`.

![pdf-modules](pdf-modules.png)

Tout deux possèdent :

- Des updates récentes
- Des liens vers vos repos Github (indispensable!)
- READMEs
- Une bonne popularité
- Sont sous license libre (tout le monde peut les utiliser librement)


En ne regardant que le `package.json` et les statistiques du module, il est difficile de se faire une bonne idée du meilleur choix possible. Comparons les READMEs:

![pdf-readmes](pdf-readmes.png)

Les deux possèdent des descriptions simples, des instructions d'installation, des badges CI, des exemples clairs pour lancer les tests. Fantastique! Mais lequel devons nous utiliser ? Comparons le code:

![pdf-code](pdf-code.png)

`pdftotextjs` contient environs 110 lignes de code, contre 40 pour `pdf-text-extract`, mais les deux peuvent essentiellement se réduire à cette ligne :

```
var child = shell.exec('pdftotext ' + self.options.additional.join(' '));
```

Est-ce que cela en fait un meilleur que l'autre ? Difficile à dire! Il est indispensable de *lire* le code pour vous faire vos propres conclusions. Si vous trouver un module qui vous plait, lancez `npm star modulename` pour donner votre feedback à npm sur un module qui vous a procuré une experience positive.

### Workflow de développement modulaire

npm diffère de la plupart des gestionnaires de packages par sa capacité à installer des modules des répertoires contenus à l'interieur de modules déja existants. Mêmes si vous n'y voyez pas encore d'intérêt, c'est là la clef du succes d'npm.

Beaucoup de gestionnaires de packages installent les choses de manière globale. Par exemple, si vous lancez `apt-get install couchdb` sur Debian Linux, il essayera d'installer la dernière version stable de CouchDB. Si vous essayez d'installer CouchDB en tant que dépendance d'un autre logiciel, et que ce logiciel nécessite une version anterieure de CouchDB, vous devrez désinstaller la version la plus récente de CouchDB puis installer la version historique. Vous ne pouvez donc pas avoir deux versions de CouchDB qui coexistent en parralèle car Debian ne sait installer les modules à qu'un endroit.

Et il n'y a pas que Debian qui fait cela. La plus part des gestionnaires de packages des langages de programmation fonctionnent ainsi. Pour solutionner ce problème, des environnements virtuels ont été développés comme [virtualenv](http://python-guide.readthedocs.org/en/latest/dev/virtualenvs/) pour Python ou [bundler](http://bundler.io/) pour Ruby. Ceux-ci découpent votre environnement en plusieurs environnements virtuels, un pour chaque projet. Toutefois, à l'interieur de chacun de ces environnnements, tout reste installé de manière globale. Les enviornnements virtuels n'adressent donc pas une réponse satisfaisante à notre problème et augmentent qui plus est le niveau de complexité de notre installation.

Avec npm, l'installation de modules globaux est contre-nature. De la même manière que vous ne devriez pas utilser de variables globales dans vos programmes JavaScript vous ne devriez pas installer de modules globaux (à moins que vous ayez besoin d'un module avec un executable binaire dans votre `PATH` globale, ce qui est loin d'être systématiquement le cas - nous en reparlerons).

#### Comment fonctionne `require`

Quand vous faites appel à `require('some_module')` voila ce qui se passe dans node:

1. Si un fichier qui s'appelle `some_module.js` existe dans le dossier courant, node le lancera. Autrement:
2. Node recherchera un dossier nommé `node_modules` dans le repertoire en cours, contenant un fichier `some_module` à l'interieur.
3. Si il ne trouve toujours pas, il montera d'un niveau et répètera l'opération 2.

Ce cycle se répètera jusqu'à ce que node atteignent le dossier root du filesystem. A ce moment, il continuera sa recherche dans les repertoires de modules globaux (comme `/usr/local/node_modules` sur Mac OS). Enfin, s'il ne trouve toujours rien, il enverra une erreur.

Pour illustrer ceci, voila un exemple:

![mod-diagram-01](mod-diagram-01.png)

Quand le dossier de travail en cour est `subsubfolder` et que `require('foo')` est appelé, node va chercher un dossier `subsubsubfolder/node_modules`. Dans le cas présent, sa recherche sera infructeuse, et le répertoire y est nommé par erreur `my_modules`. Node va donc remonter d'un répertoire et recommencer son opération, ce qui signifie qu'il cherchera alors `subfolder_B/node_modules` qui n'existera toujours pas. Enfin, la troisième tentative passera puisque `folder/node_modules` existe bel et bien *et* possède un répertoire nommé `foo` en son sein. Si `foo` n'y était pas, node aurait continué sa recherche jusqu'aux répertoire globaux.

Notez que s'il est appelé depuis `subfolder_B`, node ne trouvera jamais `subfolder_A/node_modules`, car il ne peut voir `folder/node_modules` que dans sa phase de remontée de l'arborescence.

Un des atouts de l'approche d'npm est que les modules peuvent installer leurs dépendances à des endroits spécifiques à leur version. Dans ce cas, le module `foo` est plutot populaire - il y en a trois copies, chacune à l'interieur de son dossier parent. Une explication pourrait être que chaque module parent requiert une version différente de `foo`, par exemple 'folder' qui requiert `foo@0.0.1`, `subfolder_A` de `foo@0.2.1` etc.

Maintenant, voila ce qui se produit si nous corrigeons notre problème de nom en remplaçant `my_modules` par son nom valide `node_modules`:

![mod-diagram-02](mod-diagram-02.png)

Pour tester quel module est véritablement chargé par node, vous pouvez utiliser `require.resolve('some_module')` qui vous montrera la path du module que node trouve dans sa remontée de l'arborescence. `require.resolve` est particulièrement utile pour double-checker que le module que vous *pensez* être chargé l'est *véritablement* -- parfois il y aura une autre version du même module qui sera plus proche de votre repertoire de travail actuel.

### Comment écrire un module

Maintenant que vous savez trouver un module et le `require`, vous pouvez écrire vos propres modules.

#### Le module le plus simple du monde

La légèreté des modules de Node est radicale. En voici l'un des plus simple possible :

`package.json`:
```js
{
  "name": "number-one",
  "version": "1.0.0"
}
```

`index.js`:
```js
module.exports = 1
```

Par défaut, node essaie de lancer `module/index.js` quand il lit `require('module')`. Aucun autre nom de fichier ne fonctionnera à moins que vous definissiez specifiez au champ `main` de `package.json` de pointer dessus.

Placez les deux fichiers dans un dossier nommé `number-one` (l'`id` dans package.json doit matcher un nom de dossier) et vous aurez un module node fonctionnel.

En appelant la fonction `require('number-one')` vous retournez la valeur qui est 'set' dans `module.exports`

![simple-module](simple-module.png)

Un moyen encore plus rapide de créer un module serait de lancer les commandes shell suivantes :

```sh
mkdir my_module
cd my_module
git init
git remote add git@github.com:yourusername/my_module.git
npm init
```

La commande `npm init` créera automatiquement un `package.json` valide pour vous. Si vous lancer un repo `git` existant, il définiera tout aussi automatiquement `package.json` à l'interieur.

#### Ajout de dépendances

Un module peut lister n'importe quel autre module depuis npm our GitHub dans le champ `dépendances` de `package.json`. Pour installer un module `request` en tant que nouvelle  dépendance et l'ajouter automatiquement au `package.json`, vous pouvez lancer ceci depuis votre répertoire root :

```sh
npm install --save request
```

Cela installera une copie de `request` dans le `node_modules` le plus proche et notre `package.json` ressemblera ainsi à cela:

```
{
  "id": "number-one",
  "version": "1.0.0",
  "dependencies": {
    "request": "~2.22.0"
  }
}
```

Par défaut `npm install` récupèrera la dernière version publiée du module.

## Developpez cote client avec npm
npm est victime d'un vice de pensé assez fréquent. `Node` faisant parti de son nom, il est courant de penser qu'il ne gère que des modules JS côté serveur, ce qui est absolument faux! npm signifie Node Packaged Module, c'est-à-dire des module que Node package pour vous. Ces modules peuvent être n'importe quoi - Ce ne sont que des repertoires ou des fichiers encapsulés dans des .tar.gz et un fichié nommé `package.json` qui explicite la version du module ainsi que la liste de toutes ses dépendances (ainsi que leur propre version de module pour que seules les versions connues pour fonctionner avec notre module ne soient installées automatiquement). Les dépendances ne sont que des modules, qui peuvent eux mêmes avoir des dépendances, et ainsi de suite.

[browserify](http://browserify.org/) est un utilitaire écrit en node qui tente de traduire n'importe quel module node en code lisible par un browser. Bien que *beaucoup de modules soient compatibles*, tous ne le sont pas (Les browsers ne peuvent par exemple pas heberger un serveur HTTP).

Pour essayer npm en browser, vous pouvez utiliser [RequireBin](http://requirebin.com/), qui est une application que j'ai réalisé qui tire profit de [Browserify-CDN](https://github.com/jesusabdullah/browserify-cdn). Elle utilise browserify en interne et renvoi l'output à travers HTTP (en lieu et place de la ligne de commande communément utilisé par browserify.)

Essayez maintenant de mettre ce code dans RequireBin et lancez le boutton de preview:

```js
var reverse = require('ascii-art-reverse')

// makes a visible HTML console
require('console-log').show(true)

var coolbear =
  "    ('-^-/')  \n" +
  "    `o__o' ]  \n" +
  "    (_Y_) _/  \n" +
  "  _..`--'-.`, \n" +
  " (__)_,--(__) \n" +
  "     7:   ; 1 \n" +
  "   _/,`-.-' : \n" +
  "  (_,)-~~(_,) \n"

setInterval(function() { console.log(coolbear) }, 1000)

setTimeout(function() {
  setInterval(function() { console.log(reverse(coolbear)) }, 1000)
}, 500)
```

Ou testez [un exemple plus complexe](http://requirebin.com/?gist=6031068) (Vous êtes libre de changer le code pour voir ce qu'il se produit):
[![requirebin](requirebin.png)](http://requirebin.com/embed?gist=6031068)

## Suivez le mouvement

Comme tous les bons outils, node est particulièrement adapté à certains cas d'utilisation. Par exemple: Rails, le framework web populaire, est fantastique pour modeliser de la [logique métier complexe](http://en.wikipedia.org/wiki/Business_logic), c'est-à-dire utiliser le code pour représenter des objets métiers comme des comptes clients, des prêts, des itinéraires, ou encore des stocks. Tandis qu'il est techniquement possible de faire la même chose avec Node, nous rencontrerions quelques désagréments car Node n'a pas été conçu pour résoudre ce type de problématiques. Retenez que chaque outil se concentre sur des problèmes différents! Fort heureusement, ce guide vous aidera à comprendre les forces de node afin que vous sachiez intuitivement à quel moment y avoir recours.

### Quelles sont les limites du scope de node ?

Node n'est fondamentalement conçu que pour gérer les I/O à travers le file system et les réseaux, et laisse les fonctionnalités plus fantaisistes aux modules tiers. Voici quelques exemples de choses qui dépassent le perimètre d'action de node:

#### Frameworks Web

Il existe des frameworks web basés sur node (framework signifiant un agglomérat de solutions qui cherchent à solutionner des problèmes au niveau comme de la logique métier), mais node n'est pas un framework à lui seul. Les frameworks web conçu par dessus node ne prennent pas les mêmes décisions concernant l'ajout de complexité, d'abstraction ou de compromis que node, et ont souvent d'autres priorités que les simples problématiques d'I/O.

#### Syntaxe du langage

Node utilise JavaScript et adopte donc sa syntaxe. Felix Geisendörfer présente une synthèse plutôt bonne du 'style node' [here](https://github.com/felixge/node-style-guide).

#### Niveau d'abstraction du langage

Quand cela est possible, node utilisera le moyen le plus simple possible d'accomplir quelque chose. Plus fantaisiste sera votre JavaScript plus vous apportez de complexité. Programmer est difficile, particulièrement en JavaScript où vous avez 1000 manières différentes de solutionner un même problème ! C'est pourquoi node essaye toujours d'utiliser la solution la plus simple universelle. Si vous tentez de résoudre un problème qui appelle une solution complexe, et que vous n'êtes pas satisfait des solutions en pure JS que node implémente, vous êtes libre de les résoudre à l'interieur de votre module en utilisant le niveau d'abstraction que vous souhaitez.

Un exemple parfait pour cela est l'utilisation que node fait des callbacks. Plus tôt, node a fait l'experience d'une feature nommé 'promesses' qui ajoutaient un certain nombre de features pour rendre le code asynchrone plus linéaire. Les promesses furent retirées du coeur node pour plusieurs raisons :

- Elles sont plus complexes que les callbacks
- Elles peuvent être implémentées avec userland (distribué en module tiers via npm)

Considérez une des choses les plus universelles et basique proposée par node: lire un fichier. Quand vous lisez un fichier vous voulez être au courant de l'apparition d'une erreur, comme lorsque votre disque dur meurt au milieu d'une lecture. Si node possédait des promesses, tout le monde devrait produire un code comme ceci :

```js
fs.readFile('movie.mp4')
  .then(function(data) {
    // do stuff with data
  })
  .error(function(error) {
    // handle error
  })
```

Cela ajouterait de la complexité, et tout le monde ne souhaite pas cela. A la place de deux fonctions différentes, node n'appelle qu'une fonction de callback. Les règles sont les suivantes :

- Quand il n'y a pas d'erreur, passez null en premier argument.
- Quand il y a une erreur, passez la en premier argument.
- Le reste des arguments peut être utilisé pour ce que vous désirez (en général les données ou réponses de vos flux d'I/O, puisque vous utiliserez généralement node à cet fin).

En conséquence, voila le style node en callback:

```js
fs.readFile('movie.mp4', function(err, data) {
  // handle error, do stuff with data
})
```

#### Threads/fibers/non-event-based concurrency solutions

Note : Si vous ne savez pas ce que ces choses signifient, il sera probablement plus simple d'apprendre node, puisque désapprendre constitue tout autant de travail qu'apprendre.

Node utilise des threads internes pour accelérer les choses, mais ne les expose par à l'utilisateur. Si vous êtes un utilisateur technique et que vous demandez pourquoi node est conçu ainsi, alors vous devriez absolument lire [the design of libuv](http://nikhilm.github.com/uvbook/), la couche I/O en C++ sur laquelle node est fondé.

## License

![CCBY](CCBY.png)

Creative Commons Attribution License (do whatever, just attribute me)
http://creativecommons.org/licenses/by/2.0/

L'icone de dont provient de [Noun Project](http://thenounproject.com/term/donate/285/)
