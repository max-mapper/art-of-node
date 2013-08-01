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

如果想真的弄明白怎么使用Node，回调函数是你需要了解的东西中最重要的，没有之一。回调函数倒不是有了Node后才有的，只不过这功能是JavaScript中尤其好用的一个。

回调函数是指非同步执行的，或者是在将来某个时间才会被执行的函数。同步代码运行的顺序是从上至下，而非同步的程序却是在不同的时间运行不同的函数，这些事件都基于某些某同步函数的顺序和运行速度，包括HTTP请求和从文件系统里读取内容等等。

这种同步和非同步之间的差异可能会让人比较困惑，因为看一个函数是不是非同步，很大程度上取决于具体的情况。下面是一个很简单的同步函数的例子：

```js
var myNumber = 1
function addOne() { myNumber++ } // 定义函数
addOne() // run the function
console.log(myNumber) // 结果显示2
```

上面的代码定义了一个函数，然后调用了它，之间没有任何停留。当该函数被调用时，它立即把那个数字加上1，所以我们可以预见到，调用过该函数后，那个数字的值会变成2。

现在假设我们把数字存在一个叫`number.text`的文件里：

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

为什么这些显示出来的值是`undefined`？因为在上面的代码中，我们用了`fs.readFile`这个方法，而它恰好是个非同步方法。一般来说，需要和硬盘沟通或是从通信网络获得数据的，都是非同步的。只是需要从内存里或CPU里读些东西的话，就是同步的。这是因为I/O（输入输出）是非常非常非常慢的。如果要大概形容一下，从硬盘里读取大概比从内存里读取慢了10万倍。

当这个程序运行的时候，所有的函数都马上被定义，但它们不是马上都被执行的。这是非同步编程的一个基础概念。当`addOne`被调用的时候，Node执行`readFile`这个方法，但不等到`readFile`结束，它就继续进行下一个不需要等待就能执行的函数了。如果没有可以执行的东西了，Node要么会停下来，等待文件读取或是网络通讯结束，要么就结束运行，返回到命令行。

当`readFile`终于把文件读完的时候（需要的时间从几毫秒到几秒到几分钟不等，要看硬盘有多快），Node会执行`doneReading`这个函数，并把报的错（如果读文件的时候有报错的话）和文件的内容传给它。

在上面的程序中，之所以会显示`undefine`，是因为我们的代码并没有在任何地方注明了要在文件读取完成后再`console.log`出数字。

如果你有一些想要反复执行的代码，你应该做的第一件事就是把这些代码放在一个函数里。然后，在你需要执行那些代码的时候，调用这个函数就好了。你给函数起的名字最好能让人一看就知道这个函数是做什么的。

回调函数，不过是在将来某个时间被执行的函数。要理解回调函数，很关键的一点是它被使用的时机。你使用回调函数的前提是，你不知道**什么时候**某个非同步进程会结束，但知道这个进程会在**哪里**结束————就在那个非同步函数的最后一行！你在什么地方声明这些函数并不重要，重要的是这些函数之间的逻辑顺序。把代码分装进各个函数之后，如果一个函数的执行取决于另一个函数何时结束，就该使用回调函数了。

上面代码中的`fs.readFile`方法是Node自带的，这个方法是非同步的，而且要花费很长时间。想想看它要做多少事情：它要进入操作系统，进入文件系统，文件系统可是在硬盘上的，硬盘可能转得飞快，也可能根本就不转。然后它要用激光读出数据，并把数据传回你的JavaScript程序。当你给了它一个回调函数后，它就可以在成功从文件系统中取得数据以后，调用那个回调函数。它会把数据放在一个变量里，交给你给的回调函数，我们给这个变量起的名字叫做`fileContents`，因为变量中包含的是读取到的文件内容。

想想看这个教程刚开始时的那个餐厅的例子。在很多餐厅，在你点的菜上来之前，服务生会放一个数字牌在你桌上。这个和回调函数很类似。回调函数的作用就是告诉服务器在你的芝士汉堡好了后要做些什么。

现在，让我们把`console.log`放进一个函数里作回调函数使用吧。

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

现在`logMyNumber`这个函数可以被传给`addOne`作为回调函数了。在`readFile`完成后，`callback`这个变量会被执行（也就是`callback()`)。只有函数才能被执行，所以如果你提供一个不是函数的东西，程序会出错。

在JavaScript里，当函数被调用，其包含的代码会立刻被执行。在这个例子里，`console.log`会被执行，因为`callback`其实就是`logMyNumber`。要记得，你*定义*了一个函数，不代表它会执行！你一定得*调用*它才行。

如果要更细地分析一下这个例子，下面是按时间顺序排列的所有发生的事件：

- 1: 代码被分析，这时，如果有任何语法错误，程序会停止并报错。
- 2: `addOne`被调用，以`logMyName`作为它的回调函数，也就是我们想在`addOne`结束后执行的函数。接下来，非同步的`fs.readFile`马上开始运行。这个部分要花上点时间。
- 3: Node暂时没事做的，于是它就闲下来等待着`readFile`结束。
- 4: `readFile`结束了，`doneReading`这个函数被调用，它把数字加上1然后马上调用回调函数————也就是我们传给`addOne`的`logMyNumber`。

也许关于回调函数最难理解的部分是，为什么函数可以被存在变量里被传来传去，而且还有着变来变去的名字。要让你的代码更容易被看懂，给你的函数起简单明了的名字是很重要的一部分。总的来说，在使用Node时，如果你看见一个变量叫做`callback`或是它的缩写`cb`，你差不多可以确定它就是一个函数。

你可能听过一个术语叫“事件驱动式编程”，或者叫“事件循环”。`readFile`这类的函数就利用了“事件循环”。Node首先开始运行`readFile`，并等待着`readFile`发回一个事件。在Node等待的这段时间，它可以继续运行其他的东西。在Node里有一个列表，里面记下了所有开始运行却还没有发回结束信号的事，Node就一遍遍循环检查这个列表，看看有没有事情完成了。它们运行完之后，就会被Node处理掉，也就是说，需要运行的回调函数会被运行。

下面是上面例子的伪代码写法：

```js
function addOne(thenRunThisFunction) {
  waitAMinute(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

假设你有三个非同步函数：`a`、`b`，和`c`。它们要花上一分钟来运行，运行完了之后会调用一个回调函数（函数以第一个参数的形式被传进函数）。如果你想让Node先运行a，a运行完后运行b，b运行完后再运行c，那么程序是下面这样的：

```js
a(function() {
  b(function() {
    c()
  })
})
```

当这段代码被运行时，`a`马上就会被运行，一分钟后`a`结束运行，`b`开始执行，再一分钟后，`b`结束运行，`c`开始运行。最后，也就是三分钟后，Node会停止运行，因为所有事都运行完了。上面的代码可能看起来没那么漂亮，但重点是，如果有些代码需要在某些非同步的事情运行完了之后再运行，你需要做的是把那些代码放进一个函数，当作回调函数传给非同步函数，以表示回调函数中的代码要依赖非同步的部分运行结束才能运行。

Node要求你用非线性的思维思考。看看下面这两件事：

```
read a file
process that file
```

如果你只是不假思索地把这两件事改成伪代码，你会这么写：

```
var file = readFile()
processFile(file)
```

这种线性的代码不是Node的风格。（线性是指一步接一步、按照顺序地）。如果上面的代码被运行了。那么`readFile`和`processFile`会同时被调用。这根本说不通，因为`reafFile`要花上一阵子时间才能运行结束。正确的做法是，表达清楚`processFile`是要依赖`readFile`结束才能运行的。这就是回调函数的作用了！因为JavaScript的特点，有好几种方法可以表达这种依赖性：

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}
```

不过你这样写也可以，照样会成功运行：

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}

fs.readFile('movie.mp4', finishedReading)
```

甚至像下面这样：

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
