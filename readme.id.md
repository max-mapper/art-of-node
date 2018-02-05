# The Art of Node
## Sebuah Pengantar untuk Node.js

Dokumen ini dimaksudkan untuk para pembaca yang sedikitnya mengetahui beberapa hal mengenai:

- Sebuah bahasa scripting seperti Javascript, Ruby, Python, Perl, etc. Jika Anda bukan seorang Programmer maka akan lebih memudahkan untuk terlebih dahulu membaca [JavaScript for Cats](http://jsforcats.com/). :cat2:
- git dan github adalah tools kolaborasi open source dimana orang-orang di dalam komunitas node gunakan untuk membagikan modul-modul. Anda cukup mengetahui dasar-dasar saja. Berikut adalah tutorial pemula yang bagus: [1](https://github.com/jlord/git-it-electron#readme), [2](http://ericsteinborn.com/github-for-cats/#/), [3](http://opensourcerer.diy.org/)

## Daftar Isi

- [Belajar Node interaktif](#belajar-node-interaktif)
- [Memahami node](#memahami-node)
- [Modul-modul inti](#modul-modul-inti)
- [Callbacks](#callbacks)
- [Events](#events)
- [Streams](#streams)
- [Modul-modul dan npm](#modul-modul)
- [Pengembangan sisi klien dengan npm](#pengembangan-sisi-klien-dengan-npm)
- [Going with the grain](#going-with-the-grain)

## Belajar Node interaktif

Sebagai tambahan panduan ini adalah sangat penting untuk menentukan text editor favorit Anda dan sampai kepada menulis kode node. Saya selalu merasakan ketika hanya membaca beberapa kode di dalam buku tidak benar-benar meresap, akan tetapi belajar dengan menulis kode sangat bagus untuk menangkap konsep-konsep pemograman.

### NodeSchool.io

[NodeSchool.io](http://nodeschool.io/) adalah sebuah seri dari workshop interaktif yang gratis + open source yang mengajarkan Anda prinsip-prinsip dari Node.js dan lebih dari itu.

[Learn You The Node.js](https://github.com/workshopper/learnyounode#learn-you-the-nodejs-for-much-win) adalah sebuah pengenalan workshop NodeSchool.io. Ini merupakan sekumpulan soal-soal pemograman yang mengenalkan Anda pada pola-pola yang lumrah pada node. Ini terdiri dari sebuah program berbentuk command line.

[![learnyounode](https://github.com/rvagg/learnyounode/raw/master/learnyounode.png)](https://github.com/rvagg/learnyounode#learn-you-the-nodejs-for-much-win)

Anda bisa menginstalnya dengan npm:

```
# install
npm install learnyounode -g

# memulai menu
learnyounode
```

## Memahami node

Node.js adalah projek open source didesain untuk membantu Anda untuk membuat program-program Javascript yang dapat berhubungan dengan jaringan-jaringan, sistem file atau sumber-sumber I/O(input/output) lainnya. Itulah dia! Ini adalah platform I/O sederhana dan stabil yang mendorong Anda untuk membangun modul-modul darinya.

Apa saja contoh-contoh dari I/O itu? Berikut adalah diagram dari penerapan yang saya buat menggunakan node yang menunjukkan banyak sumber I/O:

![server diagram](server-diagram.png)

Jika Anda tidak memahami semua hal di dalam diagram tersebut tidak mengapa. Intinya adalah untuk menunjukkan bahwa sebuah proses node(segi enam di tengah) dapat berperan sebagai broker antara semua ujung-ujung I/O yang berbeda(orange and purple merepresentasikan I/O).

Biasanya membangun sistem-sistem seperti ini menjadi antara:

- susah mengkode tapi menghasilkan hasil yang sangat cepat (seperti membangun web server dari awal menggunakan C)
- mudah untuk dikode tapi tidak cepat/tahan (seperti ketika seseorang mencoba mengupload 5GB file dan server anda crash)

Tujuan dari Node adalah untuk memberikan keseimbangan antara 2 hal: relatif mudah untuk dipahami dan digunakan dan cukup cepat untuk kebanyakan contoh kasus.

Node bukanlah seperti berikut:

  - Sebuah web framework (seperti Rails atau Django, walaupun dapat digunakan untuk membuat hal-hal tersebut)
  - Sebuah bahasa pemograman (ini menggunakan JavaScript tapi node bukanlah bahasannya)

Melainkan, node berada di tengah-tengah antaranya. Yaitu:

  - Didesain menjadi sederhana sehingga relatif mudah dipahami dan digunakan
  - Berguna untuk program-program yang memanfaatkan I/O yang butuh kecepatan untuk menangani banyak koneksi.

Pada level bawah, node dapat dideskripsikan sebagai sebuah tool untuk menulis dua tipe program secara garis besar yaitu:
  - Program-program jaringan yang menggunakan protokol web serperti: HTTP, TCP, UDP, DNS, dan SSL.
  - Program-program yang melakukan pembacaan dan penulisan ke sistem file atau proses local/memory.

Apakah yang dimaksud dengan "program I/O"? Berikut adalah beberapa sumber-sumber I/O:

  - Database (misal MySQL, PostgreSQL, MongoDB, Redis, CouchDB)
  - APIs (misal Twitter, Facebook, Apple Push Notifications)
  - Koneksi HTTP/WebSocket (dari pengguna web app)
  - File-file (pengolah ukuran gambar, pengedit video, dan internet radio)

Node melakukan I/O secara [asynchronous](https://en.wikipedia.org/wiki/Asynchronous_I/O) dimana dapat menangani banyak hal secara simultan. Sebagai contoh, jika Anda pergi ke persimpangan fast food dan memesan sebuah cheeseburger mereka akan segera mengambil pesanan Anda dan membuat anda menunggu sampai cheeseburger selesai. Disaat yang bersamaan mereka dapat mengambil pesanan lainnya dan memulai memasak cheeseburger untuk orang lainnya. Bayangkan jika Anda harus menunggu di tempat pemesanan untuk cheeseburger, menghalangi semua orang lain di garis antri untuk memesan selagi mereka memasak burger Anda! Inilah yang disebut **blocking I/O** karena semua I/O (memasak cheeseburger) terjadi sekali dalam satu waktu. Node, disisi lain, bersifat **non-blocking**, yang berarti dapat memasak banyak cheeseburger dalam waktu bersamaan.

Berikut adalah hal-hal menarik yang dipermudah oleh node berkat sifat non-blocking-nya:
  
  - Control [flying quadcopters](http://www.nodecopter.com/)
  - Menulis IRC chat bots
  - Create [walking biped robots](https://www.youtube.com/watch?v=jf-cEB3U2UQ)

## Modul-modul inti

Terlebih dahulu saya merekomendasikan Anda untuk menginstal node pada komputer Anda. Cara paling gampang adalah dengan mengunjungi [nodejs.org](http://nodejs.org) and click `Install`.

Node memiliki modul-modul inti berukuran kecil(biasa disebut sebagai 'node core') yang merepresentasikan API publik yang ingin kamu gunakan untuk menulis program. Untuk menggunakan sistem file terdapat modul `fs` dan untuk jaringan terdapat modul-modul seperti `net` (TCP), `http`, `dgram` (UDP).

Sebagai tambahan untuk `fs` dan modul-modul jaringan terdapat sejumlah modul-modul dasar lainnya di dalam modul inti. Ada modul untuk asynchronous menangani queri-queri DNS seperti `dns`, sebuah modul untuk mendapatkan informasi terkait OS seperti lokasi tmpdir yang disebut sebagai `os`, sebuah modul untuk mengalokasikan sekumpulan untaian biner disebut `buffer`, juga beberapa modul untuk menerjemahkan(*parse*) url dan path (`url`, `querystring`, `path`), dan lainnya. Sebagian besar modul-modul tersebut mendukung penggunaan utama node yaitu: menulis program yang cepat yang dapat berhubungan dengan sistem file dan jaringan.

Node menangani I/O menggunakan: callbacks, events, streams, dan modul-modul. Jika Anda mempelajari bagaimana hal-hal tersebut bekerja maka Anda akan bisa memahami modul lainnya dan memiliki pemahaman dasar bagaimana cara berinteraksi dengannya.

## Callbacks

Ini adalah topik yang paling penting untuk dipahami jika Anda ingin memahami bagaimana menggunakan node. Hampir keseluruhan hal dalam penggunaan node menggunakan callbacks. Mereka tidak diciptakan oleh node, mereka hanyalah bagian dari bahasa pemograman Javascript.

Callbacks adalah fungsi-fungsi yang dieksekusi secara asynchronous, atau tidak dalam waktu yang sama. Berbeda dengan pembacaan kode dari atas ke bawah secara prosedural, program yang bersifat asynchrounous mungkin saja mengeksekusi fungsi-fungsi yang berbeda pada waktu yang berlainan berdasarkan pada urutan dan kecepatan dari fungsi-fungsi sebelumnya seperti pada request http atau pembacaan sistem file.

Perbedaan ini dapat membingungkan karena menentukan apakah suatu fungsi asynchronous atau tidak tergantung banyak hal. Berikut contoh sederhana fungsi synchronous, yaitu Anda dapat membaca dari atas ke bawah seperti buku:

```js
var myNumber = 1
function addOne() { myNumber++ } // definisikan fungsi
addOne() // jalankan fungsi
console.log(myNumber) // keluarkan hasil 2
```

Kode tersebut mendefinisikan sebuah fungsi dan pemanggilan fungsi tersebut pada baris selanjutnya, tanpa menunggu apapun. Ketika fungsi dipanggil maka dia segera menambah 1 ke dalam variabel number, sehingga kita dapat mengekspektasikan bahwa setelah kita memanggil fungsi variabel number haruslah 2. Inilah hasil dari kode synchronous - yaitu berjalan secara berurutan dari atas ke bawah.

Node, disisi lain, kebanyakan menggunakan kode asynchronous. Marilah kita gunakan untuk membaca number dari file yang disebut `number.txt`:

```js
var fs = require('fs') // require is a special function provided by node
var myNumber = undefined // we don't know what the number is yet since it is stored in a file

function addOne() {
  fs.readFile('number.txt', function doneReading(err, fileContents) {
    myNumber = parseInt(fileContents)
    myNumber++
  })
}

addOne()

console.log(myNumber) // logs out undefined -- this line gets run before readFile is done
```

Kenapa kita mendapatkan hasil `undefined` ketika mengeluarkan hasil dari number?Pada kode ini kita menggunakan metode `fs.readFile`, yang merupakan metode yang bersifat asynchronous. Biasanya hal-hal yang berhubungan dengan hard drive dan jaringan bersifat asynchronous. Jika hal-hal tersebut diharuskan mengakses apa yang ada di dalam memori atau memproses pada CPU mereka akan bersifat synchronous. Alasan dari ini adalah proses I/O merupakan proses yang sangat lambat. Perkiraan untuk adalah hubungan terhadap harddrive sekitar 100,000 kali lebih lambat daripada berhubungan dengan memory (misal RAM). 

Ketika kita menjalankan program ini semua fungsi seketika itu juga didefinisikan, tetapi mereka tidak dieksekusi seketika. Ini adalah hal dasar yang harus dipahami tentang pemograman asynchronous. Ketika metode `addOne` dipanggil maka dia akan melakukan sebuah `readFile` dan lalu bergerak ke hal selanjutnya yang siap untuk dieksekusi. Jika tidak ada lagi yang akan dieksekusi, maka node akan menunggu proses operasi yang tertunda sebelumnya dari fs/network sampai selesai, atau berhenti dan keluar dari command line.

Ketika `readFile` selesai membaca sebuah file (sekitar beberapa milidetik sampai beberapa detik atau menit tergantung kecepatan hard drive) selanjutnya akan dijalankan fungsi `doneReading` dan memberikan error (jika ada error) dan isi dari file tersebut.

Alasan kenapa mendapatkan `undefined` padah kasus di atas adalah karena tidak ada pada code di atas sebuah *logic* yang memerintahkan `console.log` untuk menunggu sampai `readFile` selesai sebelum mencetak angka keluaran.

Jika Anda punya beberapa kode yang Anda ingin eksekusi lagi dan lagi, atau pada saat nanti, langkah pertama adalah letakkan kode tersebut di dalam sebuah fungsi. Lalu panggil fungsi tersebut kapanpun ingin menjalankan kode tersebut. Hal ini membantu memberikan deskripsi terhadap fungsi-fungsi Anda.

Callbacks hanyalah fungsi-fungsi yang dieksekusi beberapa saat kemudian. Kunci untuk memahami callabacks adalah dengan menyadari bahwa mereka digunakan ketika Anda tidak tahu **kapan** proses asynchronous tersebut akan selesai, tetapi Anda tau **dimana** proses tersebut akan selesai - yaitu pada baris terakhir dari fungsi asynchronous! Urutan atas-ke-bawah yang kamu gunakan untuk mengdeklarasikan callbacks tidak lah penting, yang penting hanya logika/hirarki yang dari penulisan callbacks. Pertama Anda memecah kode menjadi beberapa fungsi, dan lalu menggunakan callbacks untuk mendeklarasikan jika sebuah fungsi bergantung pada yang lainnya untuk selesai.

Metode `fs.readFile` yang disediakan oleh node, bersifat asynchronous, dan membutuhkan waktu yang lama untuk selesai. Pikirkanlah apa yang dilakukannya: proses ini harus berjalan menuju sistem operasi, lalu selanjutnya menuju sistem file, yang terdapat pada hard drive yang mungkin saja berputar atau tidak. Lalu harus menggunakan ujung magnet untuk membaca data dan mengirimkannya kembali melalui lapisan-lapisan kembali ke program javascript. Anda memberikan `readFile` sebuah fungsi (disebut callbacks) yang akan dipanggil setelah mendapatkan data dari sistem file. Dia akan meletakkan data yang didapat ke dalam variabel javascript dan memanggil fungsi(callbacks) dengan variabel tersebut. Pada kasus ini variable disebut juga dengan `fileContents` karena mengandung konten dari file yang dibaca.

Bayangkan contoh restoran pada permulaan tutorial ini. Pada banyak restoran Anda mendapatkan angka untuk diletakkan pada meja ketika menunggu makanan. Seperti inilah callbacks. Mereka mengatakan kepada server apa yang harus dilakukan setelah cheeseburger is done.

Mari letakkan `console.log` ke dalam fungsi dan masukkan sebagai callback:

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

Sekarang fungsi `logMyNumber` dapat dimasukkan sebagai sebuah argumen yang akan menjadi variable `callback` di dalam fungsi `addOne`. Setelah `readFile` selesai variabel `callback` akan dipanggil dengan cara (`callback()`). Hanya fungsi yang dapat dipanggil, jadi jika Anda memasukkan apapun selain dari fungsi maka akan menghasilkan error.

Ketika sebuah fungsi dipanggil di dalam kodingan javascript maka isinya akan segera dieksekusi. Pada kasus ini statemen log akan dieksekusi karena `callback` sebenarnya adalah `logMyNumber`. Ingat, hanya karena Anda *mendefinisikan* sebuah fungsi bukan berarti akan dieksekusi. Kamu harus *memanggil* sebuah fungsi agar itu terjadi.

Untuk detil lebih lanjut, berikut adalah alur even-even yang terjadi ketika program ini dijalankan:

- 1: Kode di terjemahkan, yang berarti jika ada syntax error maka program akan berhenti. Selama fase awal ini, `fs` dan `myNumber` dideklarasikan sebagai variabel-variabel sedangkan `addOne` dan `logMyNumber` dideklarasikan sebagai fungsi-fungsi. Ingat ini hanyalah deklarasi. Keduanya sama-sama belum dipanggil.
- 2: Ketika baris terakhir program dieksekusi `addOne` dipanggil dengan fungsi `logMyNumber` dimasukkan sebagai argumen `callback`. Ketika memanggil `addOne` maka pertama fungsi `fs.readFile` akan dijalankan secara asynchronous. Bagian ini memakan waktu untuk selesai.
- 3: Tanpa melakukan apapun, node diam untuk sementara menunggu `readFile` selesai. Jika ada yang lainnya yang harus dilakukan, maka node langsung mengeksekusinya.
- 4: Setelah `readFile` selesai maka dia akan mengeksekusi callback-nya, `doneReading`, yang mana melakukan parsing `fileContents` yang berisi suatu bilangan `myNumber`, setelah itu inkrementasi `myNumber` dan lalu segera memanggil fungsi callback `addOne`, yaitu `logMyNumber`.

Mungkin bagian yang paling membingungkan dengan callbacks adalah bagaimana fungsi-fungsi tersebut diperlakukan sebagai objek yang dapat dimasukkan ke dalam variabel dan dimasukkan sebagai argumen dengan nama yang berbeda-beda. Memberikan nama yang sederhana yang deskriptif untuk variabel sangat penting agar kode Anda gampang dibaca. Secara umum di dalam program node ketika Anda melihat variabel `callback` atau `cb` maka Anda mengasumsikannya sebagai sebuah fungsi.

Anda mungkin pernah mendengar isitlah `evented programming` atau `event loop`. Mereka mengacu pada bagaimana `readFile` diimplementasikan. Node pertama kali mengirim pengoperasian `readFile` lalu menunggu `readFile` sampai selesai. Ketika menunggu node dalap melakukan hal-hal lainnya. Di dalam node terdapat daftar hal-hal yang telah dikirimkan akan tetapi belum dapat respon balik, oleh sebab itu node melakukan loop terhadap daftar tersebut sampai menemukan ada yang telah mengirimkan respon. Setelah selesai 'diproses', misal callback-callback yang harus ditunggu berhasil baru bisa dipanggil.

Berikut adalah versi pseudocode dari contoh di atas:

```js
function addOne(thenRunThisFunction) {
  waitAMinuteAsync(function waitedAMinute() {
    thenRunThisFunction()
  })
}

addOne(function thisGetsRunAfterAddOneFinishes() {})
```

Bayangkan Anda memiliki 3 fungsi asynchronous `a`, `b` dan `c`. Masing-masing memakan waktu 1 menit untuk berjalan dan setelah selesai maka akan memanggil sebuah callback(yang dimasukkan ke dalam argumen pertama). Jika Anda ingin mengatakan pada node 'mulai jalankan a, lalu jalankan b setelah a selesai, dan setelah itu jalankan c setelah b selesai' maka akan terlihat seperti ini:

```js
a(function() {
  b(function() {
    c();
  })
})
```

Ketika kode tersebut dieksekusi, `a` akan segera dijalankan, lalu semenit kemudian setelah selesai `b` dipanggil, lalu semenit kemudian `c` dipanggil dan setelah 3 menit berjalan node akan berhenti karena tidak ada lagi yang harus dilakukan. Ada cara yang lebih elegan untuk menulis contoh di atas, akan tetapi yang penting anda memiliki kodingan yang mampu menunggu kode anyc lainnya selesai dan memberikan ketergantungan pada fungsi dengan memberikan fungsi sebagai callback.

Desain dari node membutuhkan Anda untuk berpikir secara tidak linear. Coba pahami daftar operasi berikut:

```
baca sebuah file
proses file tersebut
```

Jika Anda ingin mengubahnya menjadi pseudocode maka akan menjadi:

```
var file = readFile()
processFile(file)
```

Jenis linear (step-by-step, secara berurutan) ini bukanlah cara node bekerja. Jika kode ini dieksekusi maka `readFile` dan `processFile` akan keduanya dieksekusi pada waktu yang bersamaan. Ini tidak mungkin terjadi karena `readFile` akan membutuhkan waktu untuk selesai. Melainkan Anda harus membuat `processFile` bergantung pada `readFile` jika telah selesai. Ini tujuan dari callbacks! dan karena cara Javascript bekerja Anda dapat menulis ketergantungan ini dengan berbagai cara:

```js
var fs = require('fs')
fs.readFile('movie.mp4', finishedReading)

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}
```

Anda juga dapat mengubah struktur kode seperti ini dan masih akan berjalan:

```js
var fs = require('fs')

function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
}

fs.readFile('movie.mp4', finishedReading)
```

atau bahkan seperti ini:

```js
var fs = require('fs')

fs.readFile('movie.mp4', function finishedReading(error, movieData) {
  if (error) return console.error(error)
  // do something with the movieData
})
```

## Events

Di dalam node jika membutuhkan modul [events](https://nodejs.org/api/events.html) Anda dapat menggunakan 'event emitter' yang digunakan oleh node untuk semua API-API yang mengirim sesuatu.

Event adalah pola umum yang ada di dalam pemograman, diketahui sebagai ['observer pattern'](https://en.wikipedia.org/wiki/Observer_pattern) atau 'pub/sub' (publish/subscribe). Sedangkan callback adalah hubungan one-to-one antara sesuatu yang meunggu fungsi callback dan sesuatu yang memanggil callback, callback sama saja dengan event hanya saja event pada umumnya bersifat many-to-many.

Cara paling mudah untuk memahami event adalah dengan memahami bahwa mereka membuat anda berlangganan terhadap berbagai hal. Anda bisa mengatakan 'ketika X maka lakukan Y', dimana dengan callback ini adalah 'lakukan X lalu Y'. 

Berikut adalah beberapa penggunaan umum untuk even selain dari callback:

- Ruang chat dimana Anda ingin melakukan broadcast pesan ke banyak orang.
- Server game yang harus tau kapan player baru terhubung, putus, pindah, menembak dan loncat.
- Game engine dimana Anda ingin membiarkan game developers menunggu event-event seperti `.on('jump', function() {})`
- Sebuah web server low level yang ingin memberikan API yang dapat dengan mudah dipanggil ke dalam even seperti `.on('incomingRequest')` atau `.on('serverError')`

Jika kita hendak mencoba menulis modul yang terhubung ke sebuah server chat menggunakan callback maka dapat dilakukan seperti ini:

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

Seperti yang Anda lihat ini sangat tidak praktis karena semua fungsi-fungsi harus Anda masukkan ke dalam urutan tertentu ke fungsi `.connect`. Menulis ini menggunakan event terlihat seperti ini:

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

Pendekatan ini sama dengan pendekatan pure-callback akan tetapi memperkenalkan `.on` method, yang meng-subskripsikan sebuah callback pada sebuah event. Ini artinya Anda dapat memilih event mana yang ingin Anda subskripsikan dari `chatClient`. Anda juga dapat meng-subskripsikan pada event yang sama berkali-kali dengan callback yang berbeda-beda:

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

Pada permulaan projek node filesystem dan networks API memiliki pola mereka tersendiri untuk berurusan dengan modul streaming I/O. Sebagai contoh, file-file di dalam sistem file mempunyai 'file descriptor' sehingga modul `fs` harus memiliki logic tambahan untuk menjaga hal-hal tersebut sedangkan modul-modul network tidak memiliki konsep tersebut. Meskipun perbedaan kecil didalam semantika ini, pada dasarnya keduanya memiliki fungsi-fungsi yang sama ketika hendak membaca data masuk dan keluar. Tim yang mengerjakan node menyadari bahwa akan membingungkan jika harus mempelajari 2 set semantika yang pada dasarnya melakukan hal yang sama sehingga membuat API baru yang bernama `Stream` dan membuat semua network dan kode filesystem menggunakannya.

Poin secara keseluruhan dari node adalah untuk membuatnya mudah berurusan dengan filesystem dan networks sehingga masuk akal jika memiliki satu pola yang dapat digunakan dimana-mana. Kabar baiknya adalah kebanyakan pola-pola seperti itu(sedikit darinya) sudah diketahui pada saat ini dan node tidak akan berubah banyak pada masa mendatang.

Ada 2 sumber utama yang dapat Anda gunakan untuk mempelajari tentang node streams. Pertama adalah stream-adventure (lihat Learn Node Interactively section) dan yang lainnya adalah referensi disebut dengan Stream Handbook.

### Stream Handbook

[stream-handbook](https://github.com/substack/stream-handbook#introduction) adalah panduan, yang sama dengan yang satu ini, yang mengandung referensi untuk semua hal yang Anda ingin tau mengenai streams.

[![stream-handbook](stream-handbook.png)](https://github.com/substack/stream-handbook)

## Modul-modul

Node core terdiri dari sekitar dua lusin modul, beberapa bersifat low level seperti `events` dan `stream` dan beberapa bersifat high level seperti `http` dan `crypto`.

Desain seperti ini memang sudah direncanakan. Node core haruslah berukuran kecil, dan modul-modul di dalamnya harus focus menyediakan kebutuhan-kebutuhan untuk bekerja dengan protokol-protokol I/O yang lumrah digunakan dan memiliki format secara cross-platform.

Untuk hal lainnya terdapat [npm](https://www.npmjs.com/). Siapapun dapat membuat modul baru yang dapat ditambahkan dan dipublish ke npm. Pada saat menulis ini terdapat sekitar 34.000 modul yang terdapat pada npm.

### Bagaimana cara menemukan sebuah modul

Bayangkan Anda mencoba mencari modul untuk mengubah PDF menjadi file TXT. Tempat terbaik untuk memulai adalah dengan melakukan `npm search pdf`:

![pdfsearch](npm-search.png)

Terdapat banyak hasil! npm sangat terkenal dan Anda biasanya akan dapat menemukan berbagai solusi-solusi yang potensial. Jika Anda memeriksa masing-masing modul dan mengecilkan hasil pencarian (menyaring hal seperti modul PDF generations) maka Anda akan mendapatkan hal-hal berikut:

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

Banyak modul-modul yang saling tumpang tindih tapi terdapat API alternatif dan kebanyakan dari mereka membutuhkan depedensi eksternal (seperti `apt-get install poppler`).

Berikut adalah beberapa cara yang berbeda untuk menginterpretasikan modul-modul:

- `pdf2json` adalah satu-satunya yang ditulis menggunakan Javascript murni, yang berarti yang paling mudah diinstall, khususnya pada devices dengan daya rendah seperti raspberry pi atau pada Windows dimana kode native mungkin saja tidak bersifat cross-platform.
- modul-modul seperti `mimeograph`, `humus` dan `pdf-extract` masing-masing menggabungkan berbagai modul-modul yang bersifat low level untuk diberikan pada API yang bersifat high level.
- Ada banyak modul-modul yang berdasarkan pada `pdftotext`/`poppler` unix command line tools.

Mari bandingkan perbedaan antara `pdftotextjs` dan `pdf-text-extract`, keduanya adalah merupakan wrapper untuk utilitas `pdftotext`.

![pdf-modules](pdf-modules.png)

Keduanya merupakan:

- diupdate relatif baru-baru ini
- memiliki repositori github
- memiliki READMEs
- memiliki setidaknya beberapa orang yang memasangnya setiap minggu
- memiliki lisensi yang membebaskan dari apapun(siapapun dapat menggunakannya)

Dengan melihat `package.json` + statistik modul susah untuk memilih pilihan yang tepat. Mari kita bandingkan keduanya:

![pdf-readmes](pdf-readmes.png)

Keduanya memiliki deskripsi sederhana, label CI, petunjuk pemasangan, contoh yang jelas dan petunjuk untuk menjalankan tes-tes. Bagus! akan tetapi yang mana akan kita gunakan? mari kita bandingkan kode-nya:

![pdf-code](pdf-code.png)

`pdftotextjs` memiliki sekitar 110 bari kode, dan `pdf-text-extract` memiliki sekitar 40, maka keduanya secara mendasar mengacu pada hal ini:

```
var child = shell.exec('pdftotext ' + self.options.additional.join(' '));
```

Apakah ini menjadikan satunya lebih baik dari satunya? Susah untuk dikatakan! Sangat penting untuk benar-benar *membaca* kode yang membuat kesimpulan sendiri. Jika Anda menemukan modul yang Anda suka, gunakan `npm star namamodul` untuk memberikan npm feedback tentang modul yang Anda memiliki pengalaman yang positif dengannya.

### Alur kerja development yang bersifat modular.

npm berbeda dengan kebanyakan paket manager dimana dia memasang modul-modul ke dalam sebuah folder di dalam modul-modul lainnya. Kalimat sebelumnya mungkin saja tidak masuk akal sekarang akan tetapi itulah kunci kesuksesan dari npm. 

Banyak package manager meng-instal banyak hal secara global. Sebagai contoh, jika Anda melakukan `apt-get install couchdb` on Debian Linux maka akan menginstall versi paling stabil dari CouchDB. Jika Anda mencoba meng-instal CouchDB sebagai depedensi dari beberapa software dan software tersebut membutuhkan versi lama dari CouchDB, Anda harus meng-uninstall versi baru dan meng-instal versi lama. Anda tidak dapat memiliki 2 versi karena Debian hanya memasangnya pada satu tempat.

Bukan hanya Debian melakukan ini. Kebanyakan package manager bahasa pemograman lain bekerja seperti ini juga. Untuk mengatasi masalah depedensi global yang dijelaskan di atas terdapat virtual environment yang dikembangkan seperti [virtualenv](http://python-guide.readthedocs.org/en/latest/dev/virtualenvs/) untuk Python atau [bundler](http://bundler.io/) untuk Ruby. Hal tersebut membagi environment Anda menjadi banyak environment virtual, masing-masinguntuk satu project, tatapi di dalam setiap environment depedensi tersebut masih terpasang secara global. Environment virtual tidak selalu memecahkan masalah yang ada, kadang mereka harus mengkali lipatkannya dengan menambah kompleksitas.

Dengan npm yang memasang modul-modul global merupakan sebuah anti-pattern. Sama seperti bagaimana Anda sebaiknya tidak menggunakan variabel global dalam program Javascript Anda maka Anda juga sebaiknya tidak meng-install modul-modul tersebut secara global (kecuali Anda butuh sebuah modul dengan binary yang dapat dieksekusi muncul di dalam global `PATH`, tapi Anda tidak harus selalu melakukan ini -- akan dijelaskan lebih lanjut).

#### Bagaimana `require` bekerja

Ketika Anda memanggil `require('sebuah_modul')` di dalam node inilah yang terjadi:

1. jika file yang bernama `sebuah_modul.js` ada di dalam folder ini maka node akan memuatnya, jika tidak:
2. node akan mencari folder `sebuah_modul` tersebut di dalam `node_modules`
3. jika tidak juga ditemukan, maka akan dicari satu folder di atasnya dan diulang dari step 2

Siklus ini berulang sampai node mencapai folder root dari filesystem, yang mana node akan memeriksa keberadaan folder-folder modul global (e.g. `/usr/local/node_modules` on Mac OS) and jika `sebuah_modul` masih belum ditemukan maka akan mengeluarkan exception.

Berikut adalah contoh visual:

![mod-diagram-01](mod-diagram-01.png)

Ketika direktori tempat bekerja sekarang adalah `subsubfolder` dan `require('foo')` dipanggil, node akan mencari folder yang bernama `subsubfolder/node_modules`. Pada kasus ini tidak akan ditemukan -- ada folder yang salah disebut `my_modules`. Maka node akan melakukan pencarian pada level atas selanjutnya dan mencoba lagi, yaitu dengan mencari `subfolder_B/node_modules`, yang mana juga tidak ada. Percobaan ke-tiga membuahkan hasil, karena `folder/node_modules` ada dan memiliki folder bernama `foo` di dalamnya. Jika `foo` tidak ada di sana maka node akan melanjutkan pencarian pada folder di level yang lebih tinggi.

Perlu menjadi catatan jika dipanggil dari `subfolder_B` node tidak akan menemukan `subfolder_A/node_modules`, dia hanya akan menemukan `folder/node_modules` pada saat mencarinya di dalam folder-folder di atasnya.

Salah satu keuntungan dari penggunaan npm adalah modul-modul dapat meng-install modul-modul yang mereka bergantung padanya pada versi tertentu. Pada kasus ini modul `foo` cukup sangat terkenal - ada 3 salinan, masing-masing ada di dalam folder modul induknya. Alasan untuk ini adalah masing-masing modul induk membutuhkan versi yang berbeda-beda dari `foo`, misal 'folder' membutuhkan `foo@0.0.1`, `subfolder_A` membutuhkan `foo@0.2.1` dan lainnya.

Inilah yang terjadi ketika kita memperbaiki error pada penamaan folder dengan mengganti `my_modules` menjadi nama yang tepat `node_modules`:

![mod-diagram-02](mod-diagram-02.png)

Untuk menguji modul mana yang benar-benar dimuat oleh node, Anda dapat menggunakan perintah `require.resolve('sebuah_modul')`, yang akan menunjukkan path dari modul yang ditemukan oleh node sebagai hasil dari proses pencarian di dalam tree folder. `require.resolve` dapat berguna ketika ingin memastikan modul yang Anda *kira* dimuat *benar-benar* dimuat. -- kadang terdapat versi lain dari modul yang sama yang ada di direktori yang berdekatan berbeda dari versi yang Anda inginkan.

### Bagaimana cara menulis modul

Sekarang Anda tau cara menemukan modul dan memasukkannya maka selanjutnya Anda dapat memulai menulis modul Anda sendiri.

#### Modul yang paling sederhana

Modul-modul node benar-benar sangat ringan. Berikut adalah modul-modul node paling sederhana yang bisa dibuat:

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

Secara default node mencoba memuat `module/index.js` ketika Anda melakukan `require('modul')`, file dengan nama lain tidak akan bekerja kecuali Anda menaruh `main` dari `package.json` mengarah padanya.

Letakkan kedua file tersebut di dalam folder dengan nama `number-one` (`name` di dalam `package.json` harus sama dengan nama folder) dan Anda akan menghasilkan modul node yang bekerja.

Pemanggilan fungsi `require('number-one')` mengembalikan nilai-nilai yang ada di dalam `module.exports` yang ditaruh di dalam modul tersebut:

![simple-module](simple-module.png)

Sebuah cara yang lebih cepat untuk membuat sebuah modul adalah dengan menjalankan perintah berikut:

```sh
mkdir my_module
cd my_module
git init
git remote add git@github.com:yourusername/my_module.git
npm init
```

Dengan menjalankan `npm init` maka akan membuat `package.json` yang valid untuk Anda dan jika Anda menjalankannya di dalam sebuah repo git maka akan secara otomatis menambahkan `repositories` ke dalam `package.json` secara otomatis.

#### Menambah depedensi

Sebuah modul dapat berisi modul-modul lainnya dari npm atau Github di dalam `depedencies` dari `package.json`. Untuk memasang modul `request` sebagai depedensi baru dan secara otomatis menambahkannya ke dalam `package.json` jalankan perintah berikut di dalam direktori root Anda:

```sh
npm install --save request
```

Instalasi dari salinan `request` ini ke dalam folder `node_modules` terdekat dan membuat `package.json` menjadi seperti ini:

```
{
  "id": "number-one",
  "version": "1.0.0",
  "dependencies": {
    "request": "~2.22.0"
  }
}
```

Secara default `npm install` akan mengambil versi paling terbaru dari modul.

## Pengembangan sisi klien dengan npm

Sebuah miskonsepsi yang umum tentang npm adalah karena terdapat 'Node' dalam namanya maka hanya digunakan untuk modul-modul server side dari JS. Ini tidak benar! npm sebenarnya kepanjangan dari Node Packaged Modules, atau modul-modul yang Node paketkan bersama untuk Anda. Modul-modul tersebut bisa apa saja yang Anda inginkan -- mereka hanya sebuah folder dari file-file yang dibungkus ke dalam .tar.gz, dan sebuah file yang disebut `package.json` yang mendeklarasikan versi dari modul dan sebuah daftar dari semua modul yang menjadi depedensi dari modul tersebut (juga nomor versi mereka sehingga versi yang berjalan dipasang secara otomatis). Hal ini dapat di perjelas seperti - depedensi dari modul-modul juga merupakan modul-modul, dan modul-modul tersebut dapat memiliki depedensi-depedensi juga dan seterusnya.

[browserify](http://browserify.org/) adalah sebuah utilitas yang ditulis menggunakan Node yang mencoba mengubah modul node menjadi kode yang dapat dijalankan di dalam browser. Tidak semua modul bisa bekerja (browser tidak dapat melakukan hal-hal seperti menjalankan server HTTP), tapi kebanyakan modul-modul NPM *akan* bekerja.

Untuk mencoba npm di dalam browser Anda akan menggunakan [RequireBin](http://requirebin.com/), sebuah aplikasi yang saya Buat yang memanfaatkan [Browserify-CDN](https://github.com/jfhbrook/wzrd.in), yang secara internal menggunakan browserify tetapi mengembalikan keluaran melalui HTTP (melainkan dari command line -- yang mana biasanya browserify digunakan).

Coba taruh kode ini ke dalam RequireBin dan tekan tombol preview:

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

Seperti tool-tool bagus lainnya, node sangat cocok untuk beberapa contoh kasus saja. Seperti contoh: Rails, web framework yang popular, sangat bagus untuk memodelkan [business logic](https://en.wikipedia.org/wiki/Business_logic) yang kompleks, misal menggunakan node untuk merepresentasikan objek bisnis di dunia nyata seperti akun, pinjaman, perjalanan, dan inventaris. Dimana secara teknis sangat memungkinkan untuk melakukan hal yang sama menggunakan node, akan ada kekurangan yang pasti karena node didesain untuk mengatasi permasalahan I/O dan tidak tau banyak tentang 'business logic'. Masing-masing tool fokus pada masalah-masalah yang berbeda. Diharapkan panduan ini akan membantu Anda mendapatkan pemahaman intuitif akan kekuatan dari node sehingga Anda tau kapan ini berguna untuk Anda.

### Apa saja diluar dari lingkup node?

Secara dasar node hanyalah sebuah alat yang digunakan untuk mengatur I/O antar filesystem dan jaringan, dan menyerahkan fungsionalitas lainnya kepada modul-modul pihak ketiga. Berikut adalah beberapa hal yang berada diluar lingkup node:

#### Web Framework

Ada banyak web framework yang dibangun diatas node (framework berarti sekumpulan solusi-solusi yang berusaha untuk menyelesaikan masalah level atas seperti memodelkan business logic), tetapi node itu sendiri bukanlah web framework. Web framework yang dibangun menggunakan node tidak selalu membuat keputusan yang sama tentang penambahan kompleksitas, abtraksi dan tradeoff dan mungkin saja punya prioritas lainnya.

#### Language syntax

Node menggunakan JavaScript dan tidak mengubah apa-apa darinya. Felix Geisendörfer memiliki penulisan tersendir terhadap 'node style' [here](https://github.com/felixge/node-style-guide).

#### Language abstraction

Ketika node menggunakan cara yang paling sederhana untuk memecahkan sesuatu. Semakin 'mewah' Anda membuat JavaScript semakin banyak tradeoff dan kompleksitas yang Anda kenalkan. Programming itu sulit, khususnya di dalam JS dimana terdapat 1000 solusi untuk setiap masalah! Untuk alasan inilah node mencoba selalu mengambil masalah yang paling sederhana, pilihan yang paling universal. Jika Anda sedang memecahkan sebuah masalah yang mengharuskan solusi yang kompleks dan Anda tidak puas dengan 'solusi vanilla JS' yang node implementasikan, Anda bebas untuk memecahkannya sendiri di dalam app atau modul menggunakan abstraksi apapun yang Anda sukai.

Contoh paling cocok untuk ini adalah penggunaan dari callbacks. Pada mulanya node bereksperimen dengan sebuah fitur yang disebut 'promises' yang menambahkan berbagai macam fitur-fitur untuk membuat kode asynchronous tampil lebih linear. Hal ini dikeluarkan dari node dengan alasan:

- Mereka lebih kompleks dari callbacks
- Mereka dapat diimplementasikan di userland (terdistribusi pada npm sebagai modul pihak ketiga)

Pikirkan salah satu hal yang paling dasar dan universal yang node lakukan: membaca file. Ketika Anda membaca sebuah file Anda ingin tau kapan error terjadi, seperti ketika Anda ingin tau kapan error terjadi, seperti ketika hard drive Anda mati ditengah-tengah proses pembacaan. Jika node memiliki promises semua orang akan membuat kode mereka seperti ini:

```js
fs.readFile('movie.mp4')
  .then(function(data) {
    // do stuff with data
  })
  .error(function(error) {
    // handle error
  })
```

Hal ini menambah kompleksitas, dan tidak semua orang menginginkannya. Melainkan 2 fungsi terpisah node hanya menggunakan satu fungsi callback. Berikut adalah aturannya:

- Ketika tidak ada error masukkan null sebagai argument pertama
- Ketika ada sebuah error, masukkan sebagai argument pertama
- Argumen-argumen selebihnya dapat digunakan untuk apapun (biasanya data atau response karena kebanyakan node hanyalah melakukan pembacaan dan penulisan)

Karenanya, style dari node callback adalah:

```js
fs.readFile('movie.mp4', function(err,data) {
  // handle error, do stuff with data
}) 
```

#### Threads/fibers/solusi konkurensi non-event-based 

Catatan: Jika Anda tidak tau apa arti dari hal-hal di atas maka Anda akan memiliki kemudahan dalam mempelajari node, karena untuk tidak mempelajari ini sama beratnya ketika harus mempelajarinya.

Node menggunakan threads internal untuk membuat hal-hal menjadi cepat tetapi tidak menampakkannya kepada user. Jika Anda seorang user teknis penasaran kenapa node didesain sedemikian rupa maka Anda sebaiknya membaca 100% tentang [the design of libuv](http://nikhilm.github.io/uvbook/), layer I/O dari C++ yang mana node dibangun menggunakannya.

## Lisensi

![CCBY](CCBY.png)

Creative Commons Attribution License (do whatever, just attribute me)
http://creativecommons.org/licenses/by/2.0/

Donate icon is from the [Noun Project](https://thenounproject.com/term/donate/285/)
