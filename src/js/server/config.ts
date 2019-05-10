interface FirebaseConfig {
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
}

const firebaseConfig = {
    apiKey: "AIzaSyB-ly8ax35aWTAGhX2UDVuYxPSDlAU8kMk",
    authDomain: "t485-main.firebaseapp.com",
    databaseURL: "https://t485-main.firebaseio.com",
    projectId: "t485-main",
    storageBucket: "t485-main.appspot.com",
    messagingSenderId: "368513727602",
};

export default firebaseConfig;
export { firebaseConfig, FirebaseConfig };