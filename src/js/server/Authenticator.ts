import { ServerConnection, ServerError } from "./ServerConnection";
import "firebase/auth";
import * as firebase from "firebase";

/**
 * Authentication Server
 */
interface AuthError extends ServerError {

}

interface User extends firebase.User {
    emailVerified: boolean;
    uid: string;
    email: string;
    displayName: string | undefined;
}

interface ActionCodeSettings extends firebase.auth.ActionCodeSettings {

}

class Authenticator extends ServerConnection {

    constructor() {
        super();

    }

    /**
     * Executes a callback when the authentication state changes (the user logs in or logs out)
     * See firebase's firebase.auth().onAuthStateChanged()
     *
     * @param callback - A function which accepts a single parameter, user. User contains a firebase user object when the user is logged in, and null when logged out.
     */
    public onAuthStateChanged(callback: ((user: User) => void)) {
        return this.server.auth().onAuthStateChanged(callback);
    }

    /**
     * Logs in a user using email and password.
     *
     * See firebase's firebase.auth().signInWithEmailAndPassword()
     *
     * @param email - the email
     * @param password - the password
     */
    public emailLogin(email: string, password: string) {
        return this.server.auth().signInWithEmailAndPassword(email, password);
    }

    /**
     * Returns a AuthCredential from the email and password.
     * @param email - The email
     * @param password - The password
     */
    public getEmailCredential(email: string, password: string) {
        return this.staticServer.auth.EmailAuthProvider.credential(
                email,
                password
        );

    }

    /**
     * Sends a password reset email.
     * @param email - The email pertaining to the account of which the password should be reset. The request will be silently ignored if no account exists with that email.
     */
    public sendPasswordResetEmail(email: string, actionCodeSettings: ActionCodeSettings) {
        return this.server.auth().sendPasswordResetEmail(email);
    }

    /**
     * Logs out the current user. If the user logged in with an external Auth provider, they will have to log in again with that provider, but will not be logged out of that provider.
     */
    public logout() {
        return this.server.auth().signOut();
    }


}

export default Authenticator;
export { Authenticator, AuthError, User };