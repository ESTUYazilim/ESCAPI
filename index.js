const express = require('express');
const app = express(); // express app
const dotenv = require('dotenv'); // import dotenv
const mongoose = require("mongoose") // import MongoDb
const cors = require('cors'); // for CORS policy
const fs = require('fs'); // file system
const path = require('path'); // path
const https = require('https'); // https
const http = require('http'); // http
const bodyParser = require('body-parser'); // body parser to parse as json
dotenv.config(); // configure dotenv to use secret keys


// routes
const authRoute = require('./routes/auth/auth');
const userRoute = require('./routes/user/user');
const courseRoute = require('./routes/course/course');

mongoose.set('strictQuery', true); // to avoid deprecation warning

// connect mongodb server
mongoose.connect(
	process.env.MONGO_DB_URL
)
	.then(() => console.log("DB connection established"))
	.catch((err) => console.log(err));

// middlewares
app.use(express.json()); // express
app.use(bodyParser.json());// using body-parser for the requests
app.use(cors()); // for CORS-POLICY

app.use("/auth", authRoute); // use auth endpoints if url starts with /auth
app.use("/user", userRoute); // use user endpoints if url starts with /user
app.use("/course", courseRoute); // use course endpoints if url starts with /course

// uncaught exception handler to catch uncaught exceptions
// prevents the app from crashing
process.on('uncaughtException', (err, origin) => {
	console.log(
		`Caught exception: ${err}\n` +
		`Exception origin: ${origin}`,
	);
});


// start http server
const httpServer = http.createServer(app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

// private location of the ssl certificates
const privLocation = process.env.PRIVATE_LOCATION;

// check if all required keys are set
if (fs.existsSync(`${privLocation}/privkey.pem`) && fs.existsSync(`${privLocation}/cert.pem`) && fs.existsSync
	(`${privLocation}/chain.pem`)) {
	// create credentials
	const privateKey = fs.readFileSync(`${privLocation}/privkey.pem`, 'utf8');
	const certificate = fs.readFileSync(`${privLocation}/cert.pem`, 'utf8');
	const ca = fs.readFileSync(`${privLocation}/chain.pem`, 'utf8');

	// create credentials
	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};
	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(443, () => {
		console.log('HTTPS Server running on port 443');
	});
} else {
	console.log('Not all required ssl certificates are set to run HTTP server.');
}
