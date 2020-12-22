import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "app/auth/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase/app";

@Injectable()
export class ProfileService implements Resolve<any> {
    user: User;

    timeline: any;
    about: any;
    photosVideos: any;

    accountOnChanged: BehaviorSubject<any>;
    timelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private authService: AuthService
    ) {
        // Set the defaults
        this.accountOnChanged = new BehaviorSubject({});
        this.timelineOnChanged = new BehaviorSubject({});
        this.aboutOnChanged = new BehaviorSubject({});
        this.photosVideosOnChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getAccount(),
                // this.getTimeline(),
                // this.getAbout(),
                // this.getPhotosVideos(),
            ]).then(() => {
                resolve(null);
            }, reject);
        });
    }

    /**
     * Get Account
     */

    getAccount(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.user = this.authService.user;
            console.log(this.user);
            this.accountOnChanged.next(this.user);
            resolve(this.user);

            this.authService.subjectAuth.subscribe(({ isAuthed, user }) => {
                if (isAuthed) {
                    this.user = user;
                    this.accountOnChanged.next(this.user);
                    resolve(this.user);
                }
            }, reject);
        });
    }

    updateProfile(displayName: string, photoURL: string = "") {
        this.authService.updateProfile(displayName, photoURL);
    }

    updateEmail(email: string) {
        this.authService.updateEmail(email);
    }

    updatePassword(password: string) {
        this.authService.updatePassword(password);
    }

    /**
     * Get timeline
     */
    getTimeline(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/profile-timeline")
                .subscribe((timeline: any) => {
                    this.timeline = timeline;
                    this.timelineOnChanged.next(this.timeline);
                    resolve(this.timeline);
                }, reject);
        });
    }

    /**
     * Get about
     */
    getAbout(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/profile-about")
                .subscribe((about: any) => {
                    this.about = about;
                    this.aboutOnChanged.next(this.about);
                    resolve(this.about);
                }, reject);
        });
    }

    /**
     * Get photos & videos
     */
    getPhotosVideos(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/profile-photos-videos")
                .subscribe((photosVideos: any) => {
                    this.photosVideos = photosVideos;
                    this.photosVideosOnChanged.next(this.photosVideos);
                    resolve(this.photosVideos);
                }, reject);
        });
    }
}
