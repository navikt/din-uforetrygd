import express from 'express'
import next from 'next'

const isDev = process.env.NODE_ENV !== 'production'
const app = next({ dev: isDev })
const handle = app.getRequestHandler()
const server = express()

app
  .prepare()
  .then(() => {
    server.get(/(.*)/, (req, res) => {
      return handle(req, res)
    })

    server.listen(8080, () => {
      console.log('server ready on port 8080')
    })
  })
  .catch((exception) => {
    console.error(exception.stack)
    process.exit(1)
  })
