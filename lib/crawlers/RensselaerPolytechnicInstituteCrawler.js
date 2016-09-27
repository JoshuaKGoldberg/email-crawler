/// <reference path="../../typings/phantom.d.ts" />
"use strict";
const crawler_1 = require("../crawler");
class RensselaerPolytechnicInstituteCrawler extends crawler_1.Crawler {
    /**
     *
     */
    constructor() {
        super({
            name: "Rensselaer Polytechnic Institute",
            clubs: {}
        }, [
            "http://union.rpi.edu/clubs"
        ]);
    }
    /**
     *
     */
    crawlLandingPage(phantom, webPage, landingPage) {
        // idea: continuously scroll down until the page height doesn't increase
        return Promise.resolve();
    }
}
exports.RensselaerPolytechnicInstituteCrawler = RensselaerPolytechnicInstituteCrawler;
