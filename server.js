require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080; // Railway prefers 8080

// ✅ MongoDB Connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log('✅ Connected to MongoDB'))
	.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Schema
const applicationSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	whatsapp: String,
	instagram: String,
	treksCount: String,
	region: String,
	dreamTrek: String,
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

const Application = mongoose.model('Application', applicationSchema);

// ✅ Middleware
app.use(cors({origin: process.env.CORS_ORIGIN || '*'}));
app.use(express.json());

// ✅ Serve frontend
app.use(express.static(__dirname));

// ✅ Root route
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ API route
app.post('/submit', async (req, res) => {
	try {
		const newApplication = new Application(req.body);
		await newApplication.save();

		res.status(200).json({
			message: 'Application successfully saved to MongoDB.',
		});
	} catch (error) {
		console.error('❌ Failed to save application:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}
});

// ✅ IMPORTANT: Catch-all route (fixes Railway 404)
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ IMPORTANT: Listen on 0.0.0.0 (REQUIRED for Railway)
app.listen(PORT, '0.0.0.0', () => {
	console.log(`🚀 Server running on port ${PORT}`);
});

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Connect to MongoDB
// mongoose
// 	.connect(process.env.MONGO_URI)
// 	.then(() => console.log('✅ Connected to MongoDB'))
// 	.catch((err) => console.error('❌ MongoDB connection error:', err));

// // Define the Schema & Model for MongoDB
// const applicationSchema = new mongoose.Schema({
// 	firstName: String,
// 	lastName: String,
// 	whatsapp: String,
// 	instagram: String,
// 	treksCount: String,
// 	region: String,
// 	dreamTrek: String,
// 	timestamp: {
// 		type: Date,
// 		default: Date.now,
// 	},
// });

// const Application = mongoose.model('Application', applicationSchema);

// // Middleware
// app.use(
// 	cors({
// 		origin: process.env.CORS_ORIGIN || '*',
// 	}),
// );
// app.use(express.json());

// // Serve static files from the current directory
// app.use(express.static(__dirname));

// // Endpoint to handle form submissions
// app.post('/submit', async (req, res) => {
// 	try {
// 		const formData = req.body;

// 		// Create a new application document and save to MongoDB
// 		const newApplication = new Application(formData);
// 		await newApplication.save();

// 		res.status(200).json({
// 			message: 'Application successfully saved to MongoDB.',
// 		});
// 	} catch (error) {
// 		console.error('Failed to save application:', error);
// 		res.status(500).json({message: 'Internal Server Error'});
// 	}
// });

// app.listen(PORT, () => {
// 	console.log(
// 		`Backend server running. Listening on http://localhost:${PORT}`,
// 	);
// });
