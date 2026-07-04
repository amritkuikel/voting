import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function initDatabase() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		console.error('DATABASE_URL environment variable is not set');
		process.exit(1);
	}

	const sqlClient = neon(databaseUrl);

	try {
		console.log('Initializing database...');

		// Drop existing tables
		console.log('Dropping existing tables...');
		await sqlClient.query('DROP TABLE IF EXISTS votes');
		await sqlClient.query('DROP TABLE IF EXISTS election_state');
		await sqlClient.query('DROP TABLE IF EXISTS candidates');

		// Create tables
		console.log('Creating tables...');
		await sqlClient.query(`CREATE TABLE candidates (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			position VARCHAR(50) NOT NULL,
			house VARCHAR(20),
			symbol VARCHAR(100) NOT NULL,
			symbol_image VARCHAR(255) NOT NULL,
			photo_image VARCHAR(255) NOT NULL,
			vote_count INTEGER DEFAULT 0 NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`);

		await sqlClient.query(`CREATE TABLE votes (
			id SERIAL PRIMARY KEY,
			head_boy_candidate_id INTEGER NOT NULL,
			head_girl_candidate_id INTEGER NOT NULL,
			selected_house VARCHAR(20) NOT NULL,
			house_captain_candidate_id INTEGER NOT NULL,
			voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`);

		await sqlClient.query(`CREATE TABLE election_state (
			id SERIAL PRIMARY KEY,
			is_active BOOLEAN DEFAULT FALSE NOT NULL,
			total_votes INTEGER DEFAULT 0 NOT NULL,
			started_at TIMESTAMP,
			stopped_at TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`);

		// Insert Head Boy candidates
		console.log('Inserting Head Boy candidates...');
		await sqlClient.query("INSERT INTO candidates (name, position, symbol, symbol_image, photo_image) VALUES ('Sugam Gomja', 'head_boy', 'Book', 'Book.png', 'Book1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, symbol, symbol_image, photo_image) VALUES ('Saugat Shrestha', 'head_boy', 'Sunglass', 'Sunglass.png', 'Sunglass1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, symbol, symbol_image, photo_image) VALUES ('Prince Bajagain', 'head_boy', 'Duster', 'Duster.jpg', 'Duster1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, symbol, symbol_image, photo_image) VALUES ('Aaditya Chimariya', 'head_boy', 'Chair', 'Chair.png', 'Chair1.jpg')");

		// Insert Head Girl candidates
		console.log('Inserting Head Girl candidates...');
		await sqlClient.query("INSERT INTO candidates (name, position, symbol, symbol_image, photo_image) VALUES ('Anshu Pokhrel', 'head_girl', 'Belt', 'Belt.png', 'Belt1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, symbol, symbol_image, photo_image) VALUES ('Krinsha Mainali', 'head_girl', 'Table', 'Table.png', 'Table1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, symbol, symbol_image, photo_image) VALUES ('Arpita Pokhrel', 'head_girl', 'Marker', 'Marker.png', 'Marker1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, symbol, symbol_image, photo_image) VALUES ('Srijana Thing', 'head_girl', 'Fan', 'Fan.png', 'Fan1.jpg')");

		// Insert Blue House candidates
		console.log('Inserting Blue House candidates...');
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Ajay Ghimire', 'house_captain', 'blue', 'Key', 'Key.png', 'Key1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Sadikshya Mainali', 'house_captain', 'blue', 'Stapler', 'Stapler.png', 'Stapler1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Ayusha Ghimire', 'house_captain', 'blue', 'Tap', 'Tap.png', 'Tap1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Punam Adhikari', 'house_captain', 'blue', 'House', 'house.png', 'house1.jpg')");

		// Insert Yellow House candidates
		console.log('Inserting Yellow House candidates...');
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Archand Thada Magar', 'house_captain', 'yellow', 'Bicycle', 'bicycle.png', 'bicycle1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Roshan Bishwokarma', 'house_captain', 'yellow', 'Flower', 'flower.png', 'Flower1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Subodh Khanal', 'house_captain', 'yellow', 'Bulb', 'Bulb.png', 'Bulb1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Puspa Ale Magar', 'house_captain', 'yellow', 'Monitor', 'Monitor.png', 'Monitor1.jpg')");

		// Insert Red House candidates
		console.log('Inserting Red House candidates...');
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Aaditya Lakai', 'house_captain', 'red', 'Tie', 'Tie.png', 'Tie1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Swornima Pokhrel', 'house_captain', 'red', 'Geometry Box', 'Geometry Box.jpg', 'Geometry Box1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Mandip Magar', 'house_captain', 'red', 'Mouse', 'Mouse.png', 'Mouse1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Ujjwal Poudel', 'house_captain', 'red', 'Umbrella', 'umbrella.png', 'Umbrella1.jpg')");

		// Insert Green House candidates
		console.log('Inserting Green House candidates...');
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Rubus Parajuli', 'house_captain', 'green', 'Keyboard', 'Keyboard.png', 'Keyboard1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Santosh Gole', 'house_captain', 'green', 'Bottle', 'Bottle.png', 'Bottle1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Nancy Neupane', 'house_captain', 'green', 'Watch', 'Watch.png', 'Watch1.jpg')");
		await sqlClient.query("INSERT INTO candidates (name, position, house, symbol, symbol_image, photo_image) VALUES ('Priyanka Chaudhary', 'house_captain', 'green', 'Speaker', 'Speaker.png', 'Speaker1.jpg')");

		// Initialize election state
		console.log('Initializing election state...');
		await sqlClient.query("INSERT INTO election_state (is_active, total_votes) VALUES (false, 0)");

		console.log('Database initialization completed successfully!');
	} catch (error) {
		console.error('Failed to initialize database:', error);
		process.exit(1);
	}
}

initDatabase();
