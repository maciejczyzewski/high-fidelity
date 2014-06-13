// Podcast Atom/RSS parser. Downloads and extract useful info from a podcast
// feed and returns the data as easy-to-consume (and minimally changed)
// JavaScript objects.
// TODO: Make this less podcast-focused; it would be a useful RSS library
// in general.
(function() {
    'use strict';

    var NUMBER_OF_PODCASTS_TO_GET = 1000;

    // Download a podcast feed from the URL specified. Execute a callback
    // (the second argument) whenever the data loads.
    function getFromGoogle(url, callback) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://ajax.googleapis.com/ajax/' +
                     'services/feed/load?v=1.0&callback=?&q=' +
                     encodeURIComponent(url) +
                     // TODO: Actually paginate results; for now we just get
                     // "all" podcasts, presuming most podcasts have fewer
                     // than 1,000 episodes.
                     '&num=' + NUMBER_OF_PODCASTS_TO_GET + '&output=json_xml',
                dataType: 'json',
                success: function(response) {
                    if (!response || !response.responseData) {
                        console.error('Bad response', response);
                        return;
                    }
                    var xml = new DOMParser();
                    var xmlString = response.responseData.xmlString;
                    var xmlDoc = xml.parseFromString(xmlString, 'text/xml');

                    console.log(xmlDoc, response);
                    if (callback) {
                        callback(xmlDoc);
                    }
                    resolve(xmlDoc);
                },
                error: function() {
                    reject();
                }
            });
        });
    }

    HighFidelity.RSS = {
        get: getFromGoogle
    };
})();
