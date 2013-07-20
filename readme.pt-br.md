# A arte do node
## Uma introdução ao Node.js

Este documento é destinado à leitores que sabem no mínimo algumas das coisas abaixo:

- Uma linguagem de script como JavaScript, Ruby, Python, Perl, etc. Se você ainda não é um programador então é provavelmente mais fácil começar a ler  [JavaScript for Cats](http://jsforcats.com/). :cat2:
- git e github. Estas são ferramentas de colaboração de código aberto que pessoas da comunidade node usam para compartilhar módulos. Você só precisa saber o básico. Aqui estão três ótimos tutoriais de introdução. [1](http://skli.se/2012/09/22/introduction-to-git/), [2](http://zachbruggeman.me/github-for-cats/), [3](http://opensourcerer.diy.org/) (inglês)

Este pequeno livro é um trabalho em progresso. Se você gosta deste livro considere **fazer uma doação** via [gittip](https://www.gittip.com/maxogden/) para que eu possa escrever muito mais.

[![donate](donate.png)](https://www.gittip.com/maxogden/)

## Tabela de Conteúdo

- [Entendendo node](#understanding-node)
- [Módulos do core](#core-modules)
- [Callbacks](#callbacks)
- [Eventos](#events) (Não traduzido ainda)
- [Streams](#streams) (Não traduzido ainda)
- [Módulos e npm](#modules) (Não traduzido ainda)
- [Desenvolvimento client-side com npm](#client-side-development-with-npm) (Não traduzido ainda) 
- [Going with the grain](#going-with-the-grain) (Não traduzido ainda)

## Entendendo node

Node.js é um projeto de código aberto feito para te ajudar a escrever programas JavaScript que se comunicam com a rede, sistemas de arquivo ou outros 
códigos I/O(Entrada/Saida, Leitura/Escrita). É isso! Node é apenas uma simples e estável plataforma I/O que encoraja a construção de módulos sobre
ela mesma.

Quais são os exemplos de I/O? Aqui está um diagrama de uma aplicação que foi feita com node que mostra algumas fontes I/O:

![server diagram](server-diagram.png)

Se você não entende todo os elementos do diagrama está tudo bem. O ponto é mostrar que um simples processo em node(o hexágono no meio) pode atuar como o agente entre todos os pontos finais de I/O(laranja e roxo representam I/O).

Normalmente construir este tipo de sistema apresentam alguns dos casos:

- Dificuldade para programar, mas robusto e com boa performance (Como escrever seus servidores web do zero em C)
- Facilidade para programar, mas não muito robusto/rápido (Como quando alguem tenta fazer upload de um arquivo de 5GB e seu servidor para)

O objetivo de node é prover um balanço entre estes dois: Relativamente fácil para entender e usar, e rápido o suficiente para a maioria dos casos.

Node não é nenhuma das coisas a seguir:

  - Um framework web (como Rails ou Django, embora possa ser usado para fazer tais coisas)
  - Uma linguagem de programação (Node usa JavaScript mas não é uma linguagem por si só)
  
Em vez disso, node é uma coisa no meio. node é:

  - Desenhado para ser simples e relativamente fácil de entender e usar
  - Útil para programas baseados no I/O que precisam ser rápidos e manusear várias conexões
  
Em um nível mais baixo, node pode ser descrito com uma ferramenta para escrever dois maiores tipos de programas: 

  - Programas de rede usando os protocolos da web: HTTP, TCP, UDP, DNS e SSL
  - Programas que lêem e escrevem dados em sistemas de arquivos e os processos/memoria local

O que é um "Programa baseado em I/O?" Aqui estão alguns usos comuns:

  - Bancos de dados (ex: MySQL, PostgreSQL, MongoDB, Redis, CouchDB)
  - APIs (ex: Twitter, Facebook, Apple Push Notifications)
  - Conexões HTTP/WebSocket (de usuários para um web app)
  - Arquivos (Editor de imagem, Editor de vídeo, Radio por Internet)

Node processa I/O de forma [asíncrona](http://en.wikipedia.org/wiki/Asynchronous_I/O)(ingles) que permite manejar várias coisas diferentes simultaneamente. Por exemplo, se você for a um fast food e pedir um cheesburger eles vão pegar seu pedido imediatamente e então fazer você esperar até que o cheesburger esteja pronto. Neste tempo eles podem pegar outros pedido e começar a fazer os cheesburgers para outras pessoas. Imagine que você tem que esperar na fila, bloqueando todas as outras pessoas na fila enquanto eles preparam o seu hamburger! Isto é chamado **I/O Bloqueador** porque todo o I/O (preparamento dos chessburgers) acontece uma vez por tempo. Node, por outro lado, é **Não-bloqueador**, o que significa que pode preparar vários chessburgers de uma vez.

Aqui estão algumas coisas divertidas feitas de forma fácil com node graças a sua natureza não-bloqueadora
  
  - Controlar [Quadcopters voadores](http://nodecopter.com)
  - Escrever bots para chat IRC
  - Criar [Robôs bípedes que andam](http://www.youtube.com/watch?v=jf-cEB3U2UQ)

## Módulos do core

Primeiro eu recomendo que você instale node.js no seu computador. A maneira mais fácil é visitando [nodejs.org](http://nodejs.org) e clicar em `install`

Node tem um pequeno grupo de módulos no seu core (geralmente chamado de 'node core') os quais são apresentados como uma API pública que tem como objetivo escrever programas com eles. Para trabalhar com sistema de arquivos temos o módulo `fs` e para redes existem os módulos `net` (TCP), `http`, `dgram` (UDP).

Em adição aos módulos `fs` e de rede existem outros módulos no node core. Existe um módulo para resolver consultas DNS asincronamente chamado `dns`, um módulo para pegar informações específicas do SO como o tmpdir chamado `os`, um módulo para alocação de pedaços binários de memória chamado `buffer`, alguns módulos para parsear urls e diretórios (`url`, `querystring`, `path`), etc. A maioria se não todos os módulos no node core estão ali para suportar os principais casos de uso do node: escrever rápidos programas que se comunicam com sistemas de arquivos ou redes.

Node maneja I/O com: callbacks, eventos, streams e módulos. Se você aprender como estas 4 coisas funcionam então você será capaz de ir dentro de qualquer módulo no node core e entender basicamente como interagir com eles.

## Callbacks

Este é o tópico mais importante para entender se você quiser entender como usar o node. Quase tudo em node usa callbacks. Eles não foram inventados pelo node, eles são apenas partes da linguagem JavaScript.

Callbacks são funções que são executadas asincronamente, ou um tempo depois. Ao invés do código ser lido de cima para baixo, programs asíncronos podem executar diferentes funções em tempos diferentes baseado na ordem e velocidade de funções declaradas antes como http requests ou leituras de sistemas de arquivo.

A diferença pode ser confusa já que uma função ser asíncrona ou não depende muito do contexto. Aqui está um simples exemplo síncrono, você lê de cima para baixo assim como um livro:

```js
var myNumber = 1
function addOne() { myNumber++ } // define a função
addOne() // roda a função
console.log(myNumber) // resultado: 2
```

Este código aqui define uma função e então na próxima linha chama a função, sem esperar por nada. Quando a função é chamada imediatamente adiciona 1 para a variável number, então podemos esperar que após a chamada da função number seja 2. Esta é a expectativa de uma código síncrono - De cima para baixo sequencialmente.

Node, entretanto, usa principalmente código asíncrono. Vamos usar node para ler nosso número de um arquivo chamado `number.txt`:

```js
var fs = require('fs') // require é uma função especial fornecido pelo node
var myNumber = undefined // nós ainda não sabemos o número já que ele está armazenado em um arquivo

function addOne() {
  fs.readFile('number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // resultado: Undefined, já que esta parte do código rodou mais rápido que a função
```

Porque nosso resultado foi `undefined` quando damos log no nosso número esta vez? Neste código nós usamos o método `fs.readFile`, que é um método asícrono. Normalmente coisas que tem que se comunicar com discos rígidos ou redes são asíncronos. Se eles tem que acessar coisas na memória ou fazer algum trabalho na CPU eles vão ser síncronos. A rasão para isso é que I/O é muitoooo muitoooo devagarrr. Se comunicar com um disco rígido é cerca de 100,000 vezes mais devagar do que se comunicar com a memória (ex: RAM).

Quando nós rodamos este programa todas as funções são automaticamente definidas, mas elas não são executadas imediatamente. Isto é uma coisa fundamental para entender sobre programas asíncronos. Quando `addOne` é chamado fora de `readFile` então executa a proxima coisa que está pronta para executar. Se não tem nada para executar node vai esperar as operações pendentes de fs/rede para terminar ou parar de rodar e sair da linha de comando.

Quando `readFile` está pronto para ler o arquivo (isto pode levar de milisegundos para segundos ou minutos dependendo de quão rápido o disco rígido é) ele vai rodar a função `doneReading` e mostrar um erro (se existir algum erro) e o conteúdo do arquivo.

A razão pelo resultado ser `undefined` é que em nenhum lugar do nosso código existe uma lógica que diga para `console.log` esperar até que `readFile` tenha terminado.

Se você tem algum código que tenha que ser executado várias vezes ou depois de um tempo o primeiro passo é colocar o código dentro de uma função. Depois você chama a função quando você quiser rodar aquele código. Dar nomes descritivos as suas funções ajuda.

Callbacks são apenas funções que são executados depois de um tempo. A chave para entender callbacks é perceber que eles são usados quando você não sabe **quando** algum código asíncrono vai terminar, mas você sabe **onde** a operação vai terminar - a última linha da função asíncrona! A ordem de cima à baixo que você declara callbacks não necessariamente importa, apenas a lógica hierárquica de assentamento do código. Primeiro você quebra seu código em funções, e depois usa callbacks para declarar se uma função depende do terminamento de outra função.

O método `fs.readFile` é fornecido pelo node, é asíncrono e leva um bom tempo para terminar. Considerando o que ele faz: Ele tem que ir ao Sistema Operacional, que por sua vez tem que ir ao sistema de arquivos, que está no disco rígido que pode ou não está rodando à milhares de vezes por minuto. Então ele tem que usar um laser para ler os dados e enviar de volta através das camadas para seu programa JavaScript. Você dá à `readFile` uma função (conhecida como callback) que vai ser chamado assim que receber os dados do sistema de arquivos. Ele bota os dados em uma variável e chama sua função (callback) com aquela variável, nesse caso a variável é chamada `fileContents` porque ela contém os dados do arquivo que foi lido.

Pense no exemplo do fast food no começo deste tutorial. Em muitos restaurantes você pega um número para colocar em sua mesa enquanto você espera sua comida. Isto usa vários callbacks. Eles vão falar ao servidor o que fazer depois que seu cheesburger fique pronto.

Vamos colocar nosso `console.log` em uma função e chamar ela como callback.

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

Agora a função `logMyNumber` pode ser passada no argumento que vai ser a variável `callback` dentro da função `addOne`. Depois que `readFile` terminar a variável `callback` vai ser invocada (`callback()`). Apenas funções podem ser invocadas, então se você passar alguma coisa que não é uma função vai causar um erro.

Quando a função é invocada no código JavaScript vai ser executada imediatamente. Nesse caso nosso log vai executar já que `callback` é a função `logMyNumber`. Lembre, *definir* uma função é diferente de executar. Você tem que *invocar* a função para isso acontecer.

Para quebrar o exemplo acima ainda mais, aqui esta a linha do tempo dos eventos que acontecem quando rodam este programa: 

- 1: O código é analisado, o que significa que se existir algum erro de sintaxe o programa vai quebrar. Durante esta fase inicial tem 4 coisas que são definidas: `fs`, `myNumber`, `addOne`, e `logMyNumber`. Note que eles estão sendo apenas definidos, nenhuma função foi chamada/invocada ainda.
- 2: Quando a última linha do nosso programa é executada `addOne` é invocado, onde `logMyNumber` é passado como `callback`, que é o que queremos que seja chamado quando `addOne` terminar. Isto imediatamente executa o código asíncrono `fs.readFile`. Esta parte do programa leva um tempo para terminar
- 3: Sem nada para fazer, node espera até que `readFile` termine. Se existisse alguma outra coisa durante esse tempo, node poderia fazer o trabalho.
- 4: `readFile` termina e chama o callback, `doneReading`, que incrementa o número e imediatamente invoca a função callback de `addOne`, `logMyNumber`.

Talvez a parte mais confusa de programar com callbacks é que funções são apenas objetos que podem ser armazenadas em variáveis e passadas no programa com diferentes nomes. Dando um simples e descritivo nome para suas variáveis é importante ao fazer seu código legível para outras pessoas. Geralmente falando em programas node quando você vê uma variável como `callback` ou `cb` você sabe que é uma função.

Você pode ter ouvido os termos 'programação com eventos' ou 'loop de eventos'. Eles se referem a maneira que `readFile` é implementado. Node primeiro roda a operação `readFile` e então espera por `readFile` para enviar um evento dizendo que está completo. Enquanto espera node pode checar outras coisas. Dentro do node esta uma lista de coisas que são executadas mas não reportaram de volta ainda, então node faz um loop na lista de novo e de novo checando para ver se eles terminaram. Depois que eles terminam eles são 'processados', Ex: Callbacks que dependem desse término vão ser invocados.

Aqui um pseudocódigo do exemplo acima.

```js
function addOne(thenRunThisFunction) {
  waitAMinute(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

Imagine que você tem 3 funções asíncronas `a`, `b` e `c`. Cada um leva um minuto para rodar e quando termina chama um callback (que é passado no primeiro argumento). Se você precisar que node 'primeiro rode a, depois rode b quando a terminar, e então rode c quando b terminar' iria parecer com isso:

```js
a(function() {
  b(function() {
    c()
  })
})
```

Quando este código é executado, `a` vai rodar automaticamente, então, um minuto depois ele vai terminar e chamar `b`, e um minuto depois ele vai terminar e chamar `c` e finalmente 3 minutos depois node vai parar o código já que não tem mais nada para fazer. Definitivamente, existem formas mais elegantes de escrever o código acima, mas o ponto é que se você tiver um código que tem que esperar outro código asíncrono terminar então você expressa esta dependência colocando este código em funções que são passadas como callbacks.

A forma como node trabalha requer que você pense de uma forma não-linear. Considerando esta lista de operações:

```
read a file
process that file
```

Se você precisar transformar em pseudocódigo ficaria assim:

```
var file = readFile()
processFile(file)
```

Este tipo de código linear (passo-a-passo, em ordem) não é a maneira que node trabalha. Se este código fosse executado então `readFile` e `processFile` iriam executar ao mesmo tempo. Isto não faz sentido já que `readFile` vai levar um tempo para completar. Ao invés disso você precisa expressar que `processFile` depende de `readFile`. Este é o trabalho dos callbacks! E por causa da maneira que JavaScript trabalha você pode escrever esta dependência de várias maneiras diferentes:

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // Faz alguma coisa com o filme
}
```

Mas você também pode estruturar seu código como esse que ainda vai funcionar:

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // Faz alguma coisa com o filme
}

fs.readFile('movie.mp4', finishedReading)
```

Or even like this:

```js
var fs = require('fs')

fs.readFile('movie.mp4', function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // Faz alguma coisa com o filme
})
```

## Events

In node if you require the [events](http://nodejs.org/api/events.html) module you can use the so-called 'event emitter' that node itself uses for all of its APIs that emit things.

Events are a common pattern in programming, known more widely as the ['observer pattern'](http://en.wikipedia.org/wiki/Observer_pattern) or 'pub/sub' (publish/subscribe). Whereas callbacks are a one-to-one relationship between the thing waiting for the callback and the thing calling the callback, events are the same exact pattern except with a many-to-many API.

The easiest way to think about events is that they let you subscribe to things. You can say 'when X do Y', whereas with plain callbacks it is 'do X then Y'.

Here are few common use cases for using events instead of plain callbacks:

- Chat room where you want to broadcast messages to many listeners
- Game server that needs to know when new players connect, disconnect, move, shoot and jump
- Game engine where you want to let game developers subscribe to events like `.on('jump', function() {})`
- A low level web server that wants to expose an API to easily hook into events that happen like `.on('incomingRequest')` or `.on('serverError')`

If we were trying to write a module that connects to a chat server using only callbacks it would look like this:

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

As you can see this is really cumbersome because of all of the functions that you have to pass in a specific order to the `.connect` function. Writing this with events would look like this:

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

This approach is similar to the pure-callback approach but introduces the `.on` method, which subscribes a callback to an event. This means you can choose which events you want to subscribe to from the `chatClient`. You can also subscribe to the same event multiple times with different callbacks:

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

## Streams

Early on in the node project the file system and network APIs had their own separate patterns for dealing with streaming I/O. For example, files in a file system have things called 'file descriptors' so the `fs` module had to have extra logic to keep track of these things whereas the network modules didn't have such a concept. Despite minor differences in semantics like these, at a fundamental level both groups of code were duplicating a lot of functionality when it came to reading data in and out. The team working on node realized that it would be confusing to have to learn two sets of semantics to essentially do the same thing so they made a new API called the `Stream` and made all the network and file system code use it. 

The whole point of node is to make it easy to deal with file systems and networks so it made sense to have one pattern that was used everywhere. The good news is that most of the patterns like these (there are only a few anyway) have been figured out at this point and it is very unlikely that node will change that much in the future.

There are already two great resources that you can use to learn about node streams:

### Stream Adventure

[stream-adventure](https://github.com/substack/stream-adventure) by @substack is an interactive command line stream tutorial. You can install it with npm:

```
# install
npm install stream-adventure -g

# start the adventure
stream-adventure
```

[![stream-adventure](stream-adventure.png)](https://github.com/substack/stream-adventure)

### Stream Handbook

[stream-handbook](https://github.com/substack/stream-handbook#introduction) is a guide, similar to this one, that contains a reference for everything you could possibly need to know about streams.

[![stream-handbook](stream-handbook.png)](https://github.com/substack/stream-handbook)

## Modules

Node core is made up of about two dozen modules, some lower level ones like `events` and `stream` some higher level ones like `http` and `crypto`.

This design is intentional. Node core is supposed to be small, and the modules in core should be focused on providing tools for working with common I/O protocols and formats in a way that is cross-platform.

For everything else there is [npm](https://npmjs.org/). Anyone can create a new node module that adds some functionality and publish it to npm. As of the time of this writing there are 34,000 modules on npm.

### How to find a module

Imagine you are trying to convert PDF files into TXT files. The best place to start is by doing `npm search pdf`:

![pdfsearch](npm-search.png)

There are a ton of results! npm is quite popular and you will usually be able to find multiple potential solutions. If you go through each module and whittle down the results into a more narrow set (filtering out things like PDF generation modules) you'll end up with these:

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

A lot of the modules have overlapping functionality but present alternate APIs and most of them require external dependencies (like `apt-get install poppler`).

Here are some different ways to interpret the modules:

- `pdf2json` is the only one that is written in pure JavaScript, which means it is the easiest to install, especially on low power devices like the raspberry pi or on Windows where native code might not be cross platform.
- modules like `mimeograph`, `hummus` and `pdf-extract` each combine multiple lower level modules to expose a high level API
- a lot of modules seem to sit on top of the `pdftotext`/`poppler` unix command line tools

Lets compare the differences between `pdftotextjs` and `pdf-text-extract`, both of which are are wrappers around the `pdftotext` utility.

![pdf-modules](pdf-modules.png)

Both of these:

- were updated relatively recently
- have github repositories linked (this is very important!)
- have READMEs
- have at least some number of people installing them every week
- are liberally licensed (anyone can use them)

Just looking at the `package.json` + module statistics it's hard to get a feeling about which one might be the right choice. Let's compare the READMEs:

![pdf-readmes](pdf-readmes.png)

Both have simple descriptions, CI badges, installation instructions, clear examples and instructions for running the tests. Great! But which one do we use? Let's compare the code:

![pdf-code](pdf-code.png)

`pdftotextjs` is around 110 lines of code, and `pdf-text-extract` is around 40, but both essentially boil down to this line:

```
var child = shell.exec('pdftotext ' + self.options.additional.join(' '));
```

Does this make one any better than the other? Hard to say! It's important to actually *read* the code and make your own conclusions. If you find a module you like, use `npm star modulename` to give npm feedback about modules that you had a positive experience with.

### Modular development workflow

npm is different from most package managers in that it installs modules into a folder inside of other existing modules. The previous sentence might not make sense right now but it is the key to npm's success.

Many package managers install things globally. For instance, if you `apt-get install couchdb` on Debian Linux it will try to install the latest stable version of CouchDB. If you are trying to install CouchDB as a dependency of some other piece of software and that software needs an older version of CouchDB, you have to uninstall the newer version of CouchDB and then install the older version. You can't have two versions of CouchDB installed because Debian only knows how to install things into one place.

It's not just Debian that does this. Most programming language package managers work this way too. To address the global dependencies problem described above there have been virtual environment developed like [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs.html) for Python or [bundler](http://bundler.io/) for Ruby. These just split your environment up in to many virtual environments, one for each project, but inside each environment dependencies are still globally installed. Virtual environments don't always solve the problem, sometimes they just multiply it by adding additional layers of complexity.

With npm installing global modules is an anti-pattern. Just like how you shouldn't use global variables in your JavaScript programs you also shouldn't install global modules (unless you need a module with an executable binary to show up in your global `PATH`, but you don't always need to do this -- more on this later).

#### How `require` works

When you call `require('some_module')` in node here is what happens:

1. if a file called `some_module.js` exists in the current folder node will load that, otherwise:
2. node looks in the current folder for a `node_modules` folder with a `some_module` folder in it
3. if it doesn't find it, it will go up one folder and repeat step 2

This cycle repeats until node reaches the root folder of the filesystem, at which point it will then check any global module folders (e.g. `/usr/local/node_modules` on Mac OS) and if it still doesn't find `some_module` it will throw an exception.

Here's a visual example:

![mod-diagram-01](mod-diagram-01.png)

When the current working directory is `subsubfolder` and `require('foo')` is called, node will look for the folder called `subsubsubfolder/node_modules`. In this case it won't find it -- the folder there is mistakenly called `my_modules`. Then node will go up one folder and try again, meaning it then looks for `subfolder_B/node_modules`, which also doesn't exist. Third try is a charm, though, as `folder/node_modules` does exist *and* has a folder called `foo` inside of it. If `foo` wasn't in there node would continue its search up the directory tree.

Note that if called from `subfolder_B` node will never find `subfolder_A/node_modules`, it can only see `folder/node_modules` on its way up the tree.

One of the benefits of npm's approach is that modules can install their dependent modules at specific known working versions. In this case the module `foo` is quite popular - there are three copies of it, each one inside its parent module folder. The reasoning for this could be that each parent module needed a different version of `foo`, e.g. 'folder' needs `foo@0.0.1`, `subfolder_A` needs `foo@0.2.1` etc.

Here's what happens when we fix the folder naming error by changing `my_modules` to the correct name `node_modules`:

![mod-diagram-02](mod-diagram-02.png)

To test out which module actually gets loaded by node, you can use the `require.resolve('some_module')` command, which will show you the path to the module that node finds as a result of the tree climbing process. `require.resolve` can be useful when double-checking that the module that you *think* is getting loaded is *actually* getting loaded -- sometimes there is another version of the same module closer to your current working directory than the one you intend to load.

### How to write a module

Now that you know how to find modules and require them you can start writing your own modules.

#### The simplest possible module

Node modules are radically lightweight. Here is one of the simplest possible node modules:

`package.json`:
```js
{
  "id": "number-one",
  "version": "1.0.0"
}
```

`index.js`:
```js
module.exports = 1
```

By default node tries to load `module/index.js` when you `require('module')`, any other file name won't work unless you set the `main` field of `package.json` to point to it.

Put both of those files in a folder called `number-one` (the `id` in `package.json` must match the folder name) and you'll have a working node module.

Calling the function `require('number-one')` returns the value of whatever `module.exports` is set to inside the module:

![simple-module](simple-module.png)

An even quicker way to create a module is to run these commands:

```sh
mkdir my_module
cd my_module
git init
git remote add git@github.com:yourusername/my_module.git
npm init
```

Running `npm init` will create a valid `package.json` for you and if you run it in an existing `git` repo it will set the `repositories` field inside `package.json` automatically as well!

#### Adding dependencies

A module can list any other modules from npm or GitHub in the `dependencies` field of `package.json`. To install the `request` module as a new dependency and automatically add it to `package.json` run this from your module root directory:

```sh
npm install --save request
```

This installs a copy of `request` into the closest `node_modules` folder and makes our `package.json` look something like this:

```
{
  "id": "number-one",
  "version": "1.0.0",
  "dependencies": {
    "request": "~2.22.0"
  }
}
```

By default `npm install` will grab the latest published version of a module.

## Client side development with npm

A common misconception about npm is that since it has 'Node' in the name that it must only be used for server side JS modules. This is completely untrue! npm actually stands for Node Packaged Modules, e.g. modules that Node packages together for you. The modules themselves can be whatever you want -- they are just a folder of files wrapped up in a .tar.gz, and a file called `package.json` that declares the module version and a list of all modules that are dependencies of the module (as well as their version numbers so the working versions get installed automatically). It's turtles all the way down - module dependencies are just modules, and those modules can have dependencies etc. etc. etc.

[browserify](http://browserify.org/) is a utility written in Node that tries to convert any node module into code that can be run in browsers. Not all modules work (browsers can't do things like host an HTTP server), but a lot of modules on NPM *will* work.

To try out npm in the browser you can use [RequireBin](http://requirebin.com/), an app I made that takes advantage of [Browserify-CDN](https://github.com/jesusabdullah/browserify-cdn), which internally uses browserify but returns the output through HTTP (instead of the command line -- which is how browserify is usually used).

Try putting this code into RequireBin and then hit the preview button:

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

Or check out a [more complicated example](http://requirebin.com/?gist=6031068) (feel free to change the code and see what happens):

[![requirebin](requirebin.png)](http://requirebin.com/embed?gist=6031068)

## Going with the grain

Like any good tool, node is best suited for a certain set of use cases. For example: Rails, the popular web framework, is great for modeling complex [business logic](http://en.wikipedia.org/wiki/Business_logic), e.g. using code to represent real life business objects like accounts, loan, itineraries, and inventories. While it is technically possible to do the same type of thing using node, there would be definite drawbacks since node is designed for solving I/O problems and it doesn't know much about 'business logic'. Each tool focuses on different problems. Hopefully this guide will help you gain an intuitive understanding of the strengths of node so that you know when it can be useful to you.

### What is outside of node's scope?

Fundamentally node is just a tool used for managing I/O across file systems and networks, and it leaves other more fancy functionality up to third party modules. Here are some things that are outside the scope of node:

#### Web frameworks

There are a number of web frameworks built on top of node (framework meaning a bundle of solutions that attempts to address some high level problem like modeling business logic), but node is not a web framework. Web frameworks that are written using node don't always make the same kind of decisions about adding complexity, abstractions and tradeoffs that node does and may have other priorities.

#### Language syntax

Node uses JavaScript and doesn't change anything about it. Felix Geisendörfer has a pretty good write-up of the 'node style' [here](https://github.com/felixge/node-style-guide).

#### Language abstraction

When possible node will use the simplest possible way of accomplishing something. The 'fancier' you make your JavaScript the more complexity and tradeoffs you introduce. Programming is hard, especially in JS where there are 1000 solutions to every problem! It is for this reason that node tries to always pick the simplest, most universal option. If you are solving a problem that calls for a complex solution and you are unsatisfied with the 'vanilla JS solutions' that node implements, you are free to solve it inside your app or module using whichever abstractions you prefer.

A great example of this is node's use of callbacks. Early on node experimented with a feature called 'promises' that added a number of features to make async code appear more linear. It was taken out of node core for a few reasons:

- they are more complex than callbacks
- they can be implemented in userland (distributed on npm as third party modules)

Consider one of the most universal and basic things that node does: reading a file. When you read a file you want to know when errors happen, like when your hard drive dies in the middle of your read. If node had promises everyone would have to branch their code like this:

```js
fs.readFile('movie.mp4')
  .then(function(data) {
    // do stuff with data
  })
  .error(function(error) {
    // handle error
  })
```

This adds complexity, and not everyone wants that. Instead of two separate functions node just uses a single callback function. Here are the rules:

- When there is no error pass null as the first argument
- When there is an error, pass it as the first argument
- The rest of the arguments can be used for anything (usually data or responses since most stuff in node is reading or writing things)

Hence, the node callback style:

```js
fs.readFile('movie.mp4', function(err, data) {
  // handle error, do stuff with data
})
```

#### Threads/fibers/non-event-based concurrency solutions

Note: If you don't know what these things mean then you will likely have an easier time learning node, since unlearning things is just as much work as learning things.

Node uses threads internally to make things fast but doesn't expose them to the user. If you are a technical user wondering why node is designed this way then you should 100% read about [the design of libuv](http://nikhilm.github.com/uvbook/), the C++ I/O layer that node is built on top of.

## License

![CCBY](CCBY.png)

Creative Commons Attribution License (do whatever, just attribute me)
http://creativecommons.org/licenses/by/2.0/

Donate icon is from the [http://thenounproject.com/noun/donate/#icon-No285](Noun Project)
