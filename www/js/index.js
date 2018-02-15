/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Jaime Rosales 2016 - Forge Developer Partner Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////

var viewer;
var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken,
    documentId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cGFya2VyLXBvYy9Gcm9udCUyMExvYWRlci5pYW0uemlw'

}

var loadDocument = null;

var data = {
    "Items": [{
        "x": 1100.37674052735037833,
        "y": -95.0107518497603,
        "z": -402.620531023927,
        "type": "RFI"
    }]
} ;

Autodesk.Viewing.Initializer(options, function onInitialized() {
    Autodesk.Viewing.Document.load(options.documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
});


/**
 * Autodesk.Viewing.Document.load() success callback.
 * Proceeds with model initialization.
 */
function onDocumentLoadSuccess(doc) {

    loadDocument = doc;

    // A document contains references to 3D and 2D viewables.
    var viewable = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
        'type': 'geometry'
    }, true);
    if (viewable.length === 0) {
        console.error('Document contains no viewables.');
        return;
    }

    // Choose any of the available viewable
    var initialViewable = viewable[0];
    var svfUrl = doc.getViewablePath(initialViewable);


    var modelOptions = {
        sharedPropertyDbPath: doc.getPropertyDbPath()
    };

    var viewerDiv = document.getElementById('viewerDiv');

    window.addEventListener("onPointClick", function(){
        console.log("Point Clicked");
        var url = "http://corpappstest.parker.com/corpapps/EConfigurator/Home?mfgDivision=687680&option=0&series=156%20SERIES%20HOSE%20ASSEMBLY";
        window.open(url);
    }, false);

    ///////////////USE ONLY ONE OPTION AT A TIME/////////////////////////

    /////////////////////// Headless Viewer /////////////////////////////
    // viewer = new Autodesk.Viewing.Viewer3D(viewerDiv);
    //////////////////////////////////////////////////////////////////////

    //////////////////Viewer with Autodesk Toolbar///////////////////////
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
    //////////////////////////////////////////////////////////////////////

    viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
    viewer.setBackgroundColor(35, 31, 32, 35, 31, 32);

}


/**
 * Autodesk.Viewing.Document.load() failure callback.
 */
function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

/**
 * viewer.loadModel() success callback.
 * Invoked after the model's SVF has been initially loaded.
 * It may trigger before any geometry has been downloaded and displayed on-screen.
 */
function onLoadModelSuccess(model) {
    viewer.loadExtension("markup3d");
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoadedHandler);

    console.log('onLoadModelSuccess()!');
    console.log('Validate model loaded: ' + (viewer.model === model));
    console.log(model);
}

/**
 * viewer.loadModel() failure callback.
 * Invoked when there's an error fetching the SVF file.
 */
function onLoadModelError(viewerErrorCode) {
    console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
}

/**
 * Geometry Loader Listener
 */
function onGeometryLoadedHandler(event) {
    console.log("Geo loaded", data);
    window.dispatchEvent(new CustomEvent('newData', {'detail': data}));

    viewer.removeEventListener(
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        onGeometryLoadedHandler);

}


//
// data = {
//     "Items": [{
//         "markupId": 1510110198178253,
//         "x": -6.67074966430664,
//         "y": 0.0718488693237305,
//         "z": 15.8761157989502,
//         "type": "Issue",
//     }, {
//         "markupId": 1510110198178253,
//         "x": -5.26823234558105,
//         "y": -0.0148783922195435,
//         "z": 9.35631656646729,
//         "type": "Issue",
//     }]
// } ;
//
// window.dispatchEvent(new CustomEvent('newData', {'detail': data}));



// //
// // Engine
// data = {
//     "Items": [{
//         "x": 1100.37674052735037833,
//         "y": -95.0107518497603,
//         "z": -402.620531023927,
//         "type": "RFI"
//     }]
// } ;
// window.dispatchEvent(new CustomEvent('newData', {'detail': data}));