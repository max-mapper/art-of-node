# Node的艺术
## Node.js入门

本文档假定读者已经懂了以下的两样东西：

- 懂得至少一种编程语言。例如：JavaScript，Ruby，Python，Perl或其他编程语言。如果你还不是程序员，你不懂编程语言，你可以阅读[JavaScript for Cats](http://jsforcats.com/)。:cat2:
- git和github。这是一个开源的协作工具，Node社区的用户使用git共享模块。你需要懂得基本操作就能了。这里有三篇很好的入门教程：[1](http://skli.se/2012/09/22/introduction-to-git/), [2](http://zachbruggeman.me/github-for-cats/), [3](http://opensourcerer.diy.org/)

This short book is a work in progress + I don't have a job right now (if I did I wouldn't have the time to write this). If you like it then please consider donating via [gittip](https://www.gittip.com/maxogden/) so that I can write more!

> 译者: 上面这段我没有翻译，因为我希望保持原文。上面作者提到，目前他还没找到工作。如果你喜欢这个文档，希望你可以通过[gittip](https://www.gittip.com/maxogden/)乐捐给作者。这样作者才能够写更多。

[![donate](donate.png)](https://www.gittip.com/maxogden/)

## 目录

- [了解Node](#了解Node)
- [核心模块](#核心模块)
- [回调函数](#回调函数)
- [事件](#事件)
- [流](#流)
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

Node试图做到平衡在这两者之间：在大多数用列做到高效运行，而且容易明白和开发。

Node不是以下两样东西：

  - 不是Web框架 （不像Rails或Django，尽管它可以被用来做这样的事情）
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

首先，你需要在电脑上安装Node。Node安装很简单，只需浏览[nodejs.org](http://nodejs.org)和点击`Install`.

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

## 事件
在Node中如果你加载了[events](http://nodejs.org/api/events.html)模块， 就可以用被称作`event emitter`（事件分发器）的功能。 Node在它的API中使用这一功能分发事件。

在编程中运用`事件`是一种常见的方法。它还有一个我们更为熟知的名字[观察者模式](https://zh.wikipedia.org/wiki/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F)，或者`发布／监听`模式。在回调函数的模式中，调用回调函数的命令与等待回调函数的命令间的关系是一一对应的，而在事件模式中这两种命令的关系可以是多对多的。

理解事件最简单的方式，就是把它当成一个你监听的东西。如果说在回调函数里面我们的逻辑是`先做X，再做Y`，那么在事件中我们的逻辑是`当X发生时，做Y`。

以下是一些常见的用事件取代回调函数的例子：


- 需要向所有听众广播的聊天室
- 需要及时了解玩家上线、下线、运动、设计、跳跃等动作的游戏服务器
- 需要能让开发者执行`.on('jump', function() {})`这种命令的游戏引擎
- 能够执行`.on('incomingRequest')` 或 `.on('serverError')`这一API的低端web服务器。

如果我们想只用回调函数写一个连接聊天服务器的模块的话，代码会长这样：


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

正如你所见，用回调函数写会变得十分笨拙。你需要把所有的功能函数按特定的顺序传给`.connect`来执行。但是将上面所写的功能用事件来实现，就会变成这样：

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

这种写法和回调函数很像，但是运用了高大上的`.on`功能，它会让一个回调函数‘监听’一个事件。 这意味着你可以在`chatClient`中选择任意一个想要监听的事件。 你甚至可以为多个回调函数监听同一个事件：

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

## 流

在早期的node项目中，文件系统和网络API有各自处理I/O流的方式。比如，在文件系统中，文件有一个‘文件描述器’的东西，因此`fs`模块需要调用额外的逻辑来跟踪这个东西。然而在网络模块中根本没有’xx描述器‘这样的概念。尽管在语义上有像这样较小的区别，在最底层这两种模块（文件系统、网络模块）在重复着同样的数据读写操作。Node的维护们很快意识到这样的重复很容易迷惑开发者，于是他们造了这么个叫`流`（Stream）的东西，使网络与文件系统的代码可以同样工作。

Early on in the node project the file system and network APIs had their own separate patterns for dealing with streaming I/O. For example, files in a file system have things called 'file descriptors' so the `fs` module had to have extra logic to keep track of these things whereas the network modules didn't have such a concept. Despite minor differences in semantics like these, at a fundamental level both groups of code were duplicating a lot of functionality when it came to reading data in and out. The team working on node realized that it would be confusing to have to learn two sets of semantics to essentially do the same thing so they made a new API called the `Stream` and made all the network and file system code use it. 

Node的理念就是以更简单的方式来处理文件系统和网络，所有理所应当的应该有一个通用的模式，可以在不同的场景中运用。好消息是，类似的大多数模式（尽管数量很少）现在已经被认为node在未来不会去更改。

The whole point of node is to make it easy to deal with file systems and networks so it made sense to have one pattern that was used everywhere. The good news is that most of the patterns like these (there are only a few anyway) have been figured out at this point and it is very unlikely that node will change that much in the future.

已经有两个很棒的资源可以用来学习node的流对象。一个叫‘stream-adventure’（参考‘[了解Node](#了解Node)’部分),另一个叫‘Stream Handbook’。

There are already two great resources that you can use to learn about node streams. One is the stream-adventure (see the Learn Node Interactively section) and the other is a reference called the Stream Handbook.

### Stream Handbook

[stream-handbook](https://github.com/substack/stream-handbook#introduction) 是一个与本项目相似的，包含所有你需要、想要了解的有关流对象的内容的教程。

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

It's not just Debian that does this. Most programming language package managers work this way too. To address the global dependencies problem described above there have been virtual environment developed like [virtualenv](http://python-guide.readthedocs.org/en/latest/dev/virtualenvs/) for Python or [bundler](http://bundler.io/) for Ruby. These just split your environment up in to many virtual environments, one for each project, but inside each environment dependencies are still globally installed. Virtual environments don't always solve the problem, sometimes they just multiply it by adding additional layers of complexity.

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
  "name": "number-one",
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

Donate icon is from the [Noun Project](http://thenounproject.com/term/donate/285/)
