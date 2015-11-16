# El Arte de Node
## Una introducción a Node.js

Este documento está destinado a aquellos lectores que saben al menos un poco de esto:

- un lenguaje tipo script como JavaScript, Ruby, Python, Perl, etc. Si aun no eres programador entonces probablemente será más fácil empezar por leer [JavaScript for Cats](http://jsforcats.com/). :cat2:
- git y github. Éstas son herramientas colaborativas de código abierto usadas por las personas en la comunidad de Node para compartir módulos. Sólo necesitas conocer lo básico. Aquí hay tres tutoriales introductorios: [1](https://github.com/jlord/git-it-electron#readme), [2](http://zachbruggeman.me/github-for-cats/), [3](http://opensourcerer.diy.org/)

Este corto libro es un trabajo en progeso + No tengo trabajo en este momento (si tuviera no tendría el tiempo para escribir esto). Si te gusta este trabajo considera realizar una donación via [gittip](https://www.gittip.com/maxogden/) para poder escribir mucho más!

[![donate](donate.png)](https://www.gittip.com/maxogden/)

## Tabla de contenidos

- [Entendiendo node](#entendiendo-node)
- [Módulos en el core](#mdulos-en-el-core)
- [Retrollamadas](#retrollamadas)
- [Events](#events) (not written yet)
- [Streams](#streams) (not written yet)
- [Modules and NPM](#modules) (not written yet)
- [Going with the grain](#going-with-the-grain)
- [Real-time apps](#realtime) (not written yet)

## Entendiendo node

Node.js es un proyecto de código abierto diseñado para ayudarte a escribir código JavaScript que se comunique con redes, archivos del sistema y otras E/S (entrada/salida, lectura/escritura) fuentes. Eso es! Node.js es simplemente una sencilla y estable plataforma E/S que anima a construir módulos sobre ella misma.

¿Cuáles son algunos de E/S? Aquí hay un diagrama de una aplicación que hice con Node y que muestra algunas fuentes de E/S:

![server diagram](server-diagram.png)

Si no entiendes todos los elementos en el diagrama está bien. El punto es mostrar que un único proceso en Node (el hexágono en la mitad) puede actuar como agente entre todos los diferentes puntos finales de E/S (naranja y púrpura representan E/S).

Al construir uno de estos tipos de sistemas usualmente se presenta uno de estos casos:

- dificultad para programar pero con muy buenos y rápidos resultados (como escribir tus servidores web desde cero en C)
- Fácil de codificar pero no muy rápido/robusto (como cuando intentas subir un archivo de 5GB y tu servidor colapsa)

El objetivo de Node es proveer un balance entre: relativamente fácil de entender y usar, y lo suficientemente rápido para la mayoría de los casos.

Node no es ninguno de los siguientes:

  - Un framework web (como Rails o Django, sin embargo puede ser usado para hacer tales cosas)
  - Un lenguaje de programación (Node usa JavaScript pero no es en sí mismo un lenguaje)

En su lugar, Node es algo en la mitad:

  - Diseñado para ser simple y por lo tanto relativamente fácil de entender y usar
  - Útil para programas basados en E/S que necesitan ser rápidos y/o manejar muchas conecciones

A un nivel más bajo, Node puede ser descrito como una herramienta para escribir dos grandes tipos de programas:

  - Programas de red que usen los protocolos de la web: HTTP, TCP, UDP, DNS and SSL
  - Programas que lean y escriban información al sistema de archivos o a los procesos/memoria local

¿Qué es un "programa basado en E/S"? Aquí hay alguna fuentes comunes de E/S:

  - Bases de datos (MySQL, PostgreSQL, MongoDB, Redis, CouchDB)
  - APIs (Twitter, Facebook, Apple Push Notifications)
  - Conecciones HTTP/WebSocket (desde usuarios de una aplicación web)
  - Archivos (editor de imágenes, editor de videos, radio por internet)

Node procesa E/S en una forma llamada [asíncrona](http://en.wikipedia.org/wiki/Asynchronous_I/O) el cual le permite manejar muchas cosas diferentes simultáneamente. Por ejemplo, si vas a un restaurante de comida rápida y ordenas una hamburguesa ellos tomarán tu orden inmediatamente y te harán esperar hasta que tu hamburguesa esté lista. Mientras tanto ellos pueden tomar otras órdenes y empezar a preparar hamburguesas para otras personas. Imagina si tuvieras que esperar en la caja registradora por tu hamburguesa, bloqueando a todas las otras personas en la fila para ordenar, mientras preparan tu hamburguesa! Esto es llamado **bloqueo de E/S** porque toda E/S (preparación de hamburguesas) suceden una vez al tiempo. Node, por otro lado, es de **no-bloque**, que significa que puede preparar muchas hamburguesas al tiempo.

Aquí hay algunas cosas divertidas hechas de manera fácil con Node gracias a su naturaleza de no-bloque:

  - Control [volando quadcopters](http://nodecopter.com)
  - Escribir bots para chat IRC
  - Crear [robots bípedos](http://www.youtube.com/watch?v=jf-cEB3U2UQ)

## Módulos en el core

Primero que todo recomiendo tener instalado Node en tu computadora. La forma más fácil es visitar [nodejs.org](http://nodejs.org) y dar click en `Install`.

Node tiene un pequeño grupo de módulos en el core (comunmente referenciados como 'core de node') los cuales son presentados como la API pública que tienen por objeto el escribir programas con ellos. Para trabajar con sistemas de archivos está el módulo `fs` y para redes existen módulos como `net` (TCP), `http`, `dgram` (UDP).

Adicionalmente a los módulos `fs` y de redes, hay otros módulos base en el core de node. Existe un módulo para resolver consultas DNS asincronamente llamado `dns`, un módulo para obtener información específica del SO como el directorio temporal, llamado `os`, un módulo para asignar pedazos binarios de memoria llamado `buffer`, algunos módulos para parsear urls y caminos (`url`, `querystring`, `path`), etc. La mayoría si no todos los módulos en el core de Node, están para soportar los casos de uso principales de Node: Escribir programas rápidos que se comuniquen con sistemas de archivos o redes.

Node maneja E/S con: callbacks, eventos, streams (flujos) y módulos. Si aprendes cómo trabajan esos cuatro elementos entonces serás capaz de ir dentro de cualquier módulo en el core de Node y entender básicamente sobre cómo interactuar con él.

## Retrollamadas

Este es el tema más importante para entender si quieres entender cómo utilizar node. Casi todo en node utiliza retrollamadas. No fueron inventadas por node, y son una forma particularmente útil para utilizar las funciones en JavaScript.

Las retrollamadas son funciones que se ejecutan de forma asíncrona, o en un momento posterior. En lugar de leer el código de arriba a abajo, programas asincrónicos pueden ejecutar diferentes funciones en diferentes momentos basado en el orden y la velocidad que ocurren las  funciones que leen el sistema de archivo o los pedidos de http.

Determinando si una función es asíncrona o no puede crear confusión ya que depende mucho en el contexto donde se presenta. Aquí sigue un ejemplo simple de una  función sincrónica:


```js
var miNumero = 1
function agregaUno() { miNumeror++ } // define la  función
agregaUno() // ejecuta la  función
console.log(miNumero) // registra 2
```

++++++++++++++++++++++++Continue Translation+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

The code here defines a function and then on the next line calls that function, without waiting for anything. When the function is called it immediately adds 1 to the number, so we can expect that after we call the function the number should be 2.

Let's suppose that we want to instead store our number in a file called `number.txt`:

```js
var fs = require('fs') // require is a special function provided by node
var myNumber = undefined // we dont know what the number is yet since it is stored in a file

function addOne() {
  fs.readFile('./number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // logs out undefined
```

Why do we get `undefined` when we log out the number this time? In this code we use the `fs.readFile` method, which happens to be an asynchronous method. Usually things that have to talk to hard drives or networks will be asynchronous. If they just have to access things in memory or do some work on the CPU they will be synchronous. The reason for this is that I/O is reallyyy reallyyy sloowwww. A ballpark figure would be that talking to a hard drive is about 100,000 times slower than talking to memory (RAM).

When we run this program all of the functions are immediately defined, but they don't all execute immediately. This is a fundamental thing to understand about async programming. When `addOne` is called it kicks off a `readFile` and then moves on to the next thing that is ready to execute. If there is nothing to execute node will either wait for pending fs/network operations to finish or it will stop running and exit to the command line.

When `readFile` is done reading the file (this may take anywhere from milliseconds to seconds to minutes depending on how fast the hard drive is) it will run the `doneReading` function and give it an error (if there was an error) and the file contents.

The reason we got `undefined` above is that nowhere in our code exists logic that tells the `console.log` statement to wait until the `readFile` statement finishes before it prints out the number.

If you have some code that you want to be able to execute over and over again or at a later time the first step is to put that code inside a function. Then you can call the function whenever you want to run your code. It helps to give your functions descriptive names.

Callbacks are just functions that get executed at some later time. The key to understanding callbacks is to realize that they are used when you don't know **when** some async operation will complete, but you do know **where** the operation will complete — the last line of the async function! The top-to-bottom order that you declare callbacks does not necessarily matter, only the logical/hierarchical nesting of them. First you split your code up into functions, and then use callbacks to declare if one function depends on another function finishing.

The `fs.readFile` method is provided by node, is asynchronous and happens to take a long time to finish. Consider what it does: it has to go to the operating system, which in turn has to go to the file system, which lives on a hard drive that may or may not be spinning at thousands of revolutions per minute. Then it has to use a laser to read data and send it back up through the layers back into your javascript program. You give `readFile` a function (known as a callback) that it will call after it has retrieved the data from the file system. It puts the data it retrieved into a javascript variable and calls your function (callback) with that variable, in this case the variable is called `fileContents` because it contains the contents of the file that was read.

Think of the restaurant example at the beginning of this tutorial. At many restaurants you get a number to put on your table while you wait for your food. These are a lot like callbacks. They tell the server what to do after your cheeseburger is done.

Let's put our `console.log` statement into a function and pass it in as a callback.

```js
var fs = require('fs')
var myNumber = undefined

function addOne(callback) {
  fs.readFile('./number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
    callback()
  }
}

function logMyNumber() {
  console.log(myNumber)
}

addOne(logMyNumber)
```

Now the `logMyNumber` function can get passed in an argument that will become the `callback` variable inside the `addOne` function. After `readFile` is done the `callback` variable will be invoked (`callback()`). Only functions can be invoked, so if you pass in anything other than a function it will cause an error.

When a function get invoked in javascript the code inside that function will immediately get executed. In this case our log statement will execute since `callback` is actually `logMyNumber`. Remember, just because you *define* a function it doesn't mean it will execute. You have to *invoke* a function for that to happen.

To break down this example even more, here is a timeline of events that happen when we run this program:

- 1: the code is parsed, which means if there are any syntax errors they would make the program break.
- 2: `addOne` gets invoked, getting passed in the `logMyNumber` function as `callback`, which is what we want to be called when `addOne` is complete. This immediately causes the asynchronous `fs.readFile` function to kick off. This part of the program takes a while to finish.
- 3: with nothing to do, node idles for a bit as it waits for `readFile` to finish
- 4: `readFile` finishes and calls its callback, `doneReading`, which then in turn increments the number and then immediately invokes the function that `addOne` passed in (its callback), `logMyNumber`.

Perhaps the most confusing part of programming with callbacks is how functions are just objects that be stored in variables and passed around with different names. Giving simple and descriptive names to your variables is important in making your code readable by others. Generally speaking in node programs when you see a variable like `callback` or `cb` you can assume it is a function.

You may have heard the terms 'evented programming' or 'event loop'. They refer to the way that `readFile` is implemented. Node first dispatches the `readFile` operation and then waits for `readFile` to send it an event that it has completed. While it is waiting node can go check on other things. Inside node there is a list of things that are dispatched but haven't reported back yet, so node loops over the list again and again checking to see if they are finished. After they finished they get 'processed', e.g. any callbacks that depended on them finishing will get invoked.

Here is a pseudocode version of the above example:

```js
function addOne(thenRunThisFunction) {
  waitAMinute(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

Imagine you had 3 async functions `a`, `b` and `c`. Each one takes 1 minute to run and after it finishes it calls a callback (that gets passed in the first argument). If you wanted to tell node 'start running a, then run b after a finishes, and then run c after b finishes' it would look like this:

```js
a(function() {
  b(function() {
    c()
  })
})
```

When this code gets executed, `a` will immediately start running, then a minute later it will finish and call `b`, then a minute later it will finish and call `c` and finally 3 minutes later node will stop running since there would be nothing more to do. There are definitely more elegant ways to write the above example, but the point is that if you have code that has to wait for some other async code to finish then you express that dependency by putting your code in functions that get passed around as callbacks.

The design of node requires you to think non-linearly. Consider this list of operations:

```
read a file
process that file
```

If you were to naively turn this into pseudocode you would end up with this:

```
var file = readFile()
processFile(file)
```

This kind of linear (step-by-step, in order) code is isn't the way that node works. If this code were to get executed then `readFile` and `processFile` would both get executed at the same exact time. This doesn't make sense since `readFile` will take a while to complete. Instead you need to express that `processFile` depends on `readFile` finishing. This is exactly what callbacks are for! And because of the way that JavaScript works you can write this dependency many different ways:

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}
```

But you could also structure your code like this and it would still work:

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}

fs.readFile('movie.mp4', finishedReading)
```

Or even like this:

```js
var fs = require('fs')

fs.readFile('movie.mp4', function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
})
```

## Events

In node if you require the [events](http://nodejs.org/api/events.html) module you can use the so-called 'event emitter' that node itself uses for all of its APIs that emit things.

Events are a common pattern in programming, known more widely as the ['observer pattern'](http://en.wikipedia.org/wiki/Observer_pattern) or 'pub/sub' (publish/subscribe). Whereas callbacks are a one-to-one relationship between the thing waiting for the callback and the thing calling the callback, events are the same exact pattern except with a many-to-many API.

Here are few common use cases for using events instead of plain callbacks:

- Chat room where you want to broadcast messages to many listeners
- Game server that needs to know when new players connect, disconnect, move, shoot and jump
- Database connector that might need to know when the database connection opens, closes or sends an error

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

MORE EVENTS CONTENT TODO

## Streams

Early on in the project the file system and network APIs had their own separate patterns for dealing with streaming I/O. For example, files in a file system have things called 'file descriptors' so the `fs` module had to have extra logic to keep track of these things whereas the network modules didn't have such a concept. Despite minor differences in semantics like these, at a fundamental level both groups of code were duplicating a lot of functionality when it came to reading data in and out. The team working on node realized that it would be confusing to have to learn two sets of semantics to essentially do the same thing so they made a new API called the `Stream` and made all the network and file system code use it.

The whole point of node is to make it easy to deal with file systems and networks so it made sense to have one pattern that was used everywhere. The good news is that most of the patterns like these (there are only a few anyway) have been figured out at this point and it is very unlikely that node will change that much in the future.

THE REST IS TODO, in the meantime read the [streams handbook](https://github.com/substack/stream-handbook#introduction)

## Modules

TODO

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

## Real-time apps

TODO - this section will have a non-contrived, functioning application with a web UI whose architecture will be dissected and discussed.

## License

![CCBY](CCBY.png)

Creative Commons Attribution License (do whatever, just attribute me)
http://creativecommons.org/licenses/by/2.0/

Donate icon is from the [http://thenounproject.com/noun/donate/#icon-No285](Noun Project)
