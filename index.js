const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onTaskCreated = functions.firestore
    .document('tasks/{taskId}')
    .onCreate(async (snapshot, context) => {
        const task = snapshot.data();
        const workerId = task.assignedTo;

        // Fetch worker's FCM token
        const userDoc = await admin.firestore().collection('users').doc(workerId).get();
        const userData = userDoc.data();
        const fcmToken = userData?.fcmToken;

        if (fcmToken) {
            const message = {
                notification: {
                    title: 'New Task Assigned',
                    body: `You have been assigned a new task: ${task.title}`
                },
                token: fcmToken
            };

            return admin.messaging().send(message);
        } else {
            console.log('No FCM token found for user', workerId);
            return null;
        }
    });
