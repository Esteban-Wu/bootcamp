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

/**
 * Given a new deck and deckId (key), adds a new deck to Firebase.
 */
exports.createDeck = functions.https.onCall(async (data, context) => {
    const deckData = data;
    const deck = deckData.deck;

    if (!Array.isArray(deck.cards)) {
        return null;
    }

    const deckId = deckData.key;
    const updates = {};
    const profile = {
        name: deck.name,
        description: deck.description,
        visibility: deck.visibility,
        owner: deck.owner,
        save: deck.save,
    };

    // Stores the deck's information in both /flashcards and 
    // /homepage, but the cards are only saved to /flashcards
    updates[`/flashcards/${deckId}`] = deck;
    updates[`/homepage/${deckId}`] = profile;

    return await admin.database().ref().update(updates);
});

/**
 * Given a user ID, returns that user's username.
 */
exports.getUsername = functions.https.onCall(async (data, context) => {
    const uid = data;
    const usernameSnapshot = await admin
    .database()
    .ref(`/users/${uid}/username`)
    .once("value");
    const username = usernameSnapshot.val();
    return username;
});
