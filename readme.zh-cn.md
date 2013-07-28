# Node的艺术
## Node.js入门

本文档假定读者已经懂了以下的两样东西：

- 懂得至少一种编程语言。例如：JavaScript，Ruby，Python，Perl或其他编程语言。如果你还不是程序员，你不懂编程语言，你可以阅读[JavaScript for Cats](http://jsforcats.com/)。:cat2:
- git和github。这是一个开源的协作工具，Node社区的用户使用git共享模块。你需要懂得基本操作就能了。这里有三篇很好的入门教程：[1](http://skli.se/2012/09/22/introduction-to-git/), [2](http://zachbruggeman.me/github-for-cats/), [3](http://opensourcerer.diy.org/)

This short book is a work in progress + I don't have a job right now (if I did I wouldn't have the time to write this). If you like it then please consider donating via [gittip](https://www.gittip.com/maxogden/) so that I can write more!

> 译者: 上面这段我没有翻译，因为我希望保持原文。上面作者提到，目前他还没找到工作。如果你喜欢这个文档，希望你可以通过[gittip](https://www.gittip.com/maxogden/)乐捐给作者。这样作者才能够写更多。

[![donate](donate.png)](https://www.gittip.com/maxogden/)

## 目录

- [了解Node](#node-1)
- [核心模块](#-1)
- [Callbacks](#callbacks)
- [Events](#events) (not written yet)
- [Streams](#streams) (not written yet)
- [Modules and NPM](#modules) (not written yet)
- [Going with the grain](#going-with-the-grain)
- [Real-time apps](#realtime) (not written yet)

## 了解Node

Node.js是一个开源项目，目的是让你通过编写JavaScript的程序进行网络、文件系统或其他I/O源的沟通。就这些！它只是一个简单而稳定的I/O平台，你可以在这个平台上架构模块。

有没有I/O出的例子？ 我这里有一张图，上面是我用Node.js制作的程序，你可以看到上面有很多I/O源：

![server diagram](server-diagram.png)

如果你无法明白上图显示的所有东西，这是没问题的。重点是你看到一个Node的运作（在中间六边形那个），它就像经纪人，管理全部I/O的端口（橙色和紫色的线条代表I/O）。

一般上我们编写的程序可以分为以下两类：

- 很难编写，但是效率超高（就像用C从零开始编写一个Web服务器）
- 很简单编写，但是不够效率/强大（就像有人上传5GB的文件去你服务器，但是服务器当机了）

Node设图做到平衡在这两者之间：在大多数用列做到高效运行，而且容易明白和开发。

Node不是以下两样东西：

  - 不是Web框架 （不像Rails或Django，尽管它可以被用来使这样的事情）
  - 不是编程语言（Node是使用JavaScript编程，它没有自己的编程语言）

相反，Node是：

  - 设计上简单，而且容易明白和使用的平台
  - 适合那些需要快速和处理很多I/O链接的程序

在基层，Node可以作为一种工具，并编写出以下两类程序：

  - 需要使用到Web协议（如：HTTP、TCP、UDP、DNS和SSL）的网络程序
  - 需要对文件系统或者本地进程/内存进行读入和读出操作的程序

什么是“I/O程序”？ 这里有一些常见的I/O源：

  - 资料库 （如：MySQL、PostgreSQL、MongoDB、Redis、CouchDB）
  - APIs（如：Twitter、Facebook、Apple Push Notifications）
  - HTTP/WebSocket的链接（从用户的Web应用程序）
  - 文件档（图像尺寸伸缩软件、视频编辑软件、网络收音机）

Node能够[异步处理](http://en.wikipedia.org/wiki/Asynchronous_I/O)多个不同种类的I/O源。比如说，假设你来到快餐店，你向店员要了一个芝士汉堡，他们会马上为你下单和准备汉堡。然后，他们会要求你在旁边等汉堡完成。在你等待这段时间，他们可以接受其他订单和帮其他人准备汉堡。试想下，如果你站在柜台前面，一直等到你的芝士汉堡完成，那么你就阻碍了后面的人下订单，厨师也不能帮其他人准备汉堡！我们称这个为**阻塞I/O**，因为一次只能处理一个I/O操作（厨师一次只能准备一个汉堡）。Node，不是这样的，它是**非阻塞**性质，就是说它能一次准备很多汉堡。

多谢Node非阻塞的性质，让我们可以实现以下这么有趣事情：

  - 控制[Quadcopters飞行](http://nodecopter.com)
  - 编写IRC谈天机器人
  - 制作一个[双脚走路的机器人](http://www.youtube.com/watch?v=jf-cEB3U2UQ)

## 核心模块

首先，你需要安装Node进去你的电脑。Node安装很简单，只需浏览[nodejs.org](http://nodejs.org)和点击`Install`.

Node拥有一组核心模块（通常被称为`Node核心`）提供公共 API 让你编程时候调用。我们可以调用`fs`模块来操作文件系统。当我们要进行网络操作时候，我们会调用网络模块，例如：`net`（TCP），`http`，`dgram`（UDP）。

除了`fs`和网络模块之外，Node核心还有很多其他的核心模块。如`dns`模块用来异步解析DNS查询。`os`模块可以用来收集操作系统的资讯，如tempdir的路径。`buffer`模块可以处理二进制数据。还有些模块可以处理URL和路径，如：`url`，`querystring`和`path`等等。大部分的核心模块都支持Node的主要使用目标：快速编写能够进行文件或网络操作的程序。

Node通过回调，事件，数据流和模块来控制I/O。如果你学会了这四样东西如何工作，那么你就能够灵活使用任何核心模块，而且你还会懂得模块的基本接口。

## 回调函数

你如果想真的弄明白怎么用Node，回调函数是你需要了解的东西中最重要的，没有之一。回调函数倒不是Node始创的，只不过这功能是JavaScript中尤其好用的一个。

This is the most important topic to understand if you want to understand how to use node. Nearly everything in node uses callbacks. They weren't invented by node, they are just a particularly useful way to use JavaScript functions.

回调函数不是同步执行的，或者是在将来执行。同步代码运行的顺序是从上至下，而非同步的程序却是在不同的时间运行不同的函数，基于某些函数的顺序和运行速度，包括HTTP请求和从文件系统里读取内容等等。

Callbacks are functions that are executed asynchronously, or at a later time. Instead of the code reading top to bottom procedurally, async programs may execute different functions at different times based on the order and speed that earlier functions like http requests or file system reads happen.

这种同步和非同步之间的差异可能会让人比较阔或，因为看一个函数是不是非同步，很大程度取决于具体的情况。下面是一个很简单的同步函数的例子：

The difference can be confusing since determining if a function is asynchronous or not depends a lot on context. Here is a simple synchronous example:

```js
var myNumber = 1
function addOne() { myNumber++ } // 定义函数
addOne() // run the function
console.log(myNumber) // 结果显示2
```

上面的代码定义了一个函数，然后调用了它，之间没有停留。当该函数被调用时，它立即把那个数字加上1，所以我们可以预见到，调用过函数后，那个数字的值会是2。

The code here defines a function and then on the next line calls that function, without waiting for anything. When the function is called it immediately adds 1 to the number, so we can expect that after we call the function the number should be 2.

现在假设我们把数字存在一个叫`number.text`的文件里：

Let's suppose that we want to instead store our number in a file called `number.txt`:

```js
var fs = require('fs') // require是Node提供的一个特别函数
var myNumber = undefined // 数字被存在文件里，因此我们并不知道它的值

function addOne() {
  fs.readFile('./number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // 结果显示undefined
```

这次为什么显示数字的值是`undefined`？因为在上面的代码中，我们用了`fs.readFile`这个方法，它恰好是个非同步方法。一般来说，需要和硬盘沟通或是从通信获得数据的，都是非同步的。只是需要从内存里或CPU里读些东西的话，就是同步的。这是因为I/O（输入输出）是非常非常非常慢的。如果要大概形容一下，从硬盘里读取大概比从内存里读取慢了10万倍。

Why do we get `undefined` when we log out the number this time? In this code we use the `fs.readFile` method, which happens to be an asynchronous method. Usually things that have to talk to hard drives or networks will be asynchronous. If they just have to access things in memory or do some work on the CPU they will be synchronous. The reason for this is that I/O is reallyyy reallyyy sloowwww. A ballpark figure would be that talking to a hard drive is about 100,000 times slower than talking to memory (RAM).

当这个程序运行的时候，所有的函数都马上被定义，但它们不是都马上被执行的。这是非同步编程的一个基础概念。当`addOne`被调用的时候，Node执行`readFile`这个方法，但不等到`readFile`结束，它就继续进行下一个不需要等待就能执行的函数了。如果没有可以执行的东西了，Node要么会停下来，等待文件读取或是网络通讯结束，要么就结束运行，返回到命令行。

When we run this program all of the functions are immediately defined, but they don't all execute immediately. This is a fundamental thing to understand about async programming. When `addOne` is called it kicks off a `readFile` and then moves on to the next thing that is ready to execute. If there is nothing to execute node will either wait for pending fs/network operations to finish or it will stop running and exit to the command line.

当`readFile`终于把文件读完的时候（需要的时间从几毫秒到几秒到几分钟不等，要看硬盘有多快），Node会执行`doneReading`这个函数，并把报的错和文件的内容传给它（如果读文件的时候有报错的话）。

When `readFile` is done reading the file (this may take anywhere from milliseconds to seconds to minutes depending on how fast the hard drive is) it will run the `doneReading` function and give it an error (if there was an error) and the file contents.

在上面的程序中，之所以显示`undefine`，是因为我们的代码并没有在任何地方注明了要`console.log`在文件读取完成后再打印出数字。

The reason we got `undefined` above is that nowhere in our code exists logic that tells the `console.log` statement to wait until the `readFile` statement finishes before it prints out the number.

如果你有一些想要反复执行的代码，你应该做的第一件事就把这些代码放在一个函数里。然后，在你需要执行那些代码的时候，调用这个函数就好了。给你的函数取一看就知道其功能的名字，会很有帮助。

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
