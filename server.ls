require! {
	"webpack": webpack
	"webpack-dev-middleware": webpackDevMiddleware
	"webpack-hot-middleware": webpackHotMiddleware
	"./webpack.config.dev.ls": config
}

app = new (require('express'))()
port = 3000

compiler = webpack config
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get("/", (req, res) !->
	res.sendFile(__dirname + '/build/index.html')
)

app.listen(port, (error) !->
	if error
		console.error error
	else
		console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
)
