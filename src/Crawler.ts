/// <reference path="../typings/phantom.d.ts" />

import { create as createPhantom, WebPage, PhantomJS } from "phantom";

import { IClub } from "./models/IClub";
import { IContact } from "./models/IContact";
import { ISchool } from "./models/ISchool";

export abstract class Crawler {
    /**
     * Collected landing pages that can be visited.
     */
    private landingPages: string[] = [];

    /**
     * Landing pages that have already been visited.
     */
    private visitedLandingPages: Set<string> = new Set<string>();

    /**
     * A school being populated.
     */
    private school: ISchool;

    /**
     * 
     */
    /* protected */ constructor(school: ISchool, landingPages: string[]) {
        this.school = school;
        this.landingPages.push(...landingPages);
    }

    /**
     * 
     */
    public crawl(): Promise<ISchool> {
        this.visitedLandingPages.clear();
        console.log(`Started crawling ${this.school.name}.`);

        return createPhantom()
            .then((phantom: PhantomJS): Promise<WebPage> => {
                console.log("\tCreated phantom...");
                return phantom.createPage();
            })
            .then((webPage: WebPage): Promise<void> => this.visitAllPages(webPage))
            .then((): ISchool => {
                console.log("Completed.");
                return this.school;
            });
    }

    /**
     * 
     */
    protected addLandingPage(landingPage: string): boolean {
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
    protected addContact(clubName: string, contact: IContact): void {
        this.getClub(clubName).contacts.push(contact);
    }

    /**
     * 
     */
    protected abstract crawlLandingPage(webPage: WebPage, landingPage: string): Promise<void>;

    /**
     * 
     */
    private getClub(clubName: string): IClub {
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
    private visitAllPages(webPage: WebPage): Promise<void> {
        const visitPage = (i: number): Promise<void> => {
            if (i >= this.landingPages.length) {
                return Promise.resolve();
            }

            const landingPage: string = this.landingPages[i];

            return webPage.open(landingPage)
                .then((): void => {
                    console.log(`\tOpened ${landingPage}...`);
                })
                .then((): Promise<void> => this.crawlLandingPage(webPage, landingPage))
                .then((): Promise<void> => visitPage(i + 1));
        };

        return visitPage(0);
    }
}