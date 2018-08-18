const fs = require('fs');
const NodeID3 = require('node-id3');
var readlineSync = require('readline-sync');

function updateID3(file){
	var path = './media/' + file;

	// show the user what ID3 values are already in place, then ask if they want to edit
	console.log(`\n The next file: ${file}`);

	let tags = NodeID3.read(path);

	console.log(`    Title: ${tags.title}, Artist: ${tags.artist}, Album: ${tags.album}, Track: ${tags.trackNumber}`);

	if (readlineSync.keyInYN('    Do you want to edit this file?')) {
		// ask user for basic ID3 info
		var title = readlineSync.question('\n    New title: ');
		var artist = readlineSync.question('    New artist: ');
		var album = readlineSync.question('    New album: ');
		var trackNumber = readlineSync.question('    New track number: ');

		// if user entered a new name, use that; if not, use the old one
		var newTags = {
			title: (title.length > 0 ? title : tags.title),
			artist: (artist.length > 0 ? artist : tags.artist),
			album: (album.length > 0 ? album : tags.album),
			TRCK: (trackNumber.length > 0 ? trackNumber : tags.trackNumber)
		}

		var success = NodeID3.update(newTags, path);
		if(success){
			console.log('\n    Success!');
		}
		else{
			console.log('\n    Fail :(');
		}
	}
	else{
		console.log('\n    Skipping file...');
	}
}

// scan directory and return list of filenames
var files = fs.readdirSync('media');

console.log('\n ' + files.length + ' files found in your media folder.');

// for each file, run through the process of requesting info from the user and rewriting the ID3 tags for the file
files.forEach(file => {
	updateID3(file);
});