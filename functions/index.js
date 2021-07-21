const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/**
 * Sanitizes homepage data so that user's private decks aren't shown
 * to other users.
 */
exports.getHomepage = functions.https.onCall(async (data, context) => {
    const homepageSnapshot = await admin
        .database()
        .ref("/homepage")
        .once("value");
    const homepage = homepageSnapshot.val();
    const uid = context.auth && context.auth.uid;
    const sanitized = {};

    Object.keys(homepage).forEach(deckId => {
        const deck = homepage[deckId];

        if (deck.visibility === false && deck.owner !== uid) {
            return;
        }
        sanitized[deckId] = deck;
    });

    return sanitized;
});
