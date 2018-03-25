'use strict';

const twit = require('twit');
const contentfulapi = require('contentful');
const contentful_config = require('./contentful-config.js');
const contentful = contentfulapi.createClient({
  space: contentful_config.space_id,
  accessToken: contentful_config.access_token
});
const contentfulmanagementapi = require('contentful-management');
const contentful_management_config = require('./contentful-management-config.js');
const contentful_management = contentfulmanagementapi.createClient({
  accessToken: contentful_management_config.access_token
});

/*
  Fetches and tweets a random untweeted lyric by artist.
 */
function dailyTweet(artist) {
  getNextTweet(artist).then((response) => {
    // Find config file matching `twit-<artist>-config.js`
    const configFileName = './twit-'+artist.toLowerCase()+'-config.js';
    const twitconfig = require(configFileName);
    const twitter = new twit(twitconfig);
    if (twitter !== null) {
      twitter.post('statuses/update', {
        status: response,
      }, function(err, response) {
        if (response) {
          console.log('Tweeted another quote of wisdom!');
          console.log('Response: ');
          console.log(response);
        }
        if (err) {
          console.log('Something went wrong while TWEETING...');
        }
      });
    } else {
      console.log("Error creating Twitter client.");
    }
  }).catch(function(error) {
    console.error(error);
  });
}

/*
  Get the next artist's lyric to tweet (and mark the lyric as tweeted).
 */
function getNextTweet(artist) {
  return getArtistLyrics(artist)
    .then((response) => {
      let numOfTweets = response.length;
      let randomNumber = ranNum(response.length);
      console.log("Number of tweets: " + numOfTweets);
      console.log("Random number: " + randomNumber);
      let entry = response[randomNumber];
      let lyric = entry.fields.lyric;

      // Uncoupled issue here: tweet could be set to true but fail to be posted to Twitter in parent function
      updateEntryTweetedStatus(entry.sys.id);

      return lyric;
    })
    .catch((error) => {
      console.error(error);
    });
}

/*
  Get all lyrics for given artist.
 */
function getArtistLyrics(artist) {
    return contentful.getEntries({
      'content_type': 'lyric',
      'fields.artist': artist,
      'fields.tweeted': false
    })
    .then((response) => response.items)
    .catch((error) => {
      console.error(error)
    });
}

/*
  Set the contentful entry's `tweeted` field to true.
 */
function updateEntryTweetedStatus(entryId) {
  contentful_management.getSpace(contentful_config.space_id).then((space) => {
    space.getEntry(entryId)
      .then((entry) => {
        entry.fields.tweeted = { 'en-US': true };
        entry.update().then((updatedEntry) => {
          updatedEntry.publish();
          console.log("Lyric successfully marked as tweeted in Contentful.");
        })
      });
  });
}

/*
  Generate a random number between 0 and `max`.
 */
function ranNum (max) {
  return Math.floor(Math.random()*max);
}

/*
  Called by scheduled Cloudwatch rule where event is JSON of artist's name.
 */
exports.handler = (event, context, callback) => {
  console.log("Logging cloudwatch event: ");
  console.log(event); // e.g. { "artist": "Eyedea" }
  // Fetch and tweet an artist's lyric
  dailyTweet(event.artist); // e.g. 'Eyedea'
};
