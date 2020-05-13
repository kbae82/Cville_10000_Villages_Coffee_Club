## Cville Ten Thousand Coffee Club
Cville Ten Thousand Villages Store has a great program for coffee lovers.
You get 1 free coffee for every 10 coffee purchase.

Currently, this program is running with paper cards.  It works but it's very slow manual process.
(there are more than 100 paper cards.)

<img src="https://i.imgur.com/AwPc5Tu.jpg" width="400"/>

As an active coffee club member, I published a simple web app on Firebase using Vue JS + Firebase.
Currently, the app is online.  To test, please register with your email.  The app requires email verification.  Please feel free to take a look.
https://ten-thousand-villages-coffee.web.app/

Due to COVID-19, the app is not in production yet but it will be soon.


## For Developers
This application uses Firebase DB(Firestore): a flexible, scalable NoSQL cloud database.
You can easily modify the data fields and use them for different use cases.

Vue JS is a progressive framework for building user interfaces.
This application uses Components and Router.  There are many awesome features Vue provides.

## Project setup
```
npm install
```

Create Firebase Project and Register your app
(https://firebase.google.com/docs/web/setup#create-firebase-project)
(https://firebase.google.com/docs/web/setup#register-app)


Update Firebase Config with yours (https://firebase.google.com/docs/web/setup#config-object)
src/components/firebase.js

Enable Authentication Email/Password
This will allow users to register their accounts with email/password. (Authentication->Sign-in method)

<img src="https://i.imgur.com/wfBEGrS.png" width="680"/>

*This application only allows users who verified their email to view/enter data.  You can disable this in "src/components/Login.vue"


Optional
You can set an email address verification template. (Authentication->Templates)

<img src="https://i.imgur.com/TbCO5zr.png" width="680"/>

### Run Locally for DEV
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Publish the app on Firebase
Update .firebaserc file with your firebase project ID

```
npm install -g firebase-tools
npm run build
firebase login
firebase deploy
```

You publish the update with 
```
npm run build && firebase deploy
```
