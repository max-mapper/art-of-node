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
- [Понимание Ноды](#understanding-node)
- [Базовые модули](#core-modules)
- [Колбэки] [Callbacks](#callbacks)
- [События / Событийная модель](#events)
- [Потоки в Ноде](#streams)
- [Модули и npm / Экосистема Ноды] [Modules and npm](#modules)
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

## Понимание Ноды

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

Нода выполняет операции ввода/вывода способом, к-ый называют асинхронным [asynchronous](https://en.wikipedia.org/wiki/Asynchronous_I/O). Такой способ позволяет ей выполнять много разных операций одновременно (simultaneously). Приведу небольшой пример для большего понимания. Например, зайдя в какой-нибудь фаст-фуд и заказав чизбургер, ваш заказ примут *сразу*, и после *небольшой задержки* заказ будет готов. Пока вы ждете, они могут принимать другие заказы и начать готовить чизбургеры для других людей. Представьте, что будет если вам придется ждать свой заказ, не давая остальным в очереди сделать заказ, пока они готовят ваш чизбургер! Такое поведение технически называется **блокирующая очередь**, ведь все операции ввода/вывода (по приготовлению чизбургеров) происходят по очереди. Нода же, наоборот, реализует механизм **неблокирующей очереди**, что позваоляет готовить мног очизбургеров одновременно.

Node does I/O in a way that is [asynchronous](https://en.wikipedia.org/wiki/Asynchronous_I/O) which lets it handle lots of different things simultaneously. For example, if you go down to a fast food joint and order a cheeseburger they will immediately take your order and then make you wait around until the cheeseburger is ready. In the meantime they can take other orders and start cooking cheeseburgers for other people. Imagine if you had to wait at the register for your cheeseburger, blocking all other people in line from ordering while they cooked your burger! This is called **blocking I/O** because all I/O (cooking cheeseburgers) happens one at a time. Node, on the other hand, is **non-blocking**, which means it can cook many cheeseburgers at once.

Эти вещи можно легко сделать с помощью Ноды, благодаря её неблокирующей природе\идее:
Here are some fun things made easy with node thanks to its non-blocking nature:
  
  - Механизм управления [летающими квадракоптерами]
  - Написать IRC чат-ботов
  - Создать [ходячих роботов]

  - Control [flying quadcopters](http://www.nodecopter.com/)
  - Write IRC chat bots
  - Create [walking biped robots](https://www.youtube.com/watch?v=jf-cEB3U2UQ)

## Базовые модули (Core modules)

Во-первых, установите Ноду себе на компьютер. Брать её лучше отсюда [nodejs.org](http://nodejs.org)
Firstly I would recommend that you get node installed on your computer. The easiest way is to visit [nodejs.org](http://nodejs.org) and click `Install`.

Нода сосоит из мелких базывых модулей (к-ые ещё называют одним термином 'Ядро Ноды' ('node core')) они предоставляют внешний API для написания программ. Каждый модуль предназначен для своих целей: для работы с файловой системой есть 'fs' модуль, для работы с сетями есть `net` (TCP), `http`, `dgram` (UDP).
Node has a small core group of modules (commonly referred to as 'node core') that are presented as the public API that you are intended to write programs with. For working with file systems there is the `fs` module and for networks there are modules like `net` (TCP), `http`, `dgram` (UDP).

Кроме модуля `fs` и сетевых модулей, есть и другие базовые модули. Для асинхронной работы с DNS-запросов есть модуль `dns`, для получения данных об ОСи есть `os`, для %%выделения бинарных фрагентов памяти%% есть `buffer`, модулия для парсинга урлов, путей к файлам и вообще парсинга (`url`, `querystring`, `path`) и др. Большинство, если не все базовые модули служат для одной главной\общей цели написание быстрых (!) программ через работу с ФС или сетью.
In addition to `fs` and network modules there are a number of other base modules in node core. There is a module for asynchronously resolving DNS queries called `dns`, a module for getting OS specific information like the tmpdir location called `os`, a module for allocating binary chunks of memory called `buffer`, some modules for parsing urls and paths (`url`, `querystring`, `path`), etc. Most if not all of the modules in node core are there to support node's main use case: writing fast programs that talk to file systems or networks.

Нода обрабатывает операции I/O через колбэки, события, потоки и модули. Если ты знаешь как работают эти 4 приема\сущности\вещи то ты сможешь понять\разобраться в любой боазовый модуль и понять как с ним надо работать \ его использовать.
Node handles I/O with: callbacks, events, streams and modules. If you learn how these four things work then you will be able to go into any module in node core and have a basic understanding about how to interface with it.

## Коллбэки Callbacks

Это, пожалуй, самая важная часть всего гайда, если ты хочешь разобраться в Ноде. Колбэки используются в Ноде почти везде \ повсеместно\повсюду. Они были придуманы ещё до создания Ноды, и вяляются чатью самого языка JavaScript.
This is the most important topic to understand if you want to understand how to use node. Nearly everything in node uses callbacks. They weren't invented by node, they are just part of the JavaScript language.

Коллбэки - функции, к-ые вызываются не сразу, а отложенно\асинхронно выполнению остального кода. В олчие от \ Если обычно код читается и выполняется посоедедоватьельно сверху вниз, асинк программы могут выполнять разные функции в разное время \ в другом порядке .... ????
Callbacks are functions that are executed asynchronously, or at a later time. Instead of the code reading top to bottom procedurally, async programs may execute different functions at different times based on the order and speed that earlier functions like http requests or file system reads happen.

Поначалу такое отличие сбиавет столку, если ф-ия асинк или не зависит от контекста. РАзберем простой пример синхронног овыполнения, где код выполняется последовательно сверху вниз.
The difference can be confusing since determining if a function is asynchronous or not depends a lot on context. Here is a simple synchronous example, meaning you can read the code top to bottom just like a book:

```js
var myNumber = 1
function addOne() { myNumber++ } // определяем функцию (define the function)
addOne() // запускаем\выполняем её (run the function)
console.log(myNumber) // logs out 2
```

В коде определяется\объявляется ф-ия и на след строке идет её вызов, без задержек и пауз. Когда ф-я вызывается число сразу (!) увеличивается на 1, т.е. мы уверены, что после вызова ф-ии число станет равно 2. Это и есть предсказуемость синхр кода - он выполняется последовательно сверху вниз.
The code here defines a function and then on the next line calls that function, without waiting for anything. When the function is called it immediately adds 1 to the number, so we can expect that after we call the function the number should be 2. This is the expectation of synchronous code - it sequentially runs top to bottom.

Но Нода, часто использует асинк модель выполнения. С помощью Ноды прочитаем число из файла `number.txt` (файл - находится на диске, а значит будем исп-ть содуль `fs` - прим. переводчика)
Node, however, uses mostly asynchronous code. Let's use node to read our number from a file called `number.txt`:

```js
var fs = require('fs') // подключение модуля для работы с ФС require is a special function provided by node
var myNumber = undefined // сейчас мы не знаем какое число записано в файле (we don't know what the number is yet since it is stored in a file)

function addOne() {
  fs.readFile('number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // logs out undefined -- this line gets run before readFile is done
```

Почему же после вызова ф-ии мы получили `undefined`? ОБратите внимание, в коде мы исп-ем асинк-метод `fs.readFile`. Обычно, для работы с операциями чтения-записи на диск или с сетью делают асинхр-ми. Если же им надо обратиться напрямую к памяти или заюзать возможности проца - то их делают синхр-ыми. Дело в том, что операции I/O слишком, даже слишком медленные (это важно, т.к. относится не только кНоде но и ко всем языкам\технологиям - прим. перев). Стоит сказать, что чтение с диска происходит медленнее чем из памяти (RAM) примерно в 100k раз.
Why do we get `undefined` when we log out the number this time? In this code we use the `fs.readFile` method, which happens to be an asynchronous method. Usually things that have to talk to hard drives or networks will be asynchronous. If they just have to access things in memory or do some work on the CPU they will be synchronous. The reason for this is that I/O is reallyyy reallyyy sloowwww. A ballpark figure would be that talking to a hard drive is about 100,000 times slower than talking to memory (e.g. RAM).

Когда мы запустим программу, ф-ции определятся%%%% сразу, но выполнятся они не сразу. Это фундаментальная и ключевая вещь для понимания асинк-программирования. Если Ноде нечего выполнять, она будет просто висеть в ожидании окончания операций IO или сетевых операций или остановит свое выполнение.%%%%
When we run this program all of the functions are immediately defined, but they don't all execute immediately. This is a fundamental thing to understand about async programming. When `addOne` is called it kicks off a `readFile` and then moves on to the next thing that is ready to execute. If there is nothing to execute node will either wait for pending fs/network operations to finish or it will stop running and exit to the command line.

Когда `readFile` прочитает файл (это может занять некторое время (от несолкьких мс до неск-их минут), в зависимости от того как быстро происходит чтение с диска), следом будет выполняться ф-ия `doneReading` и выдаст содержимое файла (если чтение прошло успешно) или ошибку.
When `readFile` is done reading the file (this may take anywhere from milliseconds to seconds to minutes depending on how fast the hard drive is) it will run the `doneReading` function and give it an error (if there was an error) and the file contents.

Мы получили на выходе `undefined` потому что нигде в нашем коде нет указания выражению\ф-ии `console.log` дождаться окончания выполнения `readFile` до того как вывести число.
The reason we got `undefined` above is that nowhere in our code exists logic that tells the `console.log` statement to wait until the `readFile` statement finishes before it prints out the number.

%%% важно и непонятно
Если ты хочешь чтобы код всегда выполнялся последовательно, почле прочтения файла тебе надо полжить код внутрь ф-ии-коллбэка. Тогда ты сможешь вызвать ф-ию откуда захочешь. Это подтолкнет тебя давать ф-ям описательные\точные названия\имена.
If you have some code that you want to be able to execute over and over again, or at a later time, the first step is to put that code inside a function. Then you can call the function whenever you want to run your code. It helps to give your functions descriptive names.

ВАЖНО!!
Запомните, что коллбэки - просто функции, к-ые выполнются не сразу, по мере чтения кода. Ключ к пониманию мехниазма коллбэков в том, что ты никогда не узнаешь когда они выполнятся, но ты должен быть\будешь уверен в том, **когда** (после какого события) опреция закончится - на псоледней строке асинк-фии (т.е. коллбэка). Порядок объявления коллбэков не имеет никакого значения и евлияет на посдеоватльность вызовов, это говорит только на их логическую вложенность\иерархичность если хотите. Сперва ты разбиваешь свой код на функции (обособленные части кода) и только потом используешь коллбэки, чтобы описать зависмости между вызовами, посдеоватлеьность их вызовов\выполнения.
Callbacks are just functions that get executed at some later time. The key to understanding callbacks is to realize that they are used when you don't know **when** some async operation will complete, but you do know **where** the operation will complete — the last line of the async function! The top-to-bottom order that you declare callbacks does not necessarily matter, only the logical/hierarchical nesting of them. First you split your code up into functions, and then use callbacks to declare if one function depends on another function finishing.

%%Метод `fs.readFile` выполнится нодой асинхронно и требует много времени чтобы завершить своё выполнение. Рассмотрим происходящее детально: для выполнения ей надо оратиться к ОСи, к-ая затем обратится к ФС, к-ая сама живет на диске, к-ый совершает тысячи оборотов в минуту. Затем ему надо задействовать магнитную головку (а это уже физ уровень, между прочим) чтобы прочитать данные и отправить их обратно через все пройденные уровни обратно нашей программе. Ты передаешь методу `readFile` ф-ию - коллбэк к-ая и будет вызвана после того как данные будут получены от ФС. ФС вернет\положит данные в переменную и вызовет твою ф-ию-коллбэк уже со значением переменной. В этом случае переменная называлась `fileContents` т.к. содержит содержимое всего файла, к-ый был прочитан.
The `fs.readFile` method is provided by node, is asynchronous, and happens to take a long time to finish. Consider what it does: it has to go to the operating system, which in turn has to go to the file system, which lives on a hard drive that may or may not be spinning at thousands of revolutions per minute. Then it has to use a magnetic head to read data and send it back up through the layers back into your javascript program. You give `readFile` a function (known as a callback) that it will call after it has retrieved the data from the file system. It puts the data it retrieved into a javascript variable and calls your function (callback) with that variable. In this case the variable is called `fileContents` because it contains the contents of the file that was read.

Вспомните пример с рестораном %%%% в нчале туториала. Во многих ресторанах вам ставят на стол номер, пока вы ждете свой заказ. Это очень похоже на коллбэк. Эти номера говорят офииантам, что делать когда твой заказ будет готов.
Think of the restaurant example at the beginning of this tutorial. At many restaurants you get a number to put on your table while you wait for your food. These are a lot like callbacks. They tell the server what to do after your cheeseburger is done.

Вернемся к нашему примеру и вынесем выражение `console.log` в отдельную ф-ию (обособленную\самостоятельную часть кода) и передадим её как коллбэк:
Let's put our `console.log` statement into a function and pass it in as a callback:

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

Теперь ф-ию `logMyNumber` можно передать как аргумент к-ый станет коллбэком\колбэчной переменной внутри ф-ии `addOne`. После окончания выполнения `readFile` будет вызвана `callback` переменная (именно вызвана как ф-ия: `callback()` ). Вызываться могут тлько фукнции, так что если ты передашь туда что-то другое, то это приведет к ошибке.
Now the `logMyNumber` function can get passed in as an argument that will become the `callback` variable inside the `addOne` function. After `readFile` is done the `callback` variable will be invoked (`callback()`). Only functions can be invoked, so if you pass in anything other than a function it will cause an error.

Когда ф-ия вызывается внутри другой ф-ии как `callback()`, то ф-я будет выполнена сразу. В этом случае наше выражение лога выполнится как `callback`, к-ая на самом деле подставится ф-ия `logMyNumber`. Запонмите важную вещь, когда вы объявляете\определяете\*define* функцию, это ещё ничего неговорит о порядке её выполнения. Чтобы она сработала её надо именно вызвать\сделать её вызов\*invoke*.
When a function gets invoked in javascript the code inside that function will immediately get executed. In this case our log statement will execute since `callback` is actually `logMyNumber`. Remember, just because you *define* a function it doesn't mean it will execute. You have to *invoke* a function for that to happen.

Чтобы окончательно закончить разбор нашег опример, выпишем все программные действия в тоё последовательности, в -кой они сработают при запуске программы:
To break down this example even more, here is a timeline of events that happen when we run this program:

- 1: Код "пропарсится", т.е.если в нем есть синтакс ошибки программа не запсутится. По мере парсинга будут определены переменные `fs` and `myNumber`, объявленные как переменные. Термы `addOne` и `logMyNumber` будут описаны как функции. Заметьте, что на этом этапе тоолько обявления\определения. Ни одна функция пока не вызвана (*invoked*).
- 2: Когда выполнится последняя строка программы, будет вызвана ф-ия `addOne` с ф-ией `logMyNumber`, переданная её как коллбэк-аргумент. Вызов `addOne` сперва запустит асинк-фию `fs.readFile`. На этом часть программы закончит свое выполнение.
- 3: Сейчас Нода будет бездействовать и ждать пока ф-ия `readFile` закончит выполнение. Если бы ноде надо было что-то сдлеать - в это время - она оставалсь доступной и была готова к работе.
- 4: Как только `readFile` заканчивает работу, его ф-ия коллбэк `doneReading` (см. кишки readfile), к-ая парсит `fileContents` в поиске целого числа, вызванный `myNumber`-ом, увеличит его значение (`myNumber`) и затем сразу вызовет ф-ию `addOne` переданную в его коллбэк `logMyNumber`. ПЕРЕЧИТАТЬ И ПРОВЕРИТЬ!!
- 1: The code is parsed, which means if there are any syntax errors they would make the program break. During this initial phase, `fs` and `myNumber` are declared as variables while `addOne` and `logMyNumber` are declared as functions. Note that these are just declarations. Neither function has been called nor invoked yet.
- 2: When the last line of our program gets executed `addOne` is invoked with the `logMyNumber` function passed as its `callback` argument. Invoking `addOne` will first run the asynchronous `fs.readFile` function. This part of the program takes a while to finish.
- 3: With nothing to do, node idles for a bit as it waits for `readFile` to finish. If there was anything else to do during this time, node would be available for work.
- 4: As soon as `readFile` finishes it executes its callback, `doneReading`, which parses `fileContents` for an integer called `myNumber`, increments `myNumber` and then immediately invokes the function that `addOne` passed in (its callback), `logMyNumber`.


Пожалуй, самая непривычная часть прогр-ия с коллбэками - это то каак ф-ии как обэекты могут храниться в перемнных и передаваться под разными именами. Давая простые и образные имена своим переменным - очень важное умение для программиста, когда он пишет код не только для себя. Как правило, если ты видишь переменную с именем `callback` или `cb` - скорее всего это будет ф-ия.
Perhaps the most confusing part of programming with callbacks is how functions are just objects that can be stored in variables and passed around with different names. Giving simple and descriptive names to your variables is important in making your code readable by others. Generally speaking in node programs when you see a variable like `callback` or `cb` you can assume it is a function.

Ты наверняка слышал понятия событийно-ориентированное программирование ('evented programming') или "эвент луп" ('event loop' - переводить не имеет смысла). Они обзначают тот самый способ, к-ым реализована ф-ия `readFile`. Нода сперва %%%%  Пока операция выполняется, Нода проверяет на другие возможные события. Внутри Ноды есть список вещей, к-ые диспатчатся но ещё не возварщенные, так что петли Ноды через список снова и снова проверяет, закончились ли они. После того как они закончатся они примут статус 'обработан' ('processed'), т.е. начнут выполняться те ф-ии-коллбэки, к-ые были завязаны на их окончание.
You may have heard the terms 'evented programming' or 'event loop'. They refer to the way that `readFile` is implemented. Node first dispatches the `readFile` operation and then waits for `readFile` to send it an event that it has completed. While it is waiting node can go check on other things. Inside node there is a list of things that are dispatched but haven't reported back yet, so node loops over the list again and again checking to see if they are finished. After they finished they get 'processed', e.g. any callbacks that depended on them finishing will get invoked.

Небольшая иллюстрация описанного примера:
Here is a pseudocode version of the above example:

```js
function addOne(thenRunThisFunction) {
  waitAMinuteAsync(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

Предстаьте, что у етбя есть 3 асинк-ф-ции `a`, `b` и `c`. Каждая из них бурет 1 минуту для запуска и после заканчивает свой вызов коллбэком (к-ый передан епрвым аргументом) !!! Прим. коллбэк - муж. род, но под ним подразум-ся ф-ия - жен. род !!!. Если тебе понадобится вызвать их последоватльно сначла а, потом б, потом ц, можно написать так:
Imagine you had 3 async functions `a`, `b` and `c`. Each one takes 1 minute to run and after it finishes it calls a callback (that gets passed in the first argument). If you wanted to tell node 'start running a, then run b after a finishes, and then run c after b finishes' it would look like this:

```js
a(function() {
  b(function() {
    c()
  })
})
```

Когда код начнет выполняться , а стартует сразу, затем через минуту она закончит выполнение и вызовется Б, затем, ещё через минуту она закончит и вызовется Ц и наконец, спустя 3 минуты, Нода остановит выполнеие, выполнять будет больше нечего. Есть гораздо более элегенатные выразительные способы чтобы описать приведенный пример, но суть в том что если у тебя есть код к-ый должен дождаться чтобы начать выполняь другой асинк-код, то тебе надо выразить свое намерение\зависимость через указаник в коде какую функцию передать в качестве колбэка%%%%
When this code gets executed, `a` will immediately start running, then a minute later it will finish and call `b`, then a minute later it will finish and call `c` and finally 3 minutes later node will stop running since there would be nothing more to do. There are definitely more elegant ways to write the above example, but the point is that if you have code that has to wait for some other async code to finish then you express that dependency by putting your code in functions that get passed around as callbacks.

Такой способ построения программ требует не-линейного мышления. Рассмотрим список\набор операций
The design of node requires you to think non-linearly. Consider this list of operations:

```
прочитать файл
обработать этот файл
```

```
read a file
process that file
```

Если переводить их в псевдокод, то получим:
If you were to turn this into pseudocode you would end up with this:

```
var file = readFile()
processFile(file)
```

Такой тип линейного (последовательного, шаг-за-шагом) построения программ не работает\подходит\используется в Ноде. Если код начнет выполняться в таком виде, то `readFile` и `processFile` будут выполняться строго одновременно. Так мы не сделаем звисмость на коончание выполнения `readFile`. Вместо этого, тебе надо указать что `processFile` завязан (зависит от окончания) на окончание работы `readFile`. И это как раз то, для чего и нужны коллбэки! А поскольку это возможности JS ты можешь описывать такие зависимости разными способами:%%
This kind of linear (step-by-step, in order) code isn't the way that node works. If this code were to get executed then `readFile` and `processFile` would both get executed at the same exact time. This doesn't make sense since `readFile` will take a while to complete. Instead you need to express that `processFile` depends on `readFile` finishing. This is exactly what callbacks are for! And because of the way that JavaScript works you can write this dependency many different ways:

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}
```

Но ты также можешь написать код по-другому и он тоже сработает:
But you could also structure your code like this and it would still work:

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}

fs.readFile('movie.mp4', finishedReading)
```

Или даже так:
Or even like this:

```js
var fs = require('fs')

fs.readFile('movie.mp4', function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
})
```

## События (Эвенты\ИвЭнты) Events

В Ноде, если тебе нужен модуль [events](https://nodejs.org/api/events.html) ты можешь использовать т.н. 'event emitter' (излучатель событий - гораздо лучше запонмить англ. название), к-ый сам используется Нодой для всех API, к-ые отправляют сигналы.
In node if you require the [events](https://nodejs.org/api/events.html) module you can use the so-called 'event emitter' that node itself uses for all of its APIs that emit things.

События - основной паттерн в программировании, более известный как "Наблюдатель" ['observer pattern'](https://en.wikipedia.org/wiki/Observer_pattern) или 'pub/sub' (publish/subscribe) издатель\подписчик. Посольку коллбэки реализуют модель один-к-одному (one-to-one) отношений между коллбэком тем кто его вызывает, события реализуют API для другого типа отношений - многие-ко-многим (many-to-many).

Events are a common pattern in programming, known more widely as the ['observer pattern'](https://en.wikipedia.org/wiki/Observer_pattern) or 'pub/sub' (publish/subscribe). Whereas callbacks are a one-to-one relationship between the thing waiting for the callback and the thing calling the callback, events are the same exact pattern except with a many-to-many API.

Самый простой способ понять механику событий - позволить тебе "подписаться" на происходящие события. Ты можешь сказать "когда произойдет X сделать Y", в то время как с чистыми колбэками можно было разговаривать только "сделай X потом сделай Y". Т.е. подход событий более общий\универсальный.
The easiest way to think about events is that they let you subscribe to things. You can say 'when X do Y', whereas with plain callbacks it is 'do X then Y'.

РАссмотрим несколько случаев\юз-кейсов (use cases) где ивенты смогли бы заменить коллбэки:
Here are few common use cases for using events instead of plain callbacks:

- Чат-комнату (Chat room) где ты бы смог оповещать разных слушателей\участников\чатеров\лиснеров (listeners) своими сообщениями
- Игровой сервер, к-му нужно знать когда игроки подключились, отключились, переместились (в игре), ударили, прыгнули и т.п.
- Игровой движок где ты мог позволить рзработчикам подписаться на события вида `.on('jump', function() {})`
- Низкоуровневый веб-сервер, к-ый хочет открыть API чтобы просто перехватывать в события, например так `.on('incomingRequest')` или так `.on('serverError')`

- Chat room where you want to broadcast messages to many listeners
- Game server that needs to know when new players connect, disconnect, move, shoot and jump
- Game engine where you want to let game developers subscribe to events like `.on('jump', function() {})`
- A low level web server that wants to expose an API to easily hook into events that happen like `.on('incomingRequest')` or `.on('serverError')`

Если попробовать написать модуль, к-ый подключается к чат-серверу используя только колбэки, то это будет выглядеть примерно так:


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

Выглядит дейтсивтельно топрно\неуклюже, поскольку все ф-ии для вызова `.connect` надо передавать в заранее пор-ом порядке. Напишем то же самое, но с помощью ивентов:

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

Это похоже на вариант с колбэками, но привносит\добавляет метод `.on`, к-ый "подписывает" колбэк на событие, как человек подписывается на газету или новости с сайта. Это значит, что ты можешь выбрать на какие события ты хочешь подписаться из `chatClient`. Ты даже можешь подписаться на одно событие несколько раз разными колбэками.

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

## Потоки (Стримы) Streams

%%%%%,, Например, любой файл в ФС имеет свой укникальный файл-дескриптор ('file descriptor'), так что модуль `fs` имеет дополнитлеьную логику чтобы хранить следы, тогда как сетевые модули такой возможности не имеют. Несмотря на важные отличия в семнтике подобной этой %%% , фундаментальный\базовый уровень обеих групп кода были продублированы в большинстве функциональностей%%%%, когда приходилось читать и писать данные. Совместаня работа на Ноде реализовалась так что это могло запутать, пока приходилось разобраться двух разных семантиках, чтобы по сути сдлеать одну и ту же вещь так что они сделали новый API и назвали `Stream` и написали весь сетевой код и код ФС используя уже новый АПИ.

Early on in the node project the file system and network APIs had their own separate patterns for dealing with streaming I/O. For example, files in a file system have things called 'file descriptors' so the `fs` module had to have extra logic to keep track of these things whereas the network modules didn't have such a concept. Despite minor differences in semantics like these, at a fundamental level both groups of code were duplicating a lot of functionality when it came to reading data in and out. The team working on node realized that it would be confusing to have to learn two sets of semantics to essentially do the same thing so they made a new API called the `Stream` and made all the network and file system code use it. 


Главная задача Ноды - сделать простой и удобной работу с ФС и с сетями, так что сделано понятно чтобы иметь один образец\эталон\пример, к-ый бы использовался везде. Главный плюс заключается в том, что большинство паттернов похожих на этот  (здесь только несколько вариантов\путей) %%%%%%

The whole point of node is to make it easy to deal with file systems and networks so it made sense to have one pattern that was used everywhere. The good news is that most of the patterns like these (there are only a few anyway) have been figured out at this point and it is very unlikely that node will change that much in the future.

Есть 2 отличных ресурса, к-ые можно использовать для изучения стримов\потоков Ноды. Первый - stream-adventure (см. блок Learn Node Interactively) и другой - справочник, называемый (Stream Handbook).

There are already two great resources that you can use to learn about node streams. One is the stream-adventure (see the Learn Node Interactively section) and the other is a reference called the Stream Handbook.

### Stream Handbook

- гайд, похожий на этот, в к-ом есть справочник для всего что только тебе может понадобиться при изучении стримов.
[stream-handbook](https://github.com/substack/stream-handbook#introduction) is a guide, similar to this one, that contains a reference for everything you could possibly need to know about streams.

[![stream-handbook](stream-handbook.png)](https://github.com/substack/stream-handbook)

## Модули Modules

База Ноды (Node core) основана на дюжине модулей, несколько низкоуровневых, таких как `events` and `stream` и несколько высокоуровневых типа `http` and `crypto`.

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
