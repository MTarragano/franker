var frankerUserStyle = "";

// ==== Message Management ====

function frankerInjectHandleMessage(msgEvent) {
	if (msgEvent.name == "frankateSelectionResponse") {
		frankerCoreInjectTranslation(document, msgEvent.message, frankerUserStyle);
		frankerInjectTranslateNextSentence();
	} else if (msgEvent.name == "shortcutFrankateSelectionValue") {
		frankerInjectSetShortcut(msgEvent.message, frankerInjectFrankate);
	} else if (msgEvent.name == "shortcutFrankateCleanValue") {
		frankerInjectSetShortcut(msgEvent.message, frankerInjectClean);
	} else if (msgEvent.name == "styleDestinationValue") {
		frankerUserStyle = msgEvent.message;
	}
}


// ==== Shortcuts ====

function frankerInjectSetShortcut(str, func) {
	shortcut.remove(str); // must remove first to ensure we do not duplicate the shortcut
	shortcut.add(str, func, {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':true,
			'target':document
	});
}

function frankerInjectFrankate() {
	if (frankerCoreInit(document) == 0) {
		frankerInjectInitPort();
		frankerInjectTranslateNextSentence();
	} else {
		alert('Frankate failed, select a block of text first!');
	}
}

function frankerInjectTranslateNextSentence() {
	var srcText = "";
	while (srcText == "") {
		if (frankerCoreSelectNextSentence(document) != 0) {
			return;
		}
		srcText = frankerCoreGetSelectedText(document, true);
	}
	frankerPort.postMessage({name:"frankateSelectionRequest", message:srcText});
}

function frankerInjectClean() {
	frankerCoreClean(document);
}

// ==== Initial ====
var frankerPort;
function frankerInjectInitPort() {
	frankerPort = chrome.extension.connect({name: "Franker"});
	frankerPort.onMessage.addListener(frankerInjectHandleMessage);
}

frankerInjectInitPort();

frankerPort.postMessage({name: "shortcutFrankateSelectionRequest"});
frankerPort.postMessage({name: "shortcutFrankateCleanRequest"});
frankerPort.postMessage({name: "styleDestinationRequest"});
