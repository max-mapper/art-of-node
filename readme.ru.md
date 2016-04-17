TODO Translate to Russian

# Прелесть Ноды / The Art of Node
## Введение в Node.js \ An introduction to Node.js

This document is intended for readers who know at least a little bit of a couple of things:
Данный материал предназначен для читателей, которые уже имеют представление о:

- скриптовых языках типа JavaScript, Ruby, Python, Perl и других. Если вы только начинаете программировать, то вам стоит начать с прочтения [JavaScript for Cats](http://jsforcats.com/). :cat2:
- git и github. Эти инструменты для совместной работы широко используются в сообществе, чтобы делиться своими модулями. Вам достаточно знать хотя бы их основы. По ним есть отличные самоучители для новичков:
[1](https://github.com/jlord/git-it-electron#readme), [2](http://ericsteinborn.com/github-for-cats/#/), [3](http://opensourcerer.diy.org/)

## Оглавление

- [Изучи Ноду интерактивно](#learn-node-interactively)
- [Путь к пониманию Ноды](#understanding-node)
- [Базовые модули](#core-modules)
- [Колбэки] [Callbacks](#callbacks)
- [События / Событийная модель](#events)
- [Потоки в Ноде](#streams)
- [Модули и npm. Экосистема Ноды](#modules)
- [Разработка клиентской части с npm](#client-side-development-with-npm)
- [Going with the grain](#going-with-the-grain) !!!!!!!!

## Изучи Ноду интерактивно

В дополнение к чтению, очень важно параллельно писать код. Так вы скорее проникнетесь духом ноды и вникнете в её суть. Читать код в книге важно и нужно, но обучение через само написание кода - это ещё более лучший способ познания новых принципов программирования.

### NodeSchool.io

[NodeSchool.io](http://nodeschool.io/) серия открытых интерактивных воркшопов, по которым можно обучиться основным принципам Ноды.

[Learn You The Node.js](https://github.com/workshopper/learnyounode#learn-you-the-nodejs-for-much-win) представляет собой вступительный воркшоп NodeSchool.io. Здесь собраны несколько задач, решение которых поможет тебе усвоить основные принципы построения программ для Ноды. Устанваливается как консольная утилита.

[![learnyounode](https://github.com/rvagg/learnyounode/raw/master/learnyounode.png)](https://github.com/rvagg/learnyounode#learn-you-the-nodejs-for-much-win)

Устанавливается через npm:

```
# install
npm install learnyounode -g

# start the menu
learnyounode
```

## Путь к пониманию Ноды

Node.js - опенсорсный проект, сделанный чтобы помочь тебе писать программы для работы с сетью, файловыми системами и другими I/O (input/output, reading/writing) на языке JavaScript. Вот и всё! Это простая и стабильная I/O платформа в которой удобно создавать свои модули.

Какие ещё есть примеры использования ввода/вывода (далее I/O)? Здесь показана схема приложения, к-ое я делал на Ноде; на ней видно какие могут быть I/O источники:

![server diagram](server-diagram.png)

Если ты не знаешь все источники представленные на схеме, ничего страшного. Суть в том, чтобы показать, что один единственный процесс Ноды (шестигранник в центре) может выполнять роль брокера (диспетчера) между разными конечными пунктами (endpoints) I/O (оранжевым и фиолетовым обозначены каналы ввода/вывода).

Обычно, построение систем такого вида складывается по одному из путей:

- сложно для написания, но в результате получается супер-быстрая система (подобно написанию своих веб-серверов на чистом C)
- просты в написании но сильно страдает в скорости работы (особенно, когда кто-то пытается отправить на сервер 5Гб файл и твой сервер падает)

Задача Ноды - сохранить равновесие при достижении двух целей: быть достаточно простым для понимания и использования и настолько же быстрым для решения большинства задач.

Нода не является:
 - веб-фреймворком (вроде Rails или Django, хотя и может использоваться для создания подобных вещей)
 - языком программирования (Нода использует JS, но сама Нода языком НЕ является)

Нода - нечто среднее, можно сказать, что Нода:

  - Сделана чтобы быть простой для понимания и использования
  - Удобной при создании I/O программ, которые должны работать быстро и оставаться устойчивой к высоким нагрузкам
  
На более низком уровне, Ноду можно назвать инструментом для написания двух типов программ:

  - Сетевые программы, использующие протоколы веба: HTTP, TCP, UDP, DNS и SSL
  - Программы, для чтения и записи данных в файловую систему (далее ФС) или локальные процессы/память

Что означает "программы для I/O" ("I/O based program")? Рассмотрим несколько основых источников Ввода/Вывода (I/O sources):

  - Базы данных (MySQL, PostgreSQL, MongoDB, Redis, CouchDB)
  - Внешние API (Twitter, Facebook, Apple Push Notifications)
  - HTTP/WebSocket соединения (от пользователей веб-приложений)
  - Файлы (сжатие изображений, редактирование видео, интернет-радио)

Нода выполняет операции ввода/вывода способом, к-ый называют асинхронным [asynchronous](https://en.wikipedia.org/wiki/Asynchronous_I/O). Такой способ позволяет ей выполнять много разных операций одновременно (simultaneously). Приведу небольшой пример для большего понимания. Например, зайдя в какой-нибудь фаст-фуд и заказав чизбургер, ваш заказ примут *сразу*, и после *небольшой задержки* ваш заказ будет готов. Пока вы ждете, они могут принимать другие заказы и начать готовить чизбургеры для других людей. А теперь представьте ситуацию, когда остальным людям в очереди приходится ждать пока вам не принесут чизбургер. Они даже не смогут сделать заказ, пока вам его не приготовят! Технически такое поведение называется **блокирующая очередь**, ведь все операции ввода/вывода (по приготовлению чизбургеров) происходят строго по одной в 1 момент времени. Нода же, наоборот, реализует механизм **неблокирующей очереди**, что позволяет готовить много чизбургеров одновременно.

На Ноде такие вещи можно реализовать довольно легко, благодаря её неблокирующей сущности:
  
  - Механизм управления [летающими квадракоптерами](http://www.nodecopter.com/)
  - Написать IRC чат-ботов
  - Создать [ходячих роботов](https://www.youtube.com/watch?v=jf-cEB3U2UQ)

## Базовые модули (Core modules)

Во-первых, установите Ноду себе на компьютер. Брать её лучше отсюда [nodejs.org](http://nodejs.org)

У ноды есть небольшая группа базовых модулей (которую обычно называют одним термином 'Ядро Ноды' ('node core')), которые предоставлены, как внешний API для написания программ. Каждый модуль предназначен для своих целей: для работы с файловой системой есть модуль 'fs', для работы с сетями `net` (TCP), `http`, `dgram` (UDP).

Помимо модуля `fs` и сетевых модулей, есть и другие базовые модули. Для асинхронной работы с DNS-запросами есть модуль `dns`, `os` - для получения данных об ОСи, для выделения бинарных фрагентов памяти (a module for allocating binary chunks of memory called) есть `buffer`, модули для различного рода парсинга урлов, путей к файлам и вообще (`url`, `querystring`, `path`). Большинство из базовых модулей, если не все, служат для одной общей цели - написание быстрых (!) программ для работы с ФС или сетью.

Нода обрабатывает I/O-операции используя: колбэки, события, потоки и модули. Если ты знаешь как они работают, то сможешь разобраться в любом базовом модуле и понять как его правильно использовать.

## Колбэки (Callbacks)

Это, пожалуй, самая важная часть всего гайда. Если хочешь понять как работает Нода - придется разобраться с колбэками. Колбэки используются в Ноде повсюду; это не открытие Ноды, они лишь часть языка JavaScript.

Итак, начнем с определения. Колбэки - функции, к-ые вызываются не сразу, по мере выполнения основного кода, а асинхронно (asynchronously), т.е. их *выполнение* (invoking) будет отложено. В отличие от привычного процедурного стиля написания и выполнения кода **сверху вниз** (top to bottom), асинхронные программы могут выполнять свои функции непоследовательно (не в порядке их написания), учитывая скорость выполнения предыдущих функций, например http-запросов или чтения с диска.

Поначалу такое отличие попросту сбивает с толку. Действительно, бывает трудно определить заранее, будет ли функция выполняться асинхронно или нет - во многом это зависит от контекста её выполнения. Разберем простой пример синхронного выполнения, где код будет выполняться последовательно сверху вниз:

```js
var myNumber = 1
function addOne() { myNumber++ } // определяем функцию
addOne() // выполняем функцию
console.log(myNumber) // 2
```

В коде определяется функция и на след строке происходит её вызов, без задержек и пауз. Когда функция вызывается, myNumber *сразу* увеличится на 1. Мы уверены, что после вызова функции число станет равным 2. Это и есть предсказуемость синхронного кода - он всегда выполняется последовательно сверху вниз.

Нода же часто использует асинхронную модель выполнения кода. Давайте с помощью Ноды прочитаем число из файла `number.txt` (файл находится на диске, а значит будем использовать модуль `fs` - прим. перев.):

```js
var fs = require('fs') // подключение модуля для работы с ФС
var myNumber = undefined // пока мы не знаем какое число записано в файле

function addOne() {
  fs.readFile('number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // undefined -- эта строка выполнится до того, как будет прочитан файл!
```

Почему же после вызова функции мы получили `undefined`? Обратите внимание, в коде мы используем асинхронный метод `fs.readFile`. Обычно, такие функции, где идут операции чтения-записи на диск или работа с сетью, делают асинхронными. Когда же требуется обратиться к памяти напрямую  или поиспользовать возможности процессора, то функции делают синхронными. Дело в том, что операции I/O невероятно медленные (reallyyy reallyyy sloowwww) (это относится не только к Ноде но и ко всем языкам и технологиям - прим. перев). Стоит сказать, что чтение с диска (hard drive) происходит медленнее чем из памяти (RAM) примерно в 100k раз.

Когда мы запустим эту программу, определение функций произойдет немедленно, но такая быстрота не относится к скорости их выполнения. Это ключевой принцип для понимания асинхронного программирования. Когда произойдет вызов `addOne` она следом запустит функцию `readFile`, но не будет ждать окончания её работы, а перейдет к следующей задаче. Если Ноде больше нечего выполнять она будет просто ждать окончания IO-операций чтобы закончить работу и выйти.

Далее, когда `readFile` прочитает файл (это может занять некоторое время от нескольких миллисекунд до нескольких секунд или даже минут, в зависимости от того как быстро происходит чтение с диска), следом будет выполняться функция `doneReading`, которая и выдаст содержимое файла (если чтение прошло успешно) или ошибку.

В нашей программе мы получили на выходе `undefined` потому что в нашем коде нет никаких явных указаний функции `console.log` дождаться окончания выполнения `readFile` перед тем как выводить число.

Если вы хотите, чтобы какой-то код гарантированно выполнился последовательно, сперва поместите этот код в функцию! Только после этого ты сможешь вызвать функцию (выполнить блок кода) там где тебе надо. Это должно подтолкнуть тебя давать функциям точные и понятные имена.

Важно запомнить, что колбэки - просто функции, но которые выполнятся не сразу, по мере чтения кода, а тогда когда произойдет определенное событие. Ключ к пониманию механизма коллбэков лежит в том, что ты никогда не узнаешь *когда* (в какой момент времени) закончится асинхронная операция (I/O), но ты будешь уверен в том, **где** (после какого события) операция закончится - на последней строке асинхронной функции (т.е. колбэка)! Порядок объявления колбэков не имеет никакого значения и не влияет на последовательность выполнения. Значение имеет только их логическая вложенность, иерархичность если хотите. Сперва ты разбиваешь свой код на функции (как обособленные части кода) и только потом используешь колбэки, чтобы описать зависмости между их вызовами.

Снова вернемся к программе. Метод `fs.readFile`, предлагаемый Нодой, выполняется асинхронно и требует много времени для своего выполнения. Рассмотрим происходящее детально: для выполнения функции требуется обратиться к ОСи, которой надо обратиться к ФС, которая живет на диске, который совершает тысячи оборотов в минуту. Диску надо задействовать магнитную головку (а это уже физический уровень, между прочим) чтобы прочитать данные и отправить их обратно по всем уровням нашей программе. Ты передаешь методу `readFile` функцию-колбэк, которая и будет вызвана после того как данные от ФС будут получены. Колбэк поместит полученные данные в переменную и только теперь вызовет твою функцию-коллбэк уже с имеющей значение переменной (не undefined). В этом случае переменная называется `fileContents`, т.к. в ней лежит содержимое всего файла.

Вспомните пример с заказом и очередью из 1 части. Во многих ресторанах вам ставят на стол номер, пока вы ждете свой заказ. Это очень похоже на коллбэк. Эти номера говорят официантам, что нужно сделать когда ваш заказ будет готов.

Вернемся к нашему примеру и вынесем выражение `console.log` в отдельную функциию и передадим её как коллбэк:

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

Теперь функцию `logMyNumber` можно передать как аргумент, который станет "колбэчной" переменной уже внутри функции `addOne`. После окончания выполнения `readFile` будет вызвана переменная `callback` (именно вызвана как функция: `callback()`). Вызываться могут только фукнции, так что если передать туда что-то другое, то это приведет к ошибке.

В JS когда функция вызывается внутри другой функции (как `callback()`), то она будет выполнена сразу. В таком контексте выражение `console.log` выполнится как `callback`-параметр, который на деле есть функция `logMyNumber`. Запонмите важную вещь, когда вы *определяете* (*define*) функцию, это ещё ничего не говорит о том, когда она будет вызвана. Чтобы она сработала надо явно произвести её вызов (*invoke*).

Чтобы окончательно закончить разбор нашего пример, выпишем все программные действия в той последовательности, в которой они выполнятся при запуске программы:

- 1: Код "пропарсится" (The code is parsed), т.е. если в нем есть синтаксические ошибки, программа не запустится. В процессе "парсинга" будут определены переменные `fs` и `myNumber` и функции `addOne` и `logMyNumber`. Заметьте, что на этом этапе идут только определения. Ни одна функция пока не вызвана.
- 2: Когда выполнится последняя строка программы, будет вызвана функция `addOne` с функцией `logMyNumber` в качестве аргумента-колбэка. Вызове `addOne` приведет к запуску асинхронную функцию `fs.readFile`. Этой части программы нужно время, чтобы завершиться.
- 3: Сейчас Нода будет бездействовать и ждать пока выполнится функция `readFile`. Если бы у неё были ещё какие-то задачи - она занялась бы ими.
- 4: Как только `readFile` заканчивает работу, в дело вступает колбэк-функция `doneReading`, которая парсит `fileContents` в поиске целого числа. Результат `parseInt` присваивается `myNumber`-у, потом увеличивает его (`myNumber`) значение на 1 и затем сразу вызывается функция `addOne`, переданная как параметр `callback` в `logMyNumber`.

Пожалуй, самая непривычная часть программирования с колбэками - то как функции подобно объектам могут храниться в переменных и передаваться под разными именами. Давать простые и образные имена своим переменным - очень важное умение для программиста, особенно когда он пишет код, который будут читать другие люди. Читая Нода-программы, если ты видишь переменную с именем `callback` или `cb` - скорее всего здесь ожидается функция-колбэк.

Ты наверняка слышал такие понятия как событийно-ориентированное программирование ('evented programming') или "ивент луп" ('event loop') (умышленно не переводил чтобы не запутывать читателя абстрактными выражениями. если встретите где-нибудь понятие "событийный цикл" - знайте, это одно и то же. - прим. перев.). Они обозначают тот самый способ, которым реализован `readFile`. Сначала Нода отправляет на выполнение метод `readFile`, потом ждет, пока тот отправит ей "ивент" о своем окончании. В процессе ожидания Нода может проверять, есть ли ещё невыполненые операции. Внутри Ноды есть список запущенных, но ещё не законченных операций; Нода устроена так, что обходит этот список снова и снова пока какая-нибудь операция не завершится. По завершении, она считается обработанной (get 'processed') и все колбэки, которые были завязаны на её окончание будут вызваны.

Иллюстрация сказанного через псевдокод:

```js
function addOne(thenRunThisFunction) {
  waitAMinuteAsync(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

Представьте, что у вас есть 3 асинхронные функции `a`, `b` и `c`. Каждой из них на выполнение надо 1 минуту, после чего она передает управление своему колбэку (её первый аргумент). Если тебе понадобится вызвать их последовательно сначала `a`, потом `b`, потом `c`, можно написать так:

```js
a(function() {
  b(function() {
    c()
  })
})
```

Когда код начнет выполняться, `a` стартует сразу, затем через минуту она закончит выполнение и вызовется `b`, затем, ещё через минуту она закончит и вызовется `c` и наконец спустя 3 минуты, Нода остановится, потому что выполнять будет нечего. Есть и другие более выразительные способы чтобы описать приведенный пример, но суть в том, что если у тебя есть код который должен выполниться по окончании другого асинхронного кода, то тебе надо показать эту зависимость, поместив свой код в фукнцию и потом передать её как колбэк.

Такой способ построения программ требует не-линейного мышления. Рассмотрим список операций:

```
прочитать файл
обработать этот файл
```

Если перевести их в псевдокод, то мы получим:

```
var file = readFile()
processFile(file)
```

Такой тип линейного (последовательного, шаг-за-шагом) построения программ не работает в Ноде. Если код начнет выполняться в таком виде, то `readFile` и `processFile` будут выполняться одновременно. Так мы не сделаем зависимость на окончание выполнения `readFile`. Вместо этого, тебе надо указать что `processFile` должен дождаться окончания работы `readFile`. И это как раз то, для чего и нужны колбэки! А благодаря возможностям JS ты можешь описывать такие зависимости разными способами:

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}
```

Но ты можешь написать код по-другому и он тоже сработает:

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}

fs.readFile('movie.mp4', finishedReading)
```

Или даже так:

```js
var fs = require('fs')

fs.readFile('movie.mp4', function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
})
```

## События*

*События (Events) они же 'ивенты' - суть одно и то же, просто термины употребляются разными людьми в разных контекстах по-своему. Поэтому призываю не привязываться к словам, а зреть в корень. - прим. перев.

В Ноде, если тебе нужен модуль [events](https://nodejs.org/api/events.html) ты можешь использовать т.н. "генератор событий" ('event emitter'), который сам используется Нодой для своих API, к-ые что-то генерируют.

События - основной паттерн в программировании, более известный как "Наблюдатель" ['observer pattern'](https://en.wikipedia.org/wiki/Observer_pattern) или издатель\подписчик (publish/subscribe или совсем кратко 'pub/sub') . Поскольку колбэки реализуют модель отношений один-к-одному (one-to-one) между колбэком и тем кто его вызывает, события реализуют тот же паттерн для другого типа отношений - многие-ко-многим (many-to-many).

Принципы работы событий проще понять как некую подписку, они позволяют тебе "подписаться" на что-то, на совершение какого-то действия и твое гарантированное уведомление о нем. Ты можешь сказать "когда произойдет X сделать Y", в то время как простые колбэки (plain callbacks) понимали только "сделай X потом сделай Y". Т.о., подход событий более универсальный чем подход колбэков.

Несколько примеров использования (use cases) где события смогли бы заменить колбэки:

- Чат-комната (Chat room) где ты бы смог оповещать разных слушателей (listeners) о своих сообщениях
- Игровой сервер, которому нужно знать когда игроки подключились, отключились, переместились, ударили, прыгнули и т.п. (совершили игровые действия)
- Игровой движок где ты можешь позволить разработчикам подписываться на события примерно так: `.on('jump', function() {})`
- Низкоуровневый веб-сервер, для которого нужен открытый API, чтобы перехватывать события, например так `.on('incomingRequest')` или так `.on('serverError')`

Если попробовать написать модуль, который подключается к чат-серверу используя только колбэки, то это будет выглядеть примерно так:

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

Выглядит довольно неуклюже, поскольку все функции для вызова `.connect` надо передавать в одном месте и в определенном порядке. Напишем то же самое, но с помощью событий:

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

Похоже на вариант с чистыми колбэками (pure-callbacks), но вводит новый метод `.on`, к-ый и *подписывает* функцию-колбэк на определенный тип событий. Это значит, что ты можешь выбирать на какие события ты хочешь подписаться из `chatClient`. Ты даже можешь подписать на одно событие несколько разных колбэков:

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

## Потоки

На ранних стадиях развития Ноды API для работы с ФС и сетью пользовались своими собственными приемами в работе с потоками ввода/вывода (streaming I/O). Например, для файлов в файловых системах применялись так называемые «файловые дескрипторы», соответственно, модуль fs был наделён дополнительной логикой, позволяющей их отслеживать, в то время, как для сетевых модулей такая концепция не использовалась. Несмотря на незначительные отличия в семантиках подобно этим, на самом низком уровне, где надо было считывать и записывать данные обе кодовые базы во многом повтряли друг друга.
Команда, работающая над Нодой, осознала, что такое положение дел будет только путать разработчиков, которым придется изучать две группы семантик, чтобы сделать по сути одно и тоже. Они сделали новый API, который назвали `Потоком` (`Stream`) и переписали весь код для работы с ФС и сетью уже на нем. Главная задача Ноды - сделать работу с ФС и с сетями простой и удобной, поэтому было разумно иметь единый общий подход, который использовался бы повсюду. Главный плюс заключается в том, что большинство паттернов подобных этим на данный момент уже реализованы и маловероятно, что Нода в будущем сиьно изменится.

Есть 2 отличных ресурса, которые можно использовать для изучения потоков в Ноде. Первый - stream-adventure (см. раздел "Изучи Ноду интерактивно") и другой - справочник, называемый Stream Handbook.

### Stream Handbook

[stream-handbook](https://github.com/substack/stream-handbook#introduction) - гайд, похожий на этот, в котором есть ссылки на всё, что только может понадобиться при изучении потоков.

[![stream-handbook](stream-handbook.png)](https://github.com/substack/stream-handbook)

## Модули и npm. Экосистема Ноды

Ядро Ноды (Node core) основана на дюжине модулей, несколько низкоуровневых, таких как `events` and `stream` и несколько высокоуровневых типа `http` and `crypto`.

Node core is made up of about two dozen modules, some lower level ones like `events` and `stream` some higher level ones like `http` and `crypto`.

Такой дизайн выбран неслучайно. Node core изначально предполагалось сделать маленьким, и модули в ядре\коре будут направлены на обеспечение инструментов (тулз) для работы с базовыми I/O протоколами и форматами и был бы кросс-платформенным (независимым от платформы).

This design is intentional. Node core is supposed to be small, and the modules in core should be focused on providing tools for working with common I/O protocols and formats in a way that is cross-platform.


Для всего остального есть npm. Любой может создать новый модуль для Ноды, к-ый внесет дополнительные возможности и опубликовать его для npm. На момент написания этих строк (в оригинале - прим. перев.) на npm было около 34k модулей.

For everything else there is [npm](https://www.npmjs.com/). Anyone can create a new node module that adds some functionality and publish it to npm. As of the time of this writing there are 34,000 modules on npm.

### Как найти нужный модуль  How to find a module

Представьте, тебе надо сконвертить PDF файлы в текстовые. Начать стоит с ввода команды `npm search pdf`:

![pdfsearch](npm-search.png)

Imagine you are trying to convert PDF files into TXT files. The best place to start is by doing `npm search pdf`:

![pdfsearch](npm-search.png)

Он выдаст кучу результатов. npm очень популярен и обычно позволяет найти много возможных решений. Если ты будешь обходить каждый модуль и спускаться по спику рзультатов то увидишь более специфичные пакеты, вроде этих

There are a ton of results! npm is quite popular and you will usually be able to find multiple potential solutions. If you go through each module and whittle down the results into a more narrow set (filtering out things like PDF generation modules) you'll end up with these:

- [hummus](https://github.com/galkahana/HummusJS/wiki/Features) - c++ pdf manipulator
- [mimeograph](https://github.com/steelThread/mimeograph) - api on a conglomeration of tools (poppler, tesseract, imagemagick etc)
- [pdftotextjs](https://www.npmjs.com/package/pdftotextjs) - wrapper around [pdftotext](https://en.wikipedia.org/wiki/Pdftotext)
- [pdf-text-extract](https://www.npmjs.com/package/pdf-text-extract) - another wrapper around pdftotext
- [pdf-extract](https://www.npmjs.com/package/pdf-extract) - wrapper around pdftotext, pdftk, tesseract, ghostscript
- [pdfutils](https://www.npmjs.com/package/pdfutils) - poppler wrapper
- [scissors](https://www.npmjs.com/package/scissors) - pdftk, ghostscript wrapper w/ high level api
- [textract](https://www.npmjs.com/package/textract) - pdftotext wrapper
- [pdfiijs](https://github.com/fagbokforlaget/pdfiijs) - pdf to inverted index using textiijs and poppler
- [pdf2json](https://github.com/modesty/pdf2json/blob/master/readme.md) - pure js pdf to json


Есть многомодулей, к-ые дублируют функц-ть но предоставляют разные API и большинство зависят от других модулей и даже сторонних утилит

A lot of the modules have overlapping functionality but present alternate APIs and most of them require external dependencies (like `apt-get install poppler`).


Пример разных способов к пониманию модулей через описание:

Here are some different ways to interpret the modules:

- `pdf2json` единственный кто написан на чистом js, что означает что он проще остальных в утсановке, особенно на низкозарядных устройствах типа raspberry pi или на Windows, где нативный (привязанный к утсройству. чувствительный к устройству, на к-ом выполняется код) код не может быть перенесен на другую платформу
 

- `pdf2json` is the only one that is written in pure JavaScript, which means it is the easiest to install, especially on low power devices like the raspberry pi or on Windows where native code might not be cross platform.

- модули типа `mimeograph`, `hummus` и `pdf-extract` объединяют в себе много разных низкоуровневых модулей чтобы представить высокоуровневый API

- modules like `mimeograph`, `hummus` and `pdf-extract` each combine multiple lower level modules to expose a high level API

- много модулей используют под собой никсовские тулзы `pdftotext`/`poppler`

- a lot of modules seem to sit on top of the `pdftotext`/`poppler` unix command line tools

Давайте сравним `pdftotextjs` и `pdf-text-extract`, обе являются обертками вокруг утилиты `pdftotext`

Lets compare the differences between `pdftotextjs` and `pdf-text-extract`, both of which are are wrappers around the `pdftotext` utility.

![pdf-modules](pdf-modules.png)

Сходства:

Both of these:

- обновлены относительно недавно
- имеют свои репозитории на гитхабе (что очень важно)
- имеют READMEs
- каждую неделю устанавливают несколько новых пользователей
- находятся под открытой лицензией (т.е. может воспользоваться любой)

- were updated relatively recently
- have github repositories linked (this is very important!)
- have READMEs
- have at least some number of people installing them every week
- are liberally licensed (anyone can use them)


Посмотрим на `package.json` + статистику модуле. Сделать правильный выбор в таком вопросе совсем непросто. Сравним READMEs:

Just looking at the `package.json` + module statistics it's hard to get a feeling about which one might be the right choice. Let's compare the READMEs:

![pdf-readmes](pdf-readmes.png)

Обе имеют простые понятные описания, значки CI, инструкции по установке, примеры использования, инструкции по запуску тестов. Отлично! Но какой же выбрать? Сравним код внутри:

Both have simple descriptions, CI badges, installation instructions, clear examples and instructions for running the tests. Great! But which one do we use? Let's compare the code:

![pdf-code](pdf-code.png)

В `pdftotextjs` примерно 110 строк кода, а в `pdf-text-extract` около 40, но у обеих всё сводится по сути к одной строке:

`pdftotextjs` is around 110 lines of code, and `pdf-text-extract` is around 40, but both essentially boil down to this line:

```
var child = shell.exec('pdftotext ' + self.options.additional.join(' '));
```


Делает ли это одну лучше другой? Трудно сказать! Здесь важно самому прочитать код и сделать свои выводы. Если найдешь модуль, к-ый тебе понравится, набери `npm star modulename` - так можно сказать npm, что тебе понравилось пользоваться этим модулем.

Does this make one any better than the other? Hard to say! It's important to actually *read* the code and make your own conclusions. If you find a module you like, use `npm star modulename` to give npm feedback about modules that you had a positive experience with.



### Модульный подход к разработке Modular development workflow

npm отличается от большинства пакетных менеджеров тем, что устанавливает модули в папку внутри других существующих модулей. Это может быть непонятно сразу, но это чуть ли не ключевой фактор успеха npm.

npm is different from most package managers in that it installs modules into a folder inside of other existing modules. The previous sentence might not make sense right now but it is the key to npm's success.

Многие пакетные менеджеры (далее ПМ) устанавливают их глобально (т.е. пакеты доступны прямо из консоли - прим.). Например, Если набрать `apt-get install couchdb` на Debian Linux - он будет устанавливать последнюю стабильную версию (latest stable version) CouchDB. Теперь, если ты установишь CouchDB как зависмость от другого пакета\программы и эта программа требует более старой версии CouchDB, тотебе придется удалить свежую версию CouchDB и только после этого поставить более старую. У тебя не получится поставить две версии CouchDB потому что Debian ставит пакеты в одно место.

Many package managers install things globally. For instance, if you `apt-get install couchdb` on Debian Linux it will try to install the latest stable version of CouchDB. If you are trying to install CouchDB as a dependency of some other piece of software and that software needs an older version of CouchDB, you have to uninstall the newer version of CouchDB and then install the older version. You can't have two versions of CouchDB installed because Debian only knows how to install things into one place.

Это относится не только к Debian. Многие ПМы языков программирования работают по тому же принципу. Чтобы избежать конфликта зависимостей, описанного выше, есть виртуальное окружение (virtual environment), похожее на [virtualenv](http://python-guide.readthedocs.org/en/latest/dev/virtualenvs/) у Python или [bundler](http://bundler.io/) из мира Ruby. Они разбивают твое реальное\действительное окружение на мног овиртуальных, по одному на каждый проект, но внутри каждое из этих виртуальных окружений всё же установлены глобально %%% . Такие ВО не всегда решают проблему, иногда они только добавляют новых добавляя всё новые сложности.

Для npm установка глобальных модулей - антипаттерн (плохой подход). 

It's not just Debian that does this. Most programming language package managers work this way too. To address the global dependencies problem described above there have been virtual environment developed like [virtualenv](http://python-guide.readthedocs.org/en/latest/dev/virtualenvs/) for Python or [bundler](http://bundler.io/) for Ruby. These just split your environment up in to many virtual environments, one for each project, but inside each environment dependencies are still globally installed. Virtual environments don't always solve the problem, sometimes they just multiply it by adding additional layers of complexity. Также как ты не можешь использовать глобальные переменные в своих JS программах, ты также не сможешь установить модуль глобально (пока тебе не понадобится модуль с исполняемым файлом чтобы показать в твоем глобальном `PATH`, но тебе не всегда это пригодится -- больше об этом позже).

With npm installing global modules is an anti-pattern. Just like how you shouldn't use global variables in your JavaScript programs you also shouldn't install global modules (unless you need a module with an executable binary to show up in your global `PATH`, but you don't always need to do this -- more on this later).

#### Как работает `require`  How `require` works

Когда ты вызываешь `require('some_module')` в Ноде происходит следуюущее:

When you call `require('some_module')` in node here is what happens:

1. Если вызываемый файл `some_module.js` существует в текущей папке, то Нода его подгрузит, иначе
2. Нода просмотрит в текущей папке папку с именем `node_modules` и в ней папку с именем `some_module`
3. Если он и её не найдет, то он поднимется на 1 уровень вверх и повторит шаг 2

1. if a file called `some_module.js` exists in the current folder node will load that, otherwise:
2. node looks in the current folder for a `node_modules` folder with a `some_module` folder in it
3. if it doesn't find it, it will go up one folder and repeat step 2

Этот цикл повторится пока Нода не доберется до корневой папки ФС, оттуда он проверит все глобальные аппки модулей (такие как `/usr/local/node_modules` on Mac OS) и если всё ещё не найдет `some_module`, только тогда Нода выбросит эксепшн (throw an exception).


This cycle repeats until node reaches the root folder of the filesystem, at which point it will then check any global module folders (e.g. `/usr/local/node_modules` on Mac OS) and if it still doesn't find `some_module` it will throw an exception.

Здесь пример таког опоиска:
Here's a visual example:

![mod-diagram-01](mod-diagram-01.png)

Находясь в папке `subsubfolder` и вызвав `require('foo')`, Нода будет искать папку `subsubfolder/node_modules`. В этом случае он не найдет его -- папка здесь ошибочно названа `my_modules`. Тогда Нода поднимется вверх на 1 уровень и попробует исктаь снова, означая это тогда then looks for `subfolder_B/node_modules`, к-ой также не существует. Третья попытка - %%% 
хотя как `folder/node_modules` существует *и* имеет внутри себя папку `foo`. Если `foo` здесь не будет - Нода продолжит поиск в родительской директории.

When the current working directory is `subsubfolder` and `require('foo')` is called, node will look for the folder called `subsubfolder/node_modules`. In this case it won't find it -- the folder there is mistakenly called `my_modules`. Then node will go up one folder and try again, meaning it then looks for `subfolder_B/node_modules`, which also doesn't exist. Third try is a charm, though, as `folder/node_modules` does exist *and* has a folder called `foo` inside of it. If `foo` wasn't in there node would continue its search up the directory tree.

Заметим, что если вызываемая из `subfolder_B` Нода не найдет `subfolder_A/node_modules`, то она может только увидеть `folder/node_modules` поднимаясь вверх по дереву папок.

Note that if called from `subfolder_B` node will never find `subfolder_A/node_modules`, it can only see `folder/node_modules` on its way up the tree.

Одно из преимуществ npm в том что модули могут установливать свои засисимые модули, причем версии, к-ые специфичны для них самих. В этом случае, модуль `foo` крайне популярен - 3 копии пакета, каждая внутри родительской папки самогО модуля. Причной этому можеть быть то, что каждый родительский модуль нуждается в разной версии пакета `foo`, т.е. 'folder'у нужен `foo@0.0.1`, `subfolder_A`у нужен `foo@0.2.1` и т.д.

One of the benefits of npm's approach is that modules can install their dependent modules at specific known working versions. In this case the module `foo` is quite popular - there are three copies of it, each one inside its parent module folder. The reasoning for this could be that each parent module needed a different version of `foo`, e.g. 'folder' needs `foo@0.0.1`, `subfolder_A` needs `foo@0.2.1` etc.

Здесь показано, что произойдет когда мы исправим ошибку имени директории, сменив его с `my_modules` на правильное  `node_modules`:
Here's what happens when we fix the folder naming error by changing `my_modules` to the correct name `node_modules`:

![mod-diagram-02](mod-diagram-02.png)

Чтобы протестить какой конкретно модуль загружен Нодой, ты можешь вызвать команду `require.resolve('some_module')`, к-ая покажет путь к модулю, к-ый Нода нашла как результат обхода по дереву директорий. `require.resolve` может быть полезной когда двойная проверка этого модуля то что ты *ожидаешь*  загрузить и фактически загруженной -- иногда это разные версии одного модуля %%, для твоей текущей рабочей директории чем одна%%%%%%%

To test out which module actually gets loaded by node, you can use the `require.resolve('some_module')` command, which will show you the path to the module that node finds as a result of the tree climbing process. `require.resolve` can be useful when double-checking that the module that you *think* is getting loaded is *actually* getting loaded -- sometimes there is another version of the same module closer to your current working directory than the one you intend to load.

### Как писать модуль  How to write a module

После того, как ты узнал как искать модули и как загружать их в программу ты можешь начать писать свои модули.
Now that you know how to find modules and require them you can start writing your own modules.

#### Самый простой из возможных модулей  The simplest possible module

Модули Ноды крайне легковесны (lightweight). Один из самых простых модулей:
Node modules are radically lightweight. Here is one of the simplest possible node modules:

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

По умолчанию (By default), когда ты вызываешь `require('module')`, то Нода пробует загрузить `module/index.js`. С любым другим именем файла это не сработает, пока ты не укажешь его явно в файле `package.json` в поле `main`.


By default node tries to load `module/index.js` when you `require('module')`, any other file name won't work unless you set the `main` field of `package.json` to point to it.

Положи оба этих файла в папку `number-one` (значение `name` в `package.json` должно совпадать с именем папки) и ты получишь готовый рабочий модуль.

Put both of those files in a folder called `number-one` (the `name` in `package.json` must match the folder name) and you'll have a working node module.

Вызывая функцию `require('number-one')` получшиь значение чего-то `module.exports` что установлено внутри модуля.

Calling the function `require('number-one')` returns the value of whatever `module.exports` is set to inside the module:

![simple-module](simple-module.png)

Есть способ даже более скорый, чтобы создать модуль, выполните эти команды:

An even quicker way to create a module is to run these commands:

```sh
mkdir my_module
cd my_module
git init
git remote add git@github.com:yourusername/my_module.git
npm init
```

Запуская `npm init` создастся валидный (valid) `package.json` и если запустить его в существующем `git` репе он установит поле `repositories` внутри `package.json` автоматически.

Running `npm init` will create a valid `package.json` for you and if you run it in an existing `git` repo it will set the `repositories` field inside `package.json` automatically as well!

#### Добавление зависимостей Adding dependencies

У модуля может быть список других модулей из npm или GitHub в поле `dependencies` в файле `package.json`. Чтобы установить
модуль `request` как новую зависимость и сразу доавбить его в `package.json` выполните следующую команду в корневой папке модуля:


A module can list any other modules from npm or GitHub in the `dependencies` field of `package.json`. To install the `request` module as a new dependency and automatically add it to `package.json` run this from your module root directory:

```sh
npm install --save request
```

Этим ты установишь копию `request` в закрытую извне папку `node_modules` и сделает наш `package.json` похожим на этот:

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

По умолчанию, `npm install` подтягивает последнюю опубликованную версию модуля.

By default `npm install` will grab the latest published version of a module.

## Разработка клиента с npm.  Client side development with npm

Основное заблуждение о npm - то что  ___ в названии Ноду можно использовать только на сервере. Это совершенно не так. На самом деле, npm ставит?? для Ноды Packaged Modules, т.е., модули к-ые ::??? Модули сами по себе могут быть чем ты хочешь -- они просто аппка с файлами, собранная в архив и файлом `package.json`, к-й описывает версию модуля и сисок всех зависимостей (вместе с версиями этих модулей, так что рабочие вресии поставятся автоматически). Эта цепь оченьд линная, модули зависят од других модлуей, к-ые в свою очередь зависят от других и т.д.

A common misconception about npm is that since it has 'Node' in the name that it must only be used for server side JS modules. This is completely untrue! npm actually stands for Node Packaged Modules, e.g. modules that Node packages together for you. The modules themselves can be whatever you want -- they are just a folder of files wrapped up in a .tar.gz, and a file called `package.json` that declares the module version and a list of all modules that are dependencies of the module (as well as their version numbers so the working versions get installed automatically). It's turtles all the way down - module dependencies are just modules, and those modules can have dependencies etc. etc. etc.

[browserify](http://browserify.org/) is a utility written in Node that tries to convert any node module into code that can be run in browsers. Not all modules work (browsers can't do things like host an HTTP server), but a lot of modules on NPM *will* work.

To try out npm in the browser you can use [RequireBin](http://requirebin.com/), an app I made that takes advantage of [Browserify-CDN](https://github.com/jfhbrook/wzrd.in), which internally uses browserify but returns the output through HTTP (instead of the command line -- which is how browserify is usually used).

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

Or check out a [more complicated example](http://requirebin.com/?gist=679b58d4237eaca37173) (feel free to change the code and see what happens):

[![requirebin](requirebin.png)](http://requirebin.com/embed?gist=679b58d4237eaca37173)

## Going with the grain

Like any good tool, node is best suited for a certain set of use cases. For example: Rails, the popular web framework, is great for modeling complex [business logic](https://en.wikipedia.org/wiki/Business_logic), e.g. using code to represent real life business objects like accounts, loan, itineraries, and inventories. While it is technically possible to do the same type of thing using node, there would be definite drawbacks since node is designed for solving I/O problems and it doesn't know much about 'business logic'. Each tool focuses on different problems. Hopefully this guide will help you gain an intuitive understanding of the strengths of node so that you know when it can be useful to you.

### What is outside of node's scope?

Приципиально, Нода - лишь инструмент для управления I/O поверх ФС и сетью, и он не касается других более fancy возможностей для сторонних модулей. Здесь описаны несколько вещей к-ые лежат вне возможностей Ноды:

Fundamentally node is just a tool used for managing I/O across file systems and networks, and it leaves other more fancy functionality up to third party modules. Here are some things that are outside the scope of node:

#### Web frameworks

Несколько %%%, но Нода - не веб-фреймворк. Веб-фреймворки, к-ые написаны используя Ноду не всегда делают те же вещи ??

There are a number of web frameworks built on top of node (framework meaning a bundle of solutions that attempts to address some high level problem like modeling business logic), but node is not a web framework. Web frameworks that are written using node don't always make the same kind of decisions about adding complexity, abstractions and tradeoffs that node does and may have other priorities.

#### Language syntax

Нода использует JS и не собирается что-то менять. Felix Geisendörfer хорошо сказал по поводу стиля Ноды.
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

Node uses threads internally to make things fast but doesn't expose them to the user. If you are a technical user wondering why node is designed this way then you should 100% read about [the design of libuv](http://nikhilm.github.io/uvbook/), the C++ I/O layer that node is built on top of.

## License

![CCBY](CCBY.png)

Creative Commons Attribution License (do whatever, just attribute me)
http://creativecommons.org/licenses/by/2.0/

Donate icon is from the [Noun Project](https://thenounproject.com/term/donate/285/)
