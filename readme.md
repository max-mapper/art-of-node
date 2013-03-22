# The Art of Node
## An introduction to Node.js

This document is intended for readers who know at least a little bit of a scripting language like JavaScript, Ruby, Python, Perl, etc. If you aren't a programmer yet then it is probably easier to start by reading [JavaScript for Cats](http://jsforcats.com/). :cat2:

It is also currently a work in progress. If you like it then please consider donating via [gittip](https://www.gittip.com/maxogden/) so that I can write more!

## Table of contents

- [Understanding node](#understanding)
- [Core modules](#core-modules)
- [Callbacks](#callbacks)
- [Events](#events) (not written yet)
- [Streams](#streams) (not written yet)
- [Modules and NPM](#modules) (not written yet)
- [Real-time apps](#realtime) (not written yet)

## Understanding node

Node.js is an open source project designed to help you write JavaScript programs that talk to networks, file systems or other I/O (input/output, reading/writing) sources. That's it! It is just a simple and stable I/O platform that you are encouraged to build modules on top of.

What are some examples of I/O? Here is a diagram of an application that I made with node that shows many I/O sources:

![server diagram](server-diagram.png)

If you don't understand all of the different things in the diagram it is completely okay. The point is to show that a single node process (the hexagon in the middle) can act as the broker between all of the different I/O endpoints (orange and purple represent I/O).

Usually building these kinds of systems is either:

- difficult to code but yields super fast results (like writing your web servers from scratch in C)
- easy to code but not very speedy/robust (like when someone tries to upload a 5GB file and your server crashes)

Node's goal is to strike a balance between these two: relatively easy to understand and use and fast enough for most use cases.

Node isn't either of the following:

  - A web framework (like Rails or Django, though it can be used to make such things)
  - A programming language (it uses JavaScript but node isn't its own language)
  
Instead, node is somewhere in the middle. It is:

  - Relatively easy to understand and use
  - Useful for I/O based programs that need to be fast and/or handle lots of connections
  
At a lower level, node can be described as a tool for writing two major types of programs: 

  - Network programs using the protocols of the web: HTTP, TCP, UDP, DNS and SSL
  - Programs that read and write data to the filesystem or local processes/memory

What is an "I/O based program"? Here are some common I/O sources:

  - Databases (e.g. MySQL, PostgreSQL, MongoDB, Redis, CouchDB)
  - APIs (e.g. Twitter, Facebook, Apple Push Notifications)
  - HTTP/WebSocket connections (from users of a web app)
  - Files (image resizer, video editor, internet radio)

Node does I/O in a way that is [asynchronous](http://en.wikipedia.org/wiki/Asynchronous_I/O) which lets it handle lots of different things simultaneously. For example, if you go down to a fast food joint and order a cheeseburger they will immediately take your order and then make you wait around until the cheeseburger is ready. In the meantime they can take other orders and start cooking cheeseburgers for other people. Imagine if you had to wait at the register for your cheeseburger, blocking all other people in line from ordering while they cooked your burger! This is called **blocking I/O** because all I/O (cooking cheeseburgers) happens one at a time. Node, on the other hand, is **non-blocking**, which means it can cook many cheeseburgers at once.

Here are some fun things made easy with node thanks to its non-blocking nature:
  
  - Control [flying quadcopters](http://nodecopter.com)
  - Write IRC chat bots
  - Create [walking biped robots](http://www.youtube.com/watch?v=jf-cEB3U2UQ)

Like any good tool, node is best suited for a certain set of use cases. For example: Rails, the popular web framework, is great for modeling complex business logic and for the rapid prototyping of database-driven web applications. While it is technically possible to do the same type of thing using node, there would be definite drawbacks since node is designed for solving I/O problems and it doesn't know much about 'business logic'. Hopefully this guide will help you gain an intuitive understanding of the strengths of node so that you know when it can be useful to you.

## Core modules

Firstly I would recommend that you get node installed on your computer. The easiest way is to visit [nodejs.org](http://nodejs.org) and click `Install`. 

Node has a relatively small core group of modules (commonly referred to as 'node core') that are presented as the public API that you are intended to write programs with. Fundamentally node is a tool used for managing I/O across file systems and networks, and it leaves other more fancy functionality up to third party modules. For working with file systems there is the `fs` module and for networks there are modules like `net` (TCP), `http`, `dgram` (UDP).

In addition to `fs` and network modules there are a number of other base modules in node core. There is a module for asynchronously resolving DNS queries called `dns`, a module for getting OS specific information like the tmpdir location called `os`, a module for allocating binary chunks of memory called `buffer`, some modules for parsing urls and paths (`url, `querystring`, `path`), etc. Most if not all of the modules in node core are there to support nodes main use case: writing fast programs that talk to file systems or networks.

The aforementioned patterns that are used in node core are: callbacks, events, streams and modules. If you learn how these four things work then you will be able to go into any module in node core and have a basic understanding about how to interface with it.

## Callbacks

This is the most important topic to understand if you want to understand how to use node. Nearly everything in node uses callbacks. They weren't invented by node, they are just a particularly useful way to use JavaScript functions.

Callbacks are functions that are executed asynchronously, or at a later time. Instead of the code reading top to bottom procedurally, async programs may execute different functions at different times based on the order and speed that earlier functions like http requests or file system reads happen.

The difference can be confusing since determining if a function is asynchronous or not depends a lot on context. Here is a simple synchronous example:

```js
var myNumber = 1
function addOne() { myNumber++ } // define the function
addOne() // run the function
console.log(myNumber) // logs out 2
```

The code here defines a function and then on the next line calls that function, without waiting for anything. When the function is called it immediately adds 1 to the number, so we can expect that after we call the function the number should be 2.

Let's suppose that we want to instead store our number in a file called `number.txt`:

```js
var fs = require('fs')
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

Callbacks are just functions that get executed at some later time. The key to understanding callbacks is to realize that we use callbacks to declare **when** we want something to happen, not **where**. First you split your code up into functions, and then use callbacks to declare which functions are dependent on other functions.

The `fs.readFile` method is provided by node and is asynchronous happens to take a long time to finish. Consider what it does: it has to go to the operating system, which in turn has to go to the file system, which lives on a hard drive that may or may not be spinning at thousands of revolutions per minute. Then it has to use a laser to read data and send it back up through the layers back into your javascript program. You give `readFile` a function (known as a callback) that it will call after it has retrieved the data from the file system. It puts the data it retrieved into a javascript variable and calls your function (callback) with that variable, in this case the variable is called `fileContents` because it contains the contents of the file that was read. 

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

Now the `addOne` function can get passed in an argument that will become the `callback` variable inside the `addOne` function. After `readFile` is done the `callback` variable will be invoked (`callback()`). Only functions can be invoked, so if you pass in anything other than a function it will cause an error.

When a function get invoked in javascript the code inside that function will immediately get executed. In this case our log statement will execute since `callback` is actually `logMyNumber`. Remember, just because you *define* a function it doesn't mean it will execute. You have to *invoke* a function for that to happen.

To break down this example even more, here is a timeline of events that happen when we run this program:

- 1: the code is parsed, which means if there are any syntax errors they would make the program break.
- 2: `addOne` gets invoked, getting passed in the `logMyNumber` function as `callback`, which is what we want to be called when `addOne` is complete. This immediately causes the asynchronous `fs.readFile` function to kick off. This part of the program takes a while to finish.
- 3: with nothing to do, node idles for a bit as it waits for `readFile` to finish
- 4: `readFile` finishes and calls its callback, `doneReading`, which then in turn increments the number and then immediately invokes the function that `addOne` passed in (its callback), `logMyNumber`.

Perhaps the most confusing part of programming with callbacks is how functions are just objects that be stored in variables and passed around with different names. Giving simple and descriptive names to your variables is important in making your code readable by others. Generally speaking in node programs when you see a variable like `callback` or `cb` you can assume it is a function.

You may have heard the terms 'evented programming' or 'event loop'. They refer to the way that `readFile` is implemented. Node first dispatches the `readFile` operation and then waits for `readFile` to send it an event that it has completed. While it is waiting node can go check on other things. Inside node there is a list of things that are dispatched but haven't reported back yet, so node loops over the list again and again checking to see if they are finished. After they finished they get 'processed', e.g. any callbacks that depended on them finishing will get invoked.

Imagine you had 3 async functions `a`, `b` and `c`. Each one takes 1 minute to run and after it finishes it calls a callback (that gets passed in the first argument). If you wanted to tell node 'start running a, then run b after a finishes, and then run c after b finishes' it would look like this:

```js
a(function() {
  b(function() {
    c()
  })
})
```

When this code gets executed, `a` will immediately start running, then a minute later it will finish and call `b`, then a minute later it will finish and call `c` and finally 3 minutes later node will stop running since there would be nothing more to do. There are definitely more elegant ways to write the above example, but the point is that if you have code that has to wait for some other async code to finish then you express that dependency by putting your code in functions that get passed around as callbacks.

## Events

TODO

## Streams

Early on in the project the file system and network APIs had their own separate patterns for dealing with streaming I/O. For example, files in a file system have things called 'file descriptors' so the `fs` module had to have extra logic to keep track of these things whereas the network modules didn't have such a concept. Despite minor differences in semantics like these, at a fundamental level both groups of code were duplicating a lot of functionality when it came to reading data in and out. The team working on node realized that it would be confusing to have to learn two sets of semantics to essentially do the same thing so they made a new API called the `Stream` and made all the network and file system code use it. 

The whole point of node is to make it easy to deal with file systems and networks so it made sense to have one pattern that was used everywhere. The good news is that most of the patterns like these (there are only a few anyway) have been figured out at this point and it is very unlikely that node will change that much in the future.


THE REST IS TODO

## Modules

TODO

## Real-time apps

TODO