import { Hono } from 'hono'

type Bindings = {
	TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

// app.use(async (c, next) => {
// 	console.log('before')
// 	if (c.req.method === 'POST') {
// 		console.log(`POST ${c.req.url} ${JSON.stringify(c.req.body)}`)
// 	}
// 	await next()
// 	console.log('after')
// })

app.get('/', (c) => {
	const url = ""

	return c.html(`
<html>
 <body>
   <form
     action="${url}"
     method="post"
     enctype="multipart/form-data"
   >
     <input type="file" id="myFile" name="file" />
     <input type="submit" />
   </form>
 </body>
</html>
`)
})

export default app
