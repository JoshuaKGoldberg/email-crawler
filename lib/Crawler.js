/// <reference path="../typings/phantom.d.ts" />
"use strict";
const phantom_1 = require("phantom");
class Crawler {
    /**
     *
     */
    /* protected */ constructor(school, landingPages) {
        /**
         * Collected landing pages that can be visited.
         */
        this.landingPages = [];
        /**
         * Landing pages that have already been visited.
         */
        this.visitedLandingPages = new Set();
        this.school = school;
        this.landingPages.push(...landingPages);
        console.log("oh", this.landingPages, "from", landingPages);
    }
    /**
     *
     */
    crawl() {
        this.visitedLandingPages.clear();
        console.log(`Started crawling ${this.school.name}.`);
        return phantom_1.create()
            .then((phantom) => {
            console.log("\tCreated phantom");
            return phantom.createPage();
        })
            .then((webPage) => this.visitAllPages(webPage))
            .then(() => {
            console.log("Completed.");
            return this.school;
        });
    }
    /**
     *
     */
    addLandingPage(landingPage) {
        if (this.visitedLandingPages.has(landingPage)) {
            return false;
        }
        this.landingPages.push(landingPage);
        return true;
    }
    /**
     *
     *
     * @remarks In the future, this could probably merge duplicate contacts.
     */
    addContact(clubName, contact) {
        this.getClub(clubName).contacts.push(contact);
    }
    /**
     *
     */
    getClub(clubName) {
        if (this.school.clubs[clubName]) {
            return this.school.clubs[clubName];
        }
        return this.school.clubs[clubName] = {
            name: clubName,
            contacts: []
        };
    }
    /**
     *
     */
    visitAllPages(webPage) {
        const visitPage = (i) => {
            if (i >= this.landingPages.length) {
                return Promise.resolve();
            }
            const landingPage = this.landingPages[i];
            return webPage.open(landingPage)
                .then(() => {
                console.log(`\tOpened ${landingPage}...`);
            })
                .then(() => this.crawlLandingPage(webPage, landingPage))
                .then(() => visitPage(i + 1));
        };
        return visitPage(0);
    }
}
exports.Crawler = Crawler;
