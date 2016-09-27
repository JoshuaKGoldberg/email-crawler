/// <reference path="../../typings/phantom.d.ts" />

import { Crawler } from "../crawler";
import { PhantomJS, WebPage } from "phantom";

export class RensselaerPolytechnicInstituteCrawler extends Crawler {
    /**
     * 
     */
    public constructor() {
        super(
            {
                name: "Rensselaer Polytechnic Institute",
                clubs: {}
            },
            [
                "http://union.rpi.edu/clubs"
            ]);
    }

    /**
     * 
     */
    protected crawlLandingPage(webPage: WebPage, landingPage: string): Promise<void> {
        console.log("rpi crawling");
        // idea: continuously scroll down until the page height doesn't increase
        return Promise.resolve();
    }
}