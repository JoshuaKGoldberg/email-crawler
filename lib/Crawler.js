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
    reset() {
        this.landingPages.length = 0;
        this.visitedLandingPages.clear();
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
    crawl() {
        this.reset();
        return phantom_1.create()
            .then((phantom) => {
            let pendingWork = Promise.resolve();
            for (let i = 0; i < this.landingPages.length; i += 1) {
                const landingPage = this.landingPages[i];
                this.visitedLandingPages.add(landingPage);
                pendingWork = pendingWork
                    .then(() => this.prepareLandingPage(phantom, landingPage))
                    .then((webPage) => {
                    console.log(`Crawling ${landingPage}...`);
                    return this.crawlLandingPage(phantom, webPage, landingPage);
                });
            }
            return pendingWork.then(() => this.school);
        });
    }
    /**
     *
     */
    prepareLandingPage(phantom, landingPage) {
        let webPage;
        return phantom.createPage()
            .then((createdPage) => {
            webPage = createdPage;
            return webPage.open(landingPage);
        })
            .then(() => webPage);
    }
}
exports.Crawler = Crawler;
