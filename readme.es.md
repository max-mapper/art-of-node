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

El código aquí define una función y luego en la siguiente línea llama a esa función, sin esperar nada. Cuando se llama a la función, inmediatamente agrega 1 al número, por lo que podemos esperar que después de llamar a la función el número sea 2.

Supongamos que queremos almacenar nuestro número en un archivo llamado `number.txt`:

```js
var fs = require('fs') // require es una función especial proporcionada por node
var myNumber = undefined // todavía no sabemos cuál es el número ya que está almacenado en un archivo

function addOne() {
  fs.readFile('./number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // registra undefined
```

¿Por qué obtenemos 'undefined' cuando extraemos el número esta vez? En este código usamos el método `fs.readFile`, que resulta ser un método asincrónico. Por lo general, las interacciones entre las cosas y  los discos duros o redes, serán asíncronas. Si solo tienen que acceder a objetos en la memoria o hacer algún trabajo en la CPU, serán sincrónicas. La razón de esto es que I/O es realmente realmente muy lento. La cifra de interacción con un disco duro es aproximadamente 100,000 veces más lento que interactuar con la memoria (RAM).

Cuando ejecutamos este programa, todas las funciones se definen de inmediato, pero no todas se ejecutan de inmediato. Esto es algo fundamental para entender la programación asíncrona. Cuando se llama a `addOne`, inicia un `readFile` y luego pasa al siguiente elemento que está listo para ejecutarse. Si no hay nada que ejecutar, node esperará a que finalicen las operaciones pendientes de fs/network o dejará de ejecutarse y saldrá a la línea de comando.

Cuando `readFile` termine de leer el archivo (esto puede tomar desde milisegundos a segundos a minutos dependiendo de qué tan rápido sea el disco duro) ejecutará la función `doneReading` y le pasará un error (si hubo uno) y el contenido del archivo.

La razón por la que obtuvimos `undefined` arriba es que en ninguna parte de nuestro código existe una lógica que le dice a la instrucción `console.log` que espere hasta que la instrucción `readFile` termine antes de que imprima el número.

Si tiene algún código que desea poder ejecutar una y otra vez o más adelante, el primer paso es poner ese código dentro de una función. Luego puede llamar a la función cuando quiera ejecutar su código. Esto le ayuda a elegir nombres descriptivos para sus funciones .

Las retrollamadas son funciones que se ejecutan más adelante. La clave para comprender las retrollamadas es darse cuenta de cuando se usan:  no sabes **cuándo** se completará alguna operación asincrónica, pero sí sabes **dónde** se completará la operación: la última línea de la función asincrónica!. No necesariamente importa el orden de arriba a abajo que declara la retrollamada , solo el anidamiento lógico/jerárquico de ellos. Primero divide tu código en funciones, y luego usa retrollamadas para declarar si una función depende de que otra termine.

El método `fs.readFile` lo proporciona node, es asíncrono y tarda mucho en terminar. Considere lo que hace: tiene que ir al sistema operativo, que a su vez tiene que ir al sistema de archivos, que se aloja en un disco duro que puede o no girar a miles de revoluciones por minuto. Luego tiene que usar un láser para leer datos y enviarlos de nuevo a través de las capas a su programa javascript. Usted le da a `readFile` una función (conocida como retrollamada) que llamará después de que haya recuperado los datos del sistema de archivos. Pone los datos que recuperó en una variable de JavaScript y llama a su función (retrollamada) con esa variable, en este caso la variable se llama `fileContents` porque contiene el contenido del archivo que se leyó.

Piense en el ejemplo del restaurante al comienzo de este tutorial. En muchos restaurantes obtienes un número para poner sobre tu mesa mientras esperas tu comida. Esto es muy parecido a las retrollamadas. Le dice al despachador qué hacer después de que tu hamburguesa con queso esté lista.

Pongamos nuestra declaración `console.log` en una función y la pasamos como una devolución de llamada.

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

Ahora se puede pasar la función `logMyNumber` en un argumento que se convertirá en la variable `callback` dentro de la función `addOne`. Después de que se haga `readFile`, se invocará la variable `callback` (`callback()`). Solo se pueden invocar funciones, por lo que si pasa algo que no sea una función, se producirá un error.

Cuando una función se invoca en javascript, el código dentro de esa función se ejecutará inmediatamente. En este caso, nuestra declaración de registro se ejecutará ya que `callback` es en realidad `logMyNumber`. Recuerde, solo porque *defines* una función no significa que se ejecutará. Tienes que *invocar* una función para que eso suceda.

Para desglosar aún más este ejemplo, aquí hay una línea de tiempo de eventos que suceden cuando ejecutamos este programa:

- 1: el código se analiza, lo que significa que si hay algún error de sintaxis, el programa se interrumpirá.
- 2: `addOne` se invoca, pasando la función `logMyNumber` como `callback`, que es lo que queremos que se nos llame cuando se complete `addOne`. Esto hace que la función asincrónica `fs.readFile` se inicie inmediatamente. Esta parte del programa tarda un poco en terminar.
- 3: sin nada que hacer, node permanece inactivo un poco mientras espera a que finalice `readFile`.
- 4: `readFile` finaliza y llama a su retrollamada,` doneReading`, que luego incrementa el número y luego invoca inmediatamente la función que `addOne` pasó (su retrollamada), `logMyNumber`.

Quizás la parte más confusa de la programación con retrollamadas es: que las funciones son solo objetos que se almacenan en variables y se traspasan con diferentes nombres. Dar nombres simples y descriptivos a tus variables es importante para que otros puedan leer tu código. En términos generales, en los programas hechos en node cuando ves una variable como `callback` o `cb`, puedes asumir que es una función.

Es posible que haya escuchado los términos 'programación de eventos' o 'bucle de eventos'. Se refieren a la forma en que se implementa `readFile`. Node primero despacha la operación `readFile` y luego espera a que` readFile` le envíe un evento que se ha completado. Mientras está esperando, node puede ir a ver otras cosas. Dentro node hay una lista de tareas que se envían pero que aún no se han reportado, por lo que node recorre la lista una y otra vez para ver si han terminado. Después de que terminan se 'procesan', p.ej. se invocarán todas las retrollamadas que dependen de estas finalizaciones.

Aquí hay una versión de pseudocódigo del ejemplo anterior:

```js
function addOne(thenRunThisFunction) {
  waitAMinuteAsync(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

Imagine que tiene 3 funciones asíncronas `a`, `b` y `c`. Cada una tarda 1 minuto en ejecutarse y, una vez finalizadas, llaman a una retrollamada (que se pasa en el primer argumento). Si quisieras decirle a node 'comienza a ejecutar *a*, luego ejecuta *b* al finalizar *a* y luego ejecuta *c* al finalizar *b*' se vería así:

```js
a(function() {
  b(function() {
    c()
  })
})
```

Cuando se ejecuta este código, `a` comenzará a ejecutarse inmediatamente, luego, un minuto más tarde, terminará y llamará a `b`, luego, un minuto más tarde, terminará y llamará a `c` y, finalmente, 3 minutos más tarde, node dejará de funcionar, ya que en ese momento no habría nada más que hacer. Definitivamente, hay formas más elegantes de escribir el ejemplo anterior, pero el punto es que si tienes un código que tiene que esperar a que termine algún otro código asíncrono, entonces expresas esa dependencia poniendo tu código en funciones que se pasan como retrollamadas.

El diseño de node requiere que pienses de forma no lineal. Considera esta lista de operaciones:

```
leer un archivo
procesar ese archivo
```

Si ingenuamente convirtieras esto en pseudocódigo, terminarías con esto:

```
var file = readFile()
processFile(file)
```

Este tipo de código lineal (paso a paso, en orden) no es la forma en que funciona node. Si este código se ejecutara, entonces `readFile` y `processFile` se ejecutarían al mismo tiempo. Esto no tiene sentido ya que `readFile` tardará un tiempo en completarse. En su lugar, debes expresar que `processFile` depende de la finalización de `readFile`. ¡Para eso son exactamente las retrollamadas! Y debido a la forma en que funciona JavaScript, puedes escribir esta dependencia de muchas maneras diferentes:

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // hacer algo con la película
}
```

Pero también podrías estructurar tu código de esta manera y aún funcionaría:

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // hacer algo con la película
}

fs.readFile('movie.mp4', finishedReading)
```

O incluso así:

```js
var fs = require('fs')

fs.readFile('movie.mp4', function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // hacer algo con la película
})
```

## Eventos

En node, si necesitas el módulo [events](http://nodejs.org/api/events.html), puedes usar el llamado 'emisor de eventos' que el propio node usa para todas sus API que emiten cosas.

Los eventos son un patrón común en la programación, conocido más ampliamente como el ['patrón de observador'](http://en.wikipedia.org/wiki/Observer_pattern) o 'pub/sub' (publicar/suscribirse). Mientras que las retrollamadas son una relación de uno a uno entre el elemento que espera la devolución de llamada y el elemento que llama a la retrollamada, los eventos son el mismo patrón exacto, excepto con una API de muchos a muchos.

Aquí hay algunos casos de uso comunes para usar eventos en lugar de retrollamadas simples:

- Sala de chat donde desea transmitir mensajes a muchos oyentes
- Servidor de juegos que necesita saber cuándo los nuevos jugadores se conectan, desconectan, mueven, disparan y saltan
- Conector de base de datos que puede necesitar saber cuándo se abre, cierra o envía un error la conexión a la base de datos

Si estuviéramos tratando de escribir un módulo que se conecta a un servidor de chat utilizando solo retrollamadas, se vería así:

```js
var chatClient = require('mi-cliente-de-chat')

function onConnect() {
  // hacer que la interfaz de usuario muestre que estamos conectados
}

function onConnectionError(error) {
  // Mostrar error al usuario
}

function onDisconnect() {
 // decirle al usuario que ha sido desconectado
}

function onMessage(message) {
 // muestra el mensaje de la sala de chat en la interfaz de usuario
}

chatClient.connect(
  'http://mychatserver.com',
  onConnect,
  onConnectionError,
  onDisconnect,
  onMessage
)
```

Como puedes ver, esto es realmente engorroso: tienes que pasar todas las funciones en un orden específico a la función `.connect`. Escribir esto con eventos se vería así:

```js
var chatClient = require('my-chat-client').connect()

chatClient.on('connect', function() {
  // hacer que la interfaz de usuario muestre que estamos conectados
})

chatClient.on('connectionError', function() {
  // Mostrar error al usuario
})

chatClient.on('disconnect', function() {
  // decirle al usuario que ha sido desconectado
})

chatClient.on('message', function() {
  // muestra el mensaje de la sala de chat en la interfaz de usuario
})
```

Este enfoque es similar al enfoque de retrollamada pura pero introduce el método `.on`, que suscribe una retrollamada a un evento. Esto significa que puedes elegir a qué eventos deseas suscribirte desde el `chatClient`. También puedes suscribirte al mismo evento varias veces con diferentes retrollamadas:

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

ToDo: MÁS CONTENIDO DE EVENTOS

## Transmisiones

En los inicios del proyecto el sistema de archivos y las API de red tenían sus propios patrones separados para lidiar con la transmisión de E/S. Por ejemplo, los archivos en un sistema de archivos tienen elementos llamados 'descriptores de archivo', por lo que el módulo 'fs' tenía que tener una lógica adicional para realizar un seguimiento de estos elementos, mientras que los módulos de red no tenían ese concepto. A pesar de las pequeñas diferencias en la semántica como estas, en un nivel fundamental, ambos grupos de código duplicaban mucha funcionalidad a la hora de leer datos dentro y fuera. El equipo de trabajo en node se dio cuenta de que sería confuso tener que aprender dos conjuntos de semántica para hacer esencialmente lo mismo, por lo que crearon una nueva API llamada 'Stream' e hicieron que todo el código de red y sistema de archivos la usara.

El objetivo principal de node es facilitar el manejo de los sistemas de archivos y las redes, por lo que tenía sentido tener un patrón que se usara en todas partes. La buena noticia es que la mayoría de los patrones como estos (solo hay unos pocos de todos modos) se han descubierto en este punto y es muy poco probable que node cambie tanto en el futuro.

EL RESTO ES ToDo (por hacer), mientras tanto, lea el [manual de transmisiones](https://github.com/substack/stream-handbook#introduction)

## Módulos

ToDo (en desarrollo)

## Vamos al grano

Como cualquier buena herramienta, node es el más adecuado para un determinado conjunto de casos de uso. Por ejemplo: Rails, el popular marco web, es excelente para modelar [lógica de negocios](http://en.wikipedia.org/wiki/Business_logic) compleja, p. ej.: Usando código para representar objetos comerciales de la vida real como cuentas, préstamos, itinerarios e inventarios. Si bien es técnicamente posible hacer el mismo tipo de cosas usando node, habría inconvenientes definitivos ya que node está diseñado para resolver problemas de E/S y no sabe mucho sobre 'lógica de negocios'. Cada herramienta se enfoca en diferentes problemas. Esperemos que esta guía te ayude a obtener una comprensión intuitiva de las fortalezas de  node para que sepas cuándo puede serte útil.

### ¿Qué está fuera del alcance de node?

Fundamentalmente, node es solo una herramienta utilizada para administrar E/S en sistemas de archivos y redes, y deja otras funcionalidades más sofisticadas a módulos de terceros. Aquí hay algunas cosas que están fuera del alcance de node:

#### Marcos de trabajo Web

Hay una serie de marcos web integrados en la parte superior de node (marco que significa un paquete de soluciones que intenta abordar algún problema de alto nivel como el modelado de la lógica empresarial), pero node no es un marco web. Los marcos web que se escriben usando node no siempre toman el mismo tipo de decisiones sobre la adición de complejidad, abstracciones y compensaciones que node tiene y puede tener otras prioridades.

#### Sintaxis del lenguaje

Node usa JavaScript y no cambia nada al respecto. Felix Geisendörfer tiene una muy buena descripción del 'estilo de nodo' [aquí](https://github.com/felixge/node-style-guide).

#### Abstracción del lenguaje

Cuando sea posible, node utilizará la forma más simple posible de lograr algo. Cuanto más elegante sea tu JavaScript, más complejidad y desventajas introducirás. ¡La programación es difícil, especialmente en JS, donde hay 1000 soluciones para cada problema! Es por esta razón que node intenta elegir siempre la opción más simple y universal. Si estás resolviendo un problema que requiere una solución compleja y no estás satisfecho con las 'soluciones vanilla JS' que implementa node, puedes resolverlo dentro de tu aplicación o módulo utilizando las abstracciones que prefieras.

Un gran ejemplo de esto es el uso que hace node de las retrollamadas. Al principio, node experimentó con una característica llamada 'promesas' que agregó una serie de características para hacer que el código asincrónico parezca más lineal. Fue sacado del núcleo de node por algunas razones:

- Ellas son más complejas que las retrollamadas
- se pueden implementar por el usuario (distribuidas en npm como módulos de terceros)

Considere una de las cosas más universales y básicas que hace node: leer un archivo. Cuando lees un archivo, quieres saber cuándo ocurren los errores, como cuando tu disco duro muere en medio de tu lectura. Si node tuviera promesas, todos tendrían que bifurcar su código así:

```js
fs.readFile('movie.mp4')
  .then(function(data) {
    // hacer cosas con datos
  })
  .error(function(error) {
    // manejar el error
  })
```

Esto agrega complejidad, y no todos quieren eso. En lugar de dos funciones separadas, node solo usa una única función de retrollamada. Estas son las reglas:

- Cuando no hay error, pasa nulo como primer argumento
- Cuando hay un error, lo pasa como el primer argumento
- El resto de los argumentos se pueden usar para cualquier cosa (generalmente datos o respuestas ya que la mayoría de funciones en node son leer o escribir cosas)

Por lo tanto, el estilo de retrollamada node:

```js
fs.readFile('movie.mp4', function(err, data) {
  // maneja el error, procesar los datos
})
```

#### Soluciones de concurrencia basados en hilos/fibras/no-eventos

Nota: Si no sabe lo que significan estas cosas, es probable que se le haga más fácil estudiar node, ya que desaprender algo es tanto trabajo como aprenderlo.

Node utiliza internamente subprocesos  para acelerar las cosas, pero no los expone al usuario. Si usted es un usuario técnico que se pregunta por qué node está diseñado de esta manera, debería leer al 100% [el diseño de libuv](http://nikhilm.github.com/uvbook/), la capa de E/S de node construido sobre C++.

## Aplicaciones en tiempo real

TODO (por hacer): esta sección tendrá una aplicación funcional real, con una interfaz de usuario web cuya arquitectura será diseccionada y discutida.

## Licencia

![CCBY](CCBY.png)

Licencia de atribución de Creative Commons (haz lo que sea, solo atribuyeme)
http://creativecommons.org/licenses/by/2.0/

El ícono donar es del [Proyecto Noun](http://thenounproject.com/noun/donate/#icon-No285)
