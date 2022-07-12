// 调用Node内建的web server module
// const http = require('http')

/*
    使用http的createServer方法创建一个web server 
    一个事件处理器被注册到服务器，每当http request发送到该server地址，就会被调用
    request效应的代码为200,content-type为‘text/plain'
    返回网站的内容为Hello，world 
*/
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end('Hello World')
// })

// 调用express库，使用函数来创建一个express app并存在app中
const express = require('express')
const cors = require('cors')
const app = express()

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// 得到json-parser
app.use(express.json())
app.use(cors())
app.use(requestLogger)

/* 
  定义一个事件处理器来处理对root目录的get request
  第一个request参数包含所有HTTP request信息
  第二个response参数定义request如何response
  此处利用response对象的send方法使server发送内容的来响应HTTP request
  因为它是字符串，express自动得把它content-type设置为text/html，它的status code 是 200
*/
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

/*
  第二个路由定义一个处理响应GET request的notes 路径的app的事件处理器
  响应request是response对象的json方法，它可以把array解析为JSON格式串
  express自动把它content-type设置为application/json
*/
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

/*
  在request路径的id参数通过request对象获取
  find方法是找到匹配id的note
*/
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  // 如果获取到note，则返回，否则返回404并用end方法响应request而不返回任何data
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

// 生成post data 的id
const generatedId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0
  
  return maxId + 1

}
/*
  该事件处理器可以从request对象的属性body获得数据
  若没有json-parser，body属性会变undefined
  parser的作用是获取request的json数据
  如果content没有值那么设置为400并返回
  一定要返回，因为不返回会把错误data保存
  在服务器中，
*/
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    // 这样可以保证important属性在未指定时默认为false
    important: body.important || false,
    date: new Date(),
    id: generatedId()
  }

  notes = notes.concat(note)

  response.json(note)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
  // const app = http.createServer((request, response) => {
  //   response.writeHead(200, { 'Content-Type': 'application/json' })
  //   response.end(JSON.stringify(notes))
  // })

// 绑定分配给app变量的http server，来listen发送到3001 port的http request
// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
