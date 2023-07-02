import { Hono } from 'hono'

type Bindings = {
	TOKEN: string
	ACCOUNT_ID: string
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


app.get('/images', async (c) => {
	const fd = new FormData()
	fd.append('requireSignedURLs', 'false') // access uploaded image without signed url if false 
	fd.append('metadata', JSON.stringify({ uploader: 'images' }))

	console.log('account_id', c.env.ACCOUNT_ID)
	const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/images/v2/direct_upload`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${c.env.TOKEN}`,
		},
		body: fd
	})
	if (resp.status !== 200) {
		const txt = await resp.text()
		console.log(resp.status, txt)
		return c.json({ error: txt }, 500)
	}
	const jresp = await resp.json() as {
		result: {
			id: string
			uploadURL: string
		}
	}
	const url = jresp.result.uploadURL

	return c.html(`
		<html>
			<body>
				<form action="${url}" method="post" enctype="multipart/form-data">
					<input type="file" id="myFile" name="file" />
					<input type="submit" />
				</form>
			</body>
		</html>
	`)
})

export default app
