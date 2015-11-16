# Node 的藝術
## Node.js 入門

本文件假設讀者已經懂了以下的兩樣東西：

- 至少懂得一種程式語言。例如：JavaScript，Ruby，Python，Perl 或其他程式語言。如果你還不是程式設計師，你也不懂程式語言，你可以閱讀 [JavaScript for Cats](http://jsforcats.com/)。:cat2:
- git 和 github。這是一個開源的協作工具，Node 社群的參與者使用 git 共享模組。你只需要懂得基本操作就夠了。這裏有三篇很好的入門教學：[1](https://github.com/jlord/git-it-electron#readme), [2](http://zachbruggeman.me/github-for-cats/), [3](http://opensourcerer.diy.org/)

This short book is a work in progress + I don't have a job right now (if I did I wouldn't have the time to write this). If you like it then please consider donating via [gittip](https://www.gittip.com/maxogden/) so that I can write more!

> 譯者: 上面這段我沒有翻譯，因爲我希望保持原文。上面作者提到，目前他還沒找到工作。如果你喜歡這份文件，希望你可以通過 [gittip](https://www.gittip.com/maxogden/) 樂捐給作者。這樣作者才能夠寫更多內容。

[![donate](donate.png)](https://www.gittip.com/maxogden/)

## 目錄

- [瞭解Node](#node-1)
- [核心模組](#-1)
- [回呼機制](#callbacks)
- [Events](#events) (not written yet)
- [Streams](#streams) (not written yet)
- [Modules and NPM](#modules) (not written yet)
- [Going with the grain](#going-with-the-grain)
- [Real-time apps](#realtime) (not written yet)

## 瞭解Node

Node.js 是一個自由軟體專案，目的是讓你通過編寫 JavaScript 的程式進行網路、檔案系統或者與其他輸入/輸出裝置溝通的程式。就這樣！它只是一個簡單而穩定的輸入/輸出平臺，你可以在這個平臺上建構模組。

那有沒有一些關於輸入/輸出的實際例子？ 這裏有張我用 Node.js 製作的應用程式結構圖，你可以看到上面有很多輸入/輸出裝置：

![server diagram](server-diagram.png)

如果你無法完全瞭解上圖顯示的所有東西，那沒關係。重點是你看到一個 Node 的運作（中間的六邊形那個），它就像經紀人，管理全部輸入/輸出的節點（橙色和紫色的線條代表輸入/輸出）。

一般上我們撰寫的程式可以分爲以下兩類：

- 很難寫，但是效率超高（就像用 C 從零開始編寫一個網頁伺服器）
- 很好寫，但是不夠效率/強大（就像有人試圖上傳 5GB 的檔案去你伺服器，但是伺服器卻當掉了）

Node 試圖在這兩者之間做到平衡：容易理解與使用，並且在多數的情況下能夠快速開發。

Node 不是以下兩樣東西：

  - 不是Web框架 （不像 Rails 或 Django，儘管它可以被用來做這樣的事情）
  - 不是程式語言（Node 使用 JavaScript 程式語言，它沒有自己的語言）

相反，Node 是：

  - 設計上簡單，而且容易明白和使用的平臺
  - 適合那些需要快速和處理很多輸入/輸出連接的程式

在底層，Node 可以作爲一種工具，並編寫出以下兩類程式：

  - 需要使用到Web協議（如：HTTP、TCP、UDP、DNS和SSL）的網路程式
  - 需要對檔案系統或者本機執行緒/記憶體進行寫入或讀出操作的程式

什麼是“輸入/輸出程式”？ 這裏有一些常見的輸入/輸出裝置：

  - 資料庫 （如：MySQL、PostgreSQL、MongoDB、Redis、CouchDB）
  - APIs（如：Twitter、Facebook、Apple Push Notifications）
  - HTTP/WebSocket的連線（從使用者的Web應用程式）
  - 文件檔（圖像縮放軟件、影音編輯器、網路收音機）

Node能 夠[非同步處理](http://en.wikipedia.org/wiki/Asynchronous_I/O)多個不同種類的輸入/輸出來源。比如說，假設你來到快餐店，你向店員要了一個起士堡，他們會馬上爲你下單和準備漢堡。然後，他們會要求你在旁邊等漢堡完成。在你等待這段時間，他們可以接受其他訂單和幫其他人準備漢堡。試想一下，如果你站在櫃檯前面，一直等到你的起士堡完成，那麼你就阻礙了後面的人下訂單，廚師也不能幫其他人準備漢堡！我們稱這個爲**阻塞式 I/O**，因爲一次只能處理一個 I/O 操作（廚師一次只能準備一個漢堡）。Node 並不是這樣的，它是**非阻塞**的，也就是說它能一次準備很多漢堡。

感謝 Node 的非阻塞特性，讓我們可以實現以下這些有趣事情：

  - 控制 [Quadcopters 飛行](http://nodecopter.com)
  - 編寫 IRC 談天機器人
  - 製作一個[雙腳走路的機器人](http://www.youtube.com/watch?v=jf-cEB3U2UQ)

## 核心模組

首先，你需要安裝 Node 到你的電腦。Node 安裝很簡單，只需瀏覽 [nodejs.org](http://nodejs.org) 和按下 `Install`.

Node 擁有一組核心模組（通常被稱爲`Node 核心`）提供公用 API 讓你開發時呼叫。我們可以呼叫 `fs` 模組來操作檔案系統。當我們要進行網路操作時候，我們會呼叫網路模組，例如：`net`（TCP），`http`，`dgram`（UDP）。

除了 `fs` 和網路模組之外，Node核心還有很多其他的核心模組。如 `dns` 模組用來非同步解析DNS查詢。`os` 模組可以用來收集作業系統的資訊，如 tempdir 的路徑。`buffer` 模組可以處理二進制資料。還有些模組可以處理 URL 和路徑，如：`url`，`querystring` 和 `path` 等等。大部分的核心模組都支援 Node 的主要使用目標：快速編寫能夠進行檔案或網路操作的程式。

Node 通過回呼機制，事件，串流和模組來控制 I/O。如果你知道這四樣東西是如何工作的，那麼你就能夠靈活使用任何核心模組，並且懂得如何與這些模組串聯。

## 回呼機制

如果你想瞭解如何使用 Node，這將會是最重要的課題。幾乎在 Node 中的所有事情都會使用到回呼機制。這並不是 Node 發明的，它只是一種呼叫 JavaScript 函式的特殊方式。

回呼函式是指非同步，或者在將來某個時間才會被執行的函式。同步程式執行的順序是從上到下，而非同步的程式卻是在不同的時間執行不同的函式，這些都基於早些執行函式的順序和時間，像是 HTTP 請求和從文件系統裡讀取內容等等。

這種同步和非同步之間的差異可能會讓人感到困惑，因為解讀一個函式是不是非同步，很大的程度上取決於具體的情況。下面是一個簡單的同步函式例子：

```js
var myNumber = 1
function addOne() { myNumber++ } // 定義函式
addOne() // 執行函式
console.log(myNumber) // 輸出 2
```

上面的程式碼定義了一個函式，然後呼叫該函式，之間沒有任何停留。當該函式被呼叫時，它立即把那個數字加上 1，所以我們可以預見到，呼叫過該函式後，那個數字的值會變成 2。

現在假設我們把數字保存在一個叫 `numbr.txt` 的文件裡：

```js
var fs = require('fs') // require 是 Node 裡提供的一個特別函式
var myNumber = undefined // 數字裡保存在文件裡，因此我們並不知道它的值

function addOne() {
  fs.readFile('./number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // 輸出 undefined
```

為什麼當我們輸出值的時候是顯示 `undefined` ? 因為在上面的程式碼中，我們使用了 `fs.readFile` 這個方法, 而它恰好是個非同步方法。 一般來說，需要和硬碟或網路通信的，都是非同步的。如果只需要從記憶體或 CPU 裡讀取的話，這就是同步的。這是因為 I/O（輸入／輸出）是非常非常非常慢的。如果要大概形容一下，從硬碟裡讀取大概比從記憶體（RAM）裡讀取慢了 10 萬倍。

當這個程式執行的時候，所有的函式都馬上被定義，但它們不是馬上都被執行的。這是撰寫非同步程式時的一個基礎概念。當 `addOne` 被呼叫的時候，Node 執行 `readFile` 這個方法，但不等到 `readFile` 結束，它會繼續執行下一個準備好的函式。如果沒有可以執行的函式，Node 要麼會停下來，等待文件讀取或是網路通信結束，要麼就退出程式。

當 `readFile` 把文件讀取完成（需要的時間從幾毫秒到幾秒到幾分鐘不等，要看硬碟有多快），Node 會執行 `doneReading` 這個函數，並把錯誤（如果讀取文件出現錯誤）和文件的內容傳給它。

在上面程式中，之所以會顯示 `undefined` 是因為我們的程式碼在輸出數字之前，並沒有在任何地方告訴 `console.log` 等待 `readFile` 結束。

如果你有一些想要反複執行的程式碼，你應該做的第一件就是把這些程式碼放在一個函數裡。然後，在你需要執行的時候，呼叫這個函數就行了。

回呼函式，只是一個在將來某個時間點會被執行的函式。要理解回呼函式，關鍵的一點是它被使用的時機。你使用回呼函式的前題是，你不知道**什麼時候**某個非同步操作會完成，但知道這個操作會在**哪裡**結束————就在那個非同步函式的最後一行！你在什麼地方宣告這些函式並不重要，重要的是這些函式之間的羅輯/階層。把程式碼拆成各個函式之後，如果一個函式的执行取決於另一個函式何時結束，就該使用回呼函式了。

上面程式碼中 `fs.readFile` 方法是 Node 自帶的，這個方法是非同步的，而且要花費很長時間。想想看它要做多少事情：它要進入操作系统，進入文件系统，文件系统可是在硬碟上的，硬碟可能轉得飛快，也可能根本就不轉。然後它要用激光讀出資料，並把資料傳回你的 JavaScript 程式。當你給了它一個回呼函式後，它就可以在成功地從文件系統中取得資料以後，呼叫那個回呼函式。它會把資料放在一個變數裡，傳入你給的回呼函式，我們給這個參數起的名字叫做 `fileContents`，因為參數中包含的是讀取到的文件内容。

想想看本文剛開始的那個餐廳例子。在很多餐廳，你點的菜上來之前，服務生會放一個數字牌在你桌上。這個和回呼函式很類似。回呼函式的作用就是告訴服務員在你的起士漢堡好了後要做些什麼。

現在，讓我們把 `console.log` 放進一個函式裡作回呼函式使用吧。

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
现在 `logMyNumber` 這個函式可以被傳給 `addOne` 作為回呼函式了。在 `readFile` 完成後，`callback` 這個變數會被執行（也就是 `callback()`)。只有函式才能被執行，所以如果你提供一個不是函式的東西，程式會出錯。

在 JavaScript 裡，當函式被呼叫，其包含的程式碼會立刻被執行。在這個例子裡，`console.log` 會被執行，因為 `callback` 其實就是 `logMyNumber`。要記得，你*定義*了一个函式，不代表它會執行！你一定得*呼叫*它才行。

如果要更仔細地分析一下這個例子，下面是按時間順序排列的所有發生的事件：
- 1: 程式碼被分析，此時，如果有任何語法錯誤，程式會中斷並報錯。
  2: `addOne` 被呼叫，以 `logMyName` 作為它的回呼函式，也就是我們想在 `addOne` 結束後執行的函式。接下來，非同步的 `fs.readFile` 馬上開始執行。這個部分要花上點時間。
- 3: 目前 Node 没事做，於是它就閒下來等待 `readFile` 結束。
  4: `readFile` 結束了，`doneReading` 這個函式被呼叫，它把數字加上 1 然後馬上呼叫回呼函式————也就是我們傳給 `addOne` 的 `logMyNumber`。

也許關於回呼函式最難理解的部份是，為什麼函式可以存在變數裡被傳來傳去，而且還有著變來變去的名字。要讓你的程式碼更容易被看懂，給你的函式取簡單明瞭的名字是很重要的。總的來說，在使用 Node 時，如果你看見一個變數叫做 `callback` 或是它的縮寫 `cb`，你差不多可以確定它就是一個函式。

你可能聽過一個術語叫“事件驅動程式設計”，或者叫“事件循環”。`readFile` 這類的函式就利用了“事件循環”。Node 首先開始始執行 `readFile`，並等待著 `readFile` 傳回一個事件。在 Node 等待的這段時間，它可以繼續執行其他的程式碼。在 Node 裡有一個列表，裡面記下了所有開始執行卻還沒有傳回結束訊號的事，Node 就一遍遍循環檢查這個列表，看看有沒有事情完成了。它們執行完之後，就會被指定成處理完，接著執行依賴的回呼函式。

下面是上面的虛擬碼版本：

```js
function addOne(thenRunThisFunction) {
  waitAMinuteAsync(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

試想你有三個非同步函式：`a`、`b`，和 `c`。它們執行時間都要花上一分鐘，執行完後會呼叫一个回呼函式（以第一個参數的形式被傳進函式）。如果你想讓 Node 先執行 `a`，`a` 執行完後執行 `b`，`b` 執行完後再執行 `c`，那麼程式碼可以寫成下面這樣：

```js
a(function() {
  b(function() {
    c()
  })
})
```

當這段程式碼被執行時，`a` 馬上就會被執行，一分鐘後 `a` 結束，`b` 開始執行，再一分鐘後，`b` 結束，`c` 開始執行。最後，也就是三分鐘後，Node 會終止，因為所有事都執行完畢。上面的程式碼可能看起來沒那麼漂亮，但重點是，如果有些程式碼需要在某些非同步的事情完成之後再執行，你需要做的是把那些程式碼放進一個函式，當作回呼函式傳給非同步函式，以表示回呼函式中的程式碼要依賴非同步的部份結束後才能執行。

Node 要求你用非線性的思維思考。看看下面這兩件事：

```
read a file
process that file
```
如果你只是不假思索地把這兩件事改成虛擬碼，你會這麼寫：

```
var file = readFile()
processFile(file)
```

這種線性的程式碼不是 Node 的風格。（線性是指一步接一步、按照順序地執行）。如果上面的程式碼被執行了。那麼 `readFile` 和 `processFile` 會同時被呼叫。這根本說不通，因為 `reafFile` 要花上一陣子才能完成執行。正確的做法是，表達清楚 `processFile` 是要依賴 `readFile` 結束才能運行的。這就是回呼函式的功用了！因為 JavaScript 的特點，有好幾種方法可以表達這種依賴性：

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}
```

不過你這樣寫也可以，照樣能成功執行：

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}

fs.readFile('movie.mp4', finishedReading)
```

甚至像下面這樣：

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
