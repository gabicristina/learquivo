var fs;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 5 * 1024 * 1024,
			onFSSuccess, errorHandler);
};

// The directory path is without the prefix of the root directory!
function onFSSuccess(fileSystem) {
	//link com exemplo de acesso à câmera: http://www.raymondcamden.com/index.cfm/2014/2/17/Cordova-File-System--Important-Update
	this.fs = fileSystem;
	fileSystem.root.getDirectory("EasyScore", {
		create : true,
		exclusive : false
	}, doDirectoryListing, errorHandler);
};

// dirEntry needs to be a parameter of the function!
function doDirectoryListing(dirEntry) {
	var directoryReader = dirEntry.createReader();
	directoryReader.readEntries(gotFiles, FileError);
};

function gotFiles(entries) {
	for (var i = 0, len = entries.length; i < len; i++) {
		if (entries[i].isDirectory) {
			alert("Directory: " + entries[i].name);
			$('ul').append($('<li/>', { // here appending `<li>`
				'data-role' : "list-divider"
			}).append($('<a/>', { // here appending `<a>` into `<li>`
				'href' : '#musica_info',
				'data-transition' : 'fade',
				'text' : entries[i].name
			})));
		} else if (entries[i].isFile) {
			alert("File: " + entries[i].toURL());
			document.getElementById('entry_path').textContent = "Entry: "
					+ entries[i].toURL();
			
			//TENTA CRIAR UM FILE
			var file_teste = new File(entries[i].name, entries[i].fullPath);
			document.getElementById('file_size').textContent = file_teste.fullPath;
			document.getElementById('file_path').textContent = "File: "
					+ file_teste.localURL;
			
			//TENTA LER O ENTRY
			var reader = new FileReader();
			// fs.root.getFile("EasyScore", {create: true, exclusive: false},
			// doDirectoryListing, fail);
			entries[i].file(function(file) {
				var reader = new FileReader();

				reader.onloadend = function(e) {
					if (e.target.readyState == FileReader.DONE) { // DONE == 2
						document.getElementById('result').value = this.result;
					}
				};
				
				reader.onerror = errorReaderHandler;
				
				reader.readAsText(file);
			}, errorHandler);
		}
	}
};

function readFile() {
	fs.root.getFile("EasyScore/chant.xml", {
			create : false,
			exclusive : false
	}, function(fileEntry) {
		// onSuccess
		alert("oi!");
		fileEntry.file(function(file) {
			var reader = new FileReader();
			reader.onloadend = function(e) {
				if (e.target.readyState == FileReader.DONE) { // DONE == 2
					document.getElementById('res_botao').value = this.result;
				}
			};
			reader.onerror = errorReaderHandler;
			reader.readAsText(file);
		},errorHandler);
	},errorHandler);
}

function errorHandler(e) {
	alert("errorHandler (entries[i].file)");
	var msg = '';

	switch (e.code) {
	case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
	case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
	case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
	case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
	case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
	default:
		msg = 'Unknown Error';
		break;
	};
	console.log('Error: ' + msg);
};

function errorReaderHandler(evt) {
	alert("errorReaderHandler (entries[i]... readAsText)");
	switch(evt.target.error.code) {
	  case evt.target.error.NOT_FOUND_ERR:
	    alert('File Not Found!');
	    break;
	  case evt.target.error.NOT_READABLE_ERR:
	    alert('File is not readable');
	    break;
	  case evt.target.error.ABORT_ERR:
		  alert('ABORT, ABORT!');
		  break; // noop
	  default:
	    alert('An error occurred reading this file.');
    };
};