# A arte do Node

## Uma introdução ao Node.js

Este documento é destinado à leitores que sabem no mínimo algumas das coisas abaixo:

- Uma linguagem de script como JavaScript, Ruby, Python, Perl, etc. Se você ainda não é um programador então é, provavelmente, mais fácil começar a ler [JavaScript for Cats](http://jsforcats.com/). :cat2:
- Git e Github. Estas são ferramentas de colaboração de código aberto que pessoas da comunidade Node usam para compartilhar módulos. Você só precisa saber o básico. Aqui estão três ótimos tutoriais de introdução. [1](http://skli.se/2012/09/22/introduction-to-git/), [2](http://zachbruggeman.me/github-for-cats/), [3](http://opensourcerer.diy.org/) (em inglês).

Este pequeno livro é um trabalho em progresso. Se você gostar deste livro considere **fazer uma doação** via [gittip](https://www.gittip.com/maxogden/) para que eu possa escrever muito mais.

[![donate](donate.png)](https://www.gittip.com/maxogden/)

## Tabela de Conteúdo

- [Aprenda Node de forma interativa](#aprenda-node-de-forma-interativa)
- [Entendendo Node](#entendendo-node)
- [Módulos do núcleo](#módulos-do-núcleo)
- [Callbacks](#callbacks)
- [Eventos](#eventos)
- [Streams](#streams)
- [Módulos e NPM](#módulos-e-npm)
- [Desenvolvimento no lado do cliente com NPM](#desenvolvimento-no-lado-do-cliente-com-npm)
- [Evoluindo de forma correta](#evoluindo-de-forma-correta)

## Aprenda Node de forma interativa

Como complemento para a leitura deste guia, é super importante que você também inicie o seu editor de texto e comece desde já a escrever alguns códigos em Node. Eu sempre acho que quando acabo de ler algum código em um livro ele nunca realmente é executado, mas aprender a escrever códigos é uma boa maneira para compreender os novos conceitos de programação.

Aqui estão dois grandes tutoriais que você pode instalar no seu computador e permitirá a você aprender o Node de uma forma mais interativa:

### Learn You The Node.js

[Learn You The Node.js](https://github.com/rvagg/learnyounode#learn-you-the-nodejs-for-much-win) é um conjunto de problemas de programação que vai apresentá-lo aos padrões do Node mais comuns. Ele vem como um conjunto de tutoriais interativos de linha de comando.

[![learnyounode](https://github.com/rvagg/learnyounode/raw/master/learnyounode.png)](https://github.com/rvagg/learnyounode#learn-you-the-nodejs-for-much-win)

Você pode instalar com o npm:

```
# instalação
npm install learnyounode -g

# inicialização
learnyounode
```

### Stream Adventure

Depois que você finalizar o `learnyounode`, prossiga para o [stream-adventure](https://github.com/substack/stream-adventure) para um conjunto de exercícios a fim de se aprofundar mais ainda no Node.

```
# instalação
npm install stream-adventure -g

# inicialização
stream-adventure
```

[![stream-adventure](stream-adventure.png)](https://github.com/substack/stream-adventure)

## Entendendo Node

Node.js é um projeto de código aberto feito para te ajudar a escrever programas JavaScript que se comunicam com a rede, sistemas de arquivo ou outros códigos I/O (Entrada/Saida, Leitura/Escrita). Apenas isso! Node é apenas uma simples e estável plataforma I/O que encoraja a construção de módulos sobre ela mesma.

Quais são os exemplos de I/O? Aqui está um diagrama de uma aplicação que foi feita com Node que mostra algumas fontes I/O:

![server diagram](server-diagram.png)

Se você não entende todo os elementos do diagrama está tudo bem. O ponto é mostrar que um simples processo em Node (o hexágono no meio) pode atuar como um agente entre todos os pontos finais de I/O (laranja e roxo representam I/O).

Normalmente construir este tipo de sistema apresentam alguns dos casos:

- Dificuldade para programar, mas robusto e com boa performance (como escrever seus servidores web do zero em C)
- Facilidade para programar, mas não muito robusto/rápido (como quando alguem tenta fazer upload de um arquivo de 5GB e seu servidor trava)

O objetivo do Node é oferecer um balanço entre estes dois: relativamente fácil para entender e usar, e rápido o suficiente para a maioria dos casos.

Node não é nenhuma das coisas a seguir:

  - Um framework web (como Rails ou Django, embora possa ser usado para fazer tais coisas)
  - Uma linguagem de programação (Node usa JavaScript, mas não é uma linguagem por si só)

Em vez disso, Node é uma coisa no meio. Node é:

  - Desenhado para ser simples e relativamente fácil de entender e usar
  - Útil para programas baseados no I/O que precisam ser rápidos e/ou manusear várias conexões

Em um nível mais baixo, Node pode ser descrito como uma ferramenta para escrever dois maiores tipos de programas:

  - Programas de rede usando os protocolos da web: HTTP, TCP, UDP, DNS e SSL
  - Programas que lêem e escrevem dados em sistemas de arquivos e os processos/memória local

O que é um "Programa baseado em I/O"? Aqui estão alguns usos comuns:

  - Bancos de dados (ex: MySQL, PostgreSQL, MongoDB, Redis, CouchDB)
  - APIs (ex: Twitter, Facebook, Apple Push Notifications)
  - Conexões HTTP/WebSocket (usuários de um aplicativo web)
  - Arquivos (redimensionador de imagem, editor de vídeo, rádio via internet)

Node processa I/O de modo assíncrono([asynchronous](http://en.wikipedia.org/wiki/Asynchronous_I/O)) que permite manusear várias coisas diferentes simultaneamente. Por exemplo, se você for a um fast food e pedir um cheesburger eles vão pegar seu pedido imediatamente e então fazer você esperar até que o cheesburger esteja pronto. Neste tempo eles podem pegar outros pedidos e começar a fazer os cheesburgers para outras pessoas. Imagine que você tem que esperar na fila, bloqueando todas as outras pessoas na fila enquanto eles preparam o seu hamburger! Isto é chamado **I/O bloqueante** porque todo o I/O (preparamento dos chessburgers) acontece um de cada vez. Node, por outro lado, é **não-bloqueante**, o que significa que pode preparar vários chessburgers de uma só vez.

Aqui estão algumas coisas divertidas feitas de forma fácil com Node graças a sua natureza não-bloqueante:

  - Controlar [voos de quadricópteros](http://nodecopter.com)
  - Escrever bots para IRC
  - Criar [robôs bípedes que andam](http://www.youtube.com/watch?v=jf-cEB3U2UQ)

## Módulos do núcleo

Em primeiro lugar eu recomendo que você instale o Node no seu computador. A maneira mais fácil é visitando [Nodejs.org](http://nodejs.org) e clicar em `install`.

Node tem um pequeno grupo de módulos no seu núcleo (geralmente chamado de *node core*) os quais são apresentados como uma API pública que tem como objetivo escrever programas com eles. Para trabalhar com sistema de arquivos temos o módulo `fs` e para redes existem os módulos `net` (TCP), `http`, `dgram` (UDP).

Em adição aos módulos `fs` e de rede existem outros módulos no núcleo do Node. Existe um módulo para resolver consultas DNS de modo assíncrono chamado `dns`, um módulo para pegar informações específicas do sistema operacional como o *tmpdir* chamado `os`, um módulo para alocação de pedaços binários de memória chamado `buffer`, alguns módulos para parsear urls e caminhos (`url`, `querystring`, `path`), etc. A maioria, se não todos os módulos no núcleo do Node, estão ali para suportar os principais casos de uso do Node: escrever rápidos programas que se comunicam com sistemas de arquivos ou redes.

Node manipula I/O com: callbacks, eventos, streams e módulos. Se você aprender como estas quatro coisas funcionam, então você será capaz de ir dentro de qualquer módulo no núcleo do Node e entender basicamente como interagir com eles.

## Callbacks

Este é o tópico mais importante para entender se você quiser entender como usar o Node. Quase tudo em Node usa callbacks. Eles não foram inventados pelo Node, eles são apenas parte da linguagem JavaScript.

Callbacks são funções executadas de modo assíncrono, ou posteriormente. Ao invés do código ser lido de cima para baixo de forma procedural, programas assíncronos podem executar diferentes funções em diferentes momentos baseando-se na ordem e velocidade em que as funções declaradas anteriormente (como requisições HTTP ou leituras de sistemas de arquivo) forem acontecendo.

A diferença pode ser confusa uma vez que determinar se uma função será assíncrona ou não depende muito do contexto. Aqui está um simples exemplo síncrono, você lê de cima para baixo assim como um livro:

```js
var myNumber = 1
function addOne() { myNumber++ } // define a função
addOne() // roda a função
console.log(myNumber) // resultado: 2
```

Este código define uma função e então na próxima linha chama a função, sem esperar por nada. Quando a função é chamada imediatamente adiciona 1 para a variável number, então podemos esperar que após a chamada da função number seja 2. Esta é a expectativa de uma código síncrono - De cima para baixo sequencialmente.

Node, entretanto, usa principalmente código assíncrono. Vamos usar Node para ler nosso número de um arquivo chamado `number.txt`:

```js
var fs = require('fs') // require é uma função especial fornecida pelo Node
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

Porque nosso resultado foi `undefined` quando damos *log* no nosso número desta vez? Neste código nós usamos o método `fs.readFile`, que é um método assíncrono. Normalmente coisas que tem que se comunicar com discos rígidos ou redes são assíncronos. Se eles tem que acessar coisas na memória ou fazer algum trabalho na CPU eles serão síncronos. A razão para isso é que I/O é muitoooo muitoooo devagaaaar. Se comunicar com um disco rígido é cerca de 100,000 vezes mais devagar do que se comunicar com a memória (RAM).

Quando nós rodamos este programa todas as funções são automaticamente definidas, mas elas não são executadas imediatamente. Isto é uma coisa fundamental para entender sobre programas assíncronos. Quando `addOne` é chamado fora de `readFile` então executa a próxima coisa que está pronta para executar. Se não tem nada para executar, Node vai esperar as operações pendentes de fs/rede para terminar ou parar de rodar e sair da linha de comando.

Quando `readFile` está pronto para ler o arquivo (isto pode levar de milissegundos para segundos ou minutos dependendo do quão rápido o disco rígido é) ele vai rodar a função `doneReading` e mostrar um erro (se existir algum erro) e o conteúdo do arquivo.

A razão pelo resultado ser `undefined` é que em nenhum lugar do nosso código existe uma lógica que diga para `console.log` esperar até que `readFile` tenha terminado.

Se você tem algum código que tenha que ser executado várias vezes ou depois de um tempo o primeiro passo é colocar o código dentro de uma função. Depois você chama a função quando você quiser rodar aquele código. Dar nomes descritivos as suas funções ajuda.

Callbacks são apenas funções que são executados depois de um tempo. A chave para entender callbacks é perceber que eles são usados quando você não sabe **quando** algum código assíncrono vai terminar, mas você sabe **onde** a operação vai terminar - a última linha da função assíncrona! A ordem de cima à baixo que você declara callbacks não necessariamente importa, apenas a lógica hierárquica de assentamento do código. Primeiro você quebra seu código em funções, e depois usa callbacks para declarar se uma função depende do término de outra função.

O método `fs.readFile` é fornecido pelo Node, é assíncrono e leva um bom tempo para terminar. Considerando o que ele faz: ele tem que ir ao Sistema Operacional, que por sua vez tem que ir ao sistema de arquivos, que está no disco rígido que pode ou não estar rodando à milhares de vezes por minuto. Então ele tem que usar um laser para ler os dados e enviar de volta através das camadas para seu programa JavaScript. Você dá à `readFile` uma função (conhecida como callback) que vai ser chamado assim que receber os dados do sistema de arquivos. Ele bota os dados em uma variável e chama sua função (callback) com aquela variável, nesse caso a variável é chamada `fileContents` porque ela contém os dados do arquivo que foi lido.

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

Quando uma função é invocada no JavaScript, o código dentro dela será executado imediatamente. Nesse caso, nosso log será executado já que `callback` é a função `logMyNumber`. Lembre que, só porque você *definiu* uma função não significa que ela será executada. Você tem que *invocar* a função para isso acontecer.

Para quebrar o exemplo acima em pedaços, aqui está a linha do tempo dos eventos que acontecem quando rodamos este programa:

- 1: o código é analisado, o que significa que se existir algum erro de sintaxe o programa vai quebrar. Durante esta fase inicial tem 4 coisas que são definidas: `fs`, `myNumber`, `addOne`, e `logMyNumber`. Note que eles estão sendo apenas definidos, nenhuma função foi chamada/invocada ainda.
- 2: quando a última linha do nosso programa é executada `addOne` é invocado, onde `logMyNumber` é passado como `callback`, que é o que queremos que seja chamado quando `addOne` terminar. Isto imediatamente executa o código assíncrono `fs.readFile`. Esta parte do programa leva um tempo para terminar.
- 3: sem nada para fazer, o Node espera até que `readFile` termine. Se existisse alguma outra coisa durante esse tempo, Node poderia fazer o seu trabalho.
- 4: `readFile` termina e chama o callback, `doneReading`, que incrementa o número e imediatamente invoca a função callback de `addOne`, `logMyNumber`.

Talvez a parte mais confusa de programar com callbacks é que funções são apenas objetos que podem ser armazenadas em variáveis e passadas no programa com diferentes nomes. Dar um simples e descritivo nome para suas variáveis é importante para fazer seu código legível para outras pessoas. Geralmente, falando em programas Node, quando você vê uma variável como `callback` ou `cb` você sabe que é uma função.

Você pode ter ouvido os termos "programação evencionada" ou "ciclo de eventos". Eles se referem a maneira que `readFile` é implementado. O Node roda primeiro a operação `readFile` e então espera por `readFile` para enviar um evento dizendo que está completo. Enquanto espera, o Node pode checar outras coisas. Dentro do Node está uma lista de coisas que são executadas mas não foram reportadas de volta ainda, então o Node faz um loop contínuo na lista para checar se elas terminaram. Depois que eles terminam eles são "processados" (ex.: callbacks que dependem desse término vão ser invocados).

Aqui temos a versão de um pseudocódigo do exemplo acima:

```js
function addOne(thenRunThisFunction) {
  waitAMinute(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

Imagine que você tem 3 funções assíncronas `a`, `b` e `c`. Cada uma leva um minuto para rodar e quando terminadas chamam um callback (que é passado no primeiro argumento). Se você disser para o Node: 'comece executando "a", depois execute "b" quando "a" terminar, e então execute "c" quando "b" terminar', isso ficaria assim:

```js
a(function() {
  b(function() {
    c()
  })
})
```

Quando este código é executado, `a` vai iniciar automaticamente, então, um minuto depois ele vai terminar e chamar `b`, e um minuto depois ele vai terminar e chamar `c` e, finalmente, 3 minutos depois o Node vai parar o código já que não tem mais nada para fazer. Definitivamente, existem formas mais elegantes de escrever o código acima, mas o ponto é que se você tiver um código que tem que esperar outro código assíncrono terminar então você expressa esta dependência colocando este código em funções que são passadas como callbacks.

A forma como o Node trabalha requer que você pense de uma forma não-linear. Considerando esta lista de operações:

```
ler um arquivo
processar esse arquivo
```

Se você precisar transformar em pseudocódigo ficaria assim:

```
var file = readFile()
processFile(file)
```

Este tipo de código linear (passo-a-passo, em ordem) não é a maneira que Node trabalha. Se este código fosse executado então `readFile` e `processFile` iriam executar ao mesmo tempo. Isto não faz sentido já que `readFile` vai levar um tempo para completar. Ao invés disso você precisa expressar que `processFile` depende de `readFile`. Este é o trabalho dos callbacks! E por causa da maneira que JavaScript trabalha você pode escrever esta dependência de várias maneiras diferentes:

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // faça algo com movieData
}
```

Mas você támbem pode estruturar o seu código dessa maneira, e ainda assim vai funcionar:

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // faça algo com movieData
}

fs.readFile('movie.mp4', finishedReading)
```

Ou até mesmo assim:

```js
var fs = require('fs')

fs.readFile('movie.mp4', function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // faça algo com movieData
})
```

## Eventos

No Node, se você requisitar o módulo [events](http://nodejs.org/api/events.html), você pode utilizar o também chamado "emissor de evento" que o próprio Node utiliza para todas as suas APIs a fim de emitir coisas.

Eventos são padrões comuns na programação, para conhecer melhor procure por ['observer pattern'](http://en.wikipedia.org/wiki/Observer_pattern) ou 'pub/sub' (publicar/assinar). Assim como callbacks são uma relação de um-para-um entre algo que espera pelo callback e outra parte que chama o callback, eventos seguem o mesmo padrão com exceção de que eles são uma API de muitos-para-muitos.

A forma mais fácil de pensar a respeito de eventos é que eles permitem a você assinar as coisas. Você pode dizer "quando X fazer Y", enquanto que com um simples callbacks é "faça X, então Y".

Aqui temos casos comuns para utilizar eventos ao invés de simples callbacks:

- Uma sala de chat onde você tem um canal de mensagens com muitos ouvintes.
- Servidor de um jogo que necessita saber quando os players se conectam, desconectam, movem-se, atiram ou pulam.
- Mecânismo de um jogo onde você quer permitir que os desenolvedores de jogos disparem eventos como: `.on('jump', function() {})`.
- Um servidor web de baixo nível que quer expor uma API para criar facilmente um gancho para os eventos que acontecem como `on ('incomingRequest')` ou `on ('SERVERERROR')`.

Se você tentar escrever um servidor de chat que se conecte usando apenas callbacks ele vai se parecer com isso:

```js
var chatClient = require('my-chat-client')

function onConnect() {
  // exibe a UI quando conectar-se
}

function onConnectionError(error) {
  // exibe um erro para o usuário
}

function onDisconnect() {
 // avisa ao usuario que ele foi desconectado
}

function onMessage(message) {
 // exibe a mensagem na UI da sala
}

chatClient.connect(
  'http://mychatserver.com',
  onConnect,
  onConnectionError,
  onDisconnect,
  onMessage
)
```

Como você pode ver, isto é realmente pesado pois você tem que passar todas as funções em uma ordem especifica para a função `.connect`. Escrevendo isso com eventos irá se parecer com isso:

```js
var chatClient = require('my-chat-client').connect()

chatClient.on('connect', function() {
  // exibe a UI quando conectar-se
})

chatClient.on('connectionError', function() {
  // exibe um erro para o usuário
})

chatClient.on('disconnect', function() {
  // avisa ao usuario que ele foi desconectado
})

chatClient.on('message', function() {
  // exibe a mensagem na UI da sala
})
```

Esta abordagem é bastante similar a utilização com callbacks-puros, mas essa abordagem introduz o método `.on` onde atrela um callback a um evento. Isso significa que você pode escolher quais eventos deseja assinar a partir do `chatClient`. Você pode assinar o mesmo evento diversas vezes com diferentes callbacks:

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

Logo no início do projeto do Node, as APIs de arquivos de sistema e redes tiveram os seus próprios padrões de separação para lidar com a streaming de I/O. Por exemplo, arquivos em um sistema de arquivos tem propriedades que se chamam "descritores de arquivo" então o módulo `fs` teve uma lógica adicional enquanto o módulo de rede não teve esse conceito adicionado. Apesar de diferenças menores na semâtica como esta, em um nível fundamental ambos os grupos de código tem uma grande quantidade de funcionalidades duplicadas onde fazem a leitura de dados na entrada e saida. O time que esta trabalhando no Node percebeu que seria confuso ter que aprender dois conjuntos de semântica, essencialmente, fazendo a mesma coisa, por isso fizeram uma nova API chamada `Stream` e tudo o que demanda rede e sistema de arquivos usa ela como base.

O ponto principal do Node é facilitar a comunicaçãoo com o sistema de arquivos e redes através de um padrão que é utilizado em todos os lugares. A boa notícia é que a maioria dos padrões como esse (há apenas alguns) foram descobertos até este ponto e terão poucas mudanças mesmo que seja quase improvável que isso aconteça no futuro.

Já existem duas grandes fontes que você pode utilizar para aprender a respeito de Streams no Node. Uma é o *stream-adventure* (veja a seção [Aprenda Node de forma interativa](#aprenda-node-de-forma-interativa)) e a outra é uma referência chamada *Stream Handbook*.

### Stream Handbook

O [stream-handbook](https://github.com/substack/stream-handbook#introduction) é um guia, similar a este, que contém referências para tudo o que você quer saber a respeito de Streams.

[![stream-handbook](stream-handbook.png)](https://github.com/substack/stream-handbook)

## Módulos e NPM

O núcleo do Node é composto de cerca de duas dezenas de módulos, alguns com níveis mais baixos como `events` e `streams`, e outras de níveis mais alto como `http` e `crypto`.

Este projeto é intencional. O núcleo do Node foi desenvolvido para ser pequeno e os módulos no núcleo devem focar no fornecimento de ferramentas para trabalhar com protocolos e formatos comuns de I/O de maneira multiplataforma.

Para todo o restante, existe o [NPM](https://npmjs.org/). Qualquer um pode criar um novo módulo para o Node que adicione alguma funcionalidade e publicá-lo no NPM. No momento em que escrevo isso, existem 34.000 módulos no NPM.

### Como encontrar um módulo

Imagine que você está tentando converter arquivos PDF em arquivos TXT. A melhor forma para iniciar esta busca é com `npm search pdf`:

![pdfsearch](npm-search.png)

Há uma tonelada de resultados! NPM é bastante popular e normalmente você vai ser capaz de encontrar várias soluções possíveis. Se você passar por cada módulo e filtrar os resultados em um conjunto mais estreito (filtrando as coisas como módulos de geração de PDF), você vai acabar com estes resultados:

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

Diversos módulos possuem sobreposição de funcionalidade, mas as atuais APIs alternativas e a maioria delas requer dependências externas (como o `apt-get install poppler`).

Aqui estão algumas maneiras diferentes de interpretar os módulos:

- `pdf2json` é o único que está escrito em JavaScript puro, o que significa que é mais fácil de instalar, especialmente em dispositivos de baixa potência, como o Raspberry Pi ou no Windows, onde o código nativo pode não ser multiplataforma;
- módulos como `mimeograph`, `hummus` e `pdf-extract` onde cada um combina vários módulos de nível inferior para expor uma API de alto nível;
- uma série de módulos parecem tomar como base a linha de comando unix do `pdftotext`/`poppler`

Vamos comparar as diferenças entre `pdftotextjs` e `pdf-text-extract`, ambos estão contidos no utilitário `pdftotext`.

![pdf-modules](pdf-modules.png)

Ambos:

- foram atualizados recentemente
- possuem repositórios github "linkados" (isto é muito importante!)
- posuem READMEs
- possuem, ao menos, um número considerável de pessoas o instalando toda semana
- são "livremente" licenciados (qualquer um pode usar)

Olhando apenas para os arquivos `package.json` + módulo de estatísticas, é difícil obter uma sensação sobre qual pode ser a escolha certa. Vamos comparar os READMEs:

![pdf-readmes](pdf-readmes.png)

Ambos possuem descrições simples, emblemas para CI, instruções de instalação, exemplos claros e instruções para a execução dos testes. Otimo! Mas, qual é que vamos usar? Vamos comparar o código:

![pdf-code](pdf-code.png)

`pdftotextjs` possue cerca de 110 linhas, e `pdf-text-extract` cerca de 40 linhas, mas ambos, essencialmente, resumem-se a esta linha:

```
var child = shell.exec('pdftotext ' + self.options.additional.join(' '));
```

Será que isto faz um melhor que o outro? Difícil dizer! É realmente importante "ler" o código e fazer as suas próprias conclusões. Se você encontrar um módulo que você gosta, use `npm star modulename` para dar um *feedback* sobre os módulos que você teve uma experiência positiva com ele.

### Fluxo de Desenvolvimento Modular

NPM é diferente da maioria dos gerenciadores de pacotes já que ele instala módulos em uma pasta dentro de outros módulos já existentes. A frase anterior pode não fazer sentido agora, mas é a chave para o sucesso do NPM.

Muitos gerenciadores de pacotes instalam as coisas globalmente. Por exemplo, se você executar `apt-get install couchdb` no Linux Debian ele vai tentar instalar a última versão estável do CouchDB. Se você estiver tentando instalar o CouchDB como dependência de um Software e este precisa de uma versão anterior do CouchDB, você terá de desinstalar a nova versão do CouchDB e assim instalar a versão anterior. Você não pode ter duas versões do CouchDB instaladas pois o Debian só sabe como instalar as coisas em um local somente.

Não é apenas o Debian que faz isso. A maioria dos gerenciadores de pacotes de linguagem de programação funciona dessa maneira também. Para organizar o problema das dependências globais descrito acima, foram desenvolvidos ambientes virtuais como [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs.html) para o Python ou [bundler](http://bundler.io/) para o Ruby. Eles apenas dividem o ambiente em muitos ambientes virtuais, um para cada projeto, mas dentro de cada ambiente as respectivas dependências continuam instaladas de modo global. Os ambientes virtuais nem sempre resolvem o problema, às vezes eles só o multiplicam através da inclusão de camadas adicionais de complexidade.

Com o NPM, a instalação de módulos globais é um anti-padrão. Assim como você não deve usar as variáveis ​​globais em seus programas em JavaScript você também não deve instalar os módulos globais (a menos que você precise de um módulo com um binário executável a aparecer em seu `PATH` global, mas nem sempre você precisa fazer isso - mais sobre isso depois).

#### Como o `require` funciona.

Quando você chama o `require('algum_modulo')` no Node, isto é o que acontece:

1. se o arquivo chamado `algum_modulo.js` existir no diretório atual o Node vai carregá-lo, do contrário:
2. o Node vai procurar no diretório atual pela pasta `node_modules` com `algum_modulo` nele
3. caso não encontre, ele fará o mesmo processo no diretório pai

Este ciclo será efetuado até o Node chegar no diretório raiz do sistema de arquivos, até que ele comece a verificar os diretórios dos módulos globais (ex.: `/usr/local/node_modules` no Mac) e, mesmo assim, se `algum_modulo` não for encontrado, será lançada uma exceção.

Aqui temos um exemplo prático:

![mod-diagram-01](mod-diagram-01.png)

Quando o diretório de trabalho atual é `subsubfolder` e `require('foo')` é chamado, o Node vai procurar pelo diretório chamado `subsubsubfolder/node_modules`. Neste caso, não será encontrado - o diretório foi nomeado incorretamente como `my_modules`. Então, o Node vai procurar no diretório pai e tentar novamente, o que significa que ele vai procurar no diretório `subfolder_B/node_modules` , o qual também não existe. Já a terceira tentativa funciona perfeitamente, pois `folder/node_modules` existe e possui uma pasta chamada `foo` dentro dela. Se `foo` não estivesse neste local, o Node continuaria a sua busca no diretório pai do diretório atual onde a busca está sendo feita.

Observe que se chamarmos do diretório `subfolder_B` o Node nunca vai encontar `subfolder_A/node_modules`, ele apenas pode visualizar `folder/node_modules` e o que estiver nos diretórios acima dele.

Um dos benefícios da abordagem do NPM é que os módulos podem instalar seus módulos dependentes em versões específicas de trabalho conhecidos. Neste caso, o módulo `foo` é muito popular - existem três cópias dele, cada um instalado dentro de um diretório parente. A razão para isto é que cada módulo parente necessita de uma versão diferente de `foo`, para exemplificar: `folder` precisa de `foo@0.0.1`, `subfolder_A` precisa de `foo@0.2.1` e assim por diante.

Isto é o que acontece quando consertamos o nome do diretório `my_modules` colocado equivocadamente para o nome correto `node_modules`:

![mod-diagram-02](mod-diagram-02.png)

Para testar qual módulo foi carregado pelo node, você pode utilizar o comando `require.resolve('algum_modulo')`, o que vai mostrar o caminho para o módulo que o Node encontrar como resultado no procedimento de busca através dos diretórios. O `require.resolve` pode ser útil para fazer uma verificação mais rígida quando você quer ter a certeza de que um módulo está sendo carregado - às vezes há uma outra versão do mesmo módulo mais perto de seu diretório de trabalho atual do que aquele que você pretende carregar.

### Como criar um módulo

Agora que você já sabe como encontrar os módulos e fazer as suas requisições, você pode começar a escrever os seus próprios módulos.

#### O módulo mais simples possível

Os módulos do Node são radicalmente leves. Aqui está uma das possibilidades mais simples para um módulo no Node:

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

Por padrão, o Node tenta carregar `module/index.js` quando você faz um `require('module')`, qualquer outro nome de arquivo não vai funcionar a menos que você defina o campo `main` no `package.json` e aponte para ele.

Coloque ambos os arquivos em uma pasta chamada `number-one` (o `id` em `package.json` deve coincidir com o nome da pasta) e você terá um módulo Node para trabalhar.

Chamando a função `require('number-one')` será retornado o valor de qualquer `module.exports` que estiver definido dentro do módulo:

![simple-module](simple-module.png)

Uma forma ainda mais rápida para criar um módulo é executando os seguintes comandos:

```sh
mkdir my_module
cd my_module
git init
git remote add git@github.com:yourusername/my_module.git
npm init
```

Executando `npm init` será criado um manifesto JSON válido chamado `package.json` para você e se você executá-lo em um repositório `git` existente, será definido um campo `repositories` dentro do `package.json` automaticamente!

#### Adicionando dependências

Um módulo pode listar outros módulos a partir do NPM ou Github no campo `dependencies` do arquivo `package.json`. Para instalar o módulo `request` como uma nova dependência e automaticamente adicioná-la ao `package.json` é preciso executar o seguinte comando a partir do seu diretório raiz:

```sh
npm install request --save
```

Isto vai instalar uma cópia de `request` na pasta mais próxima do `node_modules` e fazer o nosso `package.json` se parecer assim:

```
{
  "id": "number-one",
  "version": "1.0.0",
  "dependencies": {
    "request": "~2.22.0"
  }
}
```

Por padrão, `npm install` vai pegar a versão mais atual publicada do módulo.

## Desenvolvimento no lado do cliente com NPM

Um equívoco comum sobre NPM é que uma vez que tem "Node" no nome que deve ser usado apenas para os módulos de JS do lado do servidor. Isto é completamente falso! O NPM está realmente para modulos empacotados do Node, por exemplo, módulos que o Node empacota para você. Os próprios módulos podem ser o que você quiser - eles são apenas uma pasta de arquivos contidos em um arquivo `tar.gz`, e um arquivo chamado `package.json` que declara a versão do módulo e uma lista de todos os módulos que são dependências deste módulo (bem como os respectivos números de versão para a versão de trabalho ficar instalado automaticamente). As dependências deste do módulo são apenas módulos, e estes módulos podem ter dependências, etc, etc, etc.

O [browserify](http://browserify.org/) é um utilitário escrito em Node que tenta converter qualquer módulo do Node em um código que possa ser executado em qualquer *browser*. Nem todos os módulos funcionam (navegadores não podem fazer determinadas coisas como hospedar um servidor HTTP), mas muitos módulos no NPM "vão" funcionar.

Para testar o NPM no *browser*, você pode utilizar o [RequireBin](http://requirebin.com/), que é um app que eu fiz e aproveita as vantagens do [Browserify-CDN](https://github.com/jesusabdullah/browserify-cdn), que utiliza o *browserfy* por debaixo dos panos, mas retorna uma saída através do HTTP (em vez da linha de comando - que é a forma como é normalmente usado o browserify).

Tente colocar este código dentro do *RequireBin* e pressione o botão *preview*:

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

Ou verifique um [exemplo mais completo](http://requirebin.com/?gist=6031068) (fique a vontade para modificar o código e ver o que acontece):

[![requirebin](requirebin.png)](http://requirebin.com/embed?gist=6031068)

## Evoluindo de forma correta

Como todo boa ferramenta, o Node é adequado para certos casos de uso. Por exemplo: Rails, o popular web framework, é ótimo para modelar complexas [lógicas de negócios](http://en.wikipedia.org/wiki/Business_logic).

Exemplo: usando código para representar a vida em um plano objetivado que vivemos físicamente como contas, empréstimos, itinerários e inventários. Embora tecnicamente seja possivel fazer o mesmo utilizando o Node, haveriam desvantagens claras sabendo que o Node é projetado para resolver problemas de I/O e não sabe muito a respeito de "lógica de negócio". Cada ferramenta tem um foco para resolver diferentes problemas. Esperamos que este guia ajude-o a ganhar uma compreensão intuitiva dos pontos fortes do Node para que você saiba quando ele será útil.

### O que está fora do escopo do Node?

Fundamentalmente o Node é somente usado como uma ferramenta para gerenciar I/O ao redor do sitema de arquivos e redes, ele deixa outras funcionalidades mais bonitas com módulos de terceiros. Aqui são algumas das coisas ques estão **fora** do escopo do Node:

#### Web frameworks

Existe uma boa quantidade de web frameworks construidos em cima do node (framework é um pacote que tenta resolver um problema de alto nível e problemas similares à modelagem de lógica de negócios), mas o Node não é um framework para web. Frameworks web são escritos para serem utilizados no Node e nem sempre tomam o mesmo tipo de decisões sobre a adição de complexidade, abstração e compreensão que o Node faz e podem ter outras prioridades.

#### Sintaxe da linguagem

O Node usa JavaScript e não muda nada sobre isso. Felix Geisendörfer tem um belo conteúdo escrito sobre o "Guia de estilo do Node" [aqui](https://github.com/felixge/node-style-guide).

#### Abstração da linguagem

Quando possivel, o Node vai usar a maneira mais simples para fazer algo. Código mais "bonito" faz do seu JavaScript mais complexo e compromissado com vantagens e desvantagens. Programar é difícil, especialmente em JS onde você tem 1000 soluções para o mesmo problema! Essa é a principal razão para o Node optar pela simplicidade sempre que possível e que pode ser uma opção universal. Se você está resolvendo um problema complexo e está insatisfeito com o modo como o Node implementa as coisas com "soluções de JS com gosto de baunilha", sinta-se livre para resolver isso dentro do seu app ou módulo usando quaisquer abstrações que você preferir.

Um grande exemplo é como o Node usa os callbacks. Logo no início foi experimentado a característica chamada *promises* que adicionava algumas funcionalidades para fazer o código assíncrono parecer mais linear. Ele foi levado para o fora do núcleo do Node por algumas razões:

- eles são mais complexos que callbacks
- ele podem ser implementados na *userland* (distriuído no npm como módulo de terceiros)

Considere uma das mais universais e básicas ideias que o Node faz: ler um arquivo. Onde você lê um arquivo e precisa saber onde os erros acontecem, como quando o disco rígido morre no meio da sua leitura. Se Node tivesse *promises* todo mundo teria que criar um *branch* como o código abaixo:

```js
fs.readFile('movie.mp4')
  .then(function(data) {
    // faz algo com os dados
  })
  .error(function(error) {
    // manipula o erro
  })
```

Isso adiciona uma complexidade desnecessária. No lugar de duas funções separadas o Node somente usa uma única função de callback. Aqui temos as regras:

- Quando não existir erros passe *null* como primeiro argumento.
- Quando existir um erro, passar ele como primeiro argumento.
- O restante dos argumentos são usados para qualquer coisa (usualmente dados ou respostas, já que na maior parte do tempo o Node está lendo ou escrevendo coisas).

Por isso, o Node usa o estilo de callback:

```js
fs.readFile('movie.mp4', function(err, data) {
  // manipula erro, faz algo com os dados
})
```

#### Soluções baseadas em Threads/fibers/non-event

Nota: Se você não sabe o que isso tudo significa você terá uma facilidade maior com o tempo para aprender como o Node funciona, visto que desaprender coisas leva o mesmo tempo que aprender.

O Node usa *threads* internamente para fazer coisas de uma forma rápida mas não expõe isso ao usuário. Se você é um usuário técnico e está perguntando-se o porquê dele ser projetado desta maneira, esta leitura é 100% sobre [o design de libuv](http://nikhilm.github.com/uvbook/), que onde a camada de I/O feita em C++ e pela qual o Node é concebido.

## Licença

![CCBY](CCBY.png)

Creative Commons Attribution License (faça o que quiser, apenas dê os créditos)
http://creativecommons.org/licenses/by/2.0/

Donate icon is from the [http://thenounproject.com/noun/donate/#icon-No285](Noun Project)
