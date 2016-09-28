/// <reference path="../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../node_modules/@types/cheerio/index.d.ts" />
/// <reference path="../node_modules/@types/request-promise/index.d.ts" />

import * as Promise from "bluebird";
import "cheerio";
import * as rp from "request-promise";

import { IContact } from "./models/IContact";
import { IGroup } from "./models/IGroup";
import { IOrganization } from "./models/IOrganization";

export interface ILandingPageCallback<T> {
    (this: T, $: CheerioStatic, url: string): Promise<void>;
}

export interface ILandingPage<T> {
    callback: ILandingPageCallback<T>;
    url: string;
}

/**
 * Abstracted contact info crawler for an organization's webpages.
 */
export abstract class Crawler {
    /**
     * Collected landing pages that can be visited.
     */
    private landingPages: ILandingPage<this>[] = [];

    /**
     * Landing pages that have already been visited.
     */
    private visitedLandingPages: Set<string> = new Set<string>();

    /**
     * A organization being populated.
     */
    private organization: IOrganization;

    /**
     * Initializes a new instance of the Crawler class.
     * 
     * @param name   The name of the organization.
     */
    protected constructor(name: string) {
        this.organization = {
            name,
            groups: {}
        };
    }

    /**
     * Crawls the organization for its information.
     * 
     * @returns A Promise for the crawled organization.
     */
    public crawl(): Promise<IOrganization> {
        this.visitedLandingPages.clear();
        console.log(`Started crawling ${this.organization.name}.`);

        return this.visitAllPages()
            .then((): IOrganization => {
                console.log("Completed.");
                return this.organization;
            });
    }

    /**
     * Adds a landing page if it didn't yet exist.
     * 
     * @param url   A new landing page's URL.
     * @param callback   A callback for the landing page.
     * @returns Whether the landing page was added (not yet added).
     */
    protected addLandingPage(url: string, callback: ILandingPageCallback<this>): boolean {
        if (this.visitedLandingPages.has(url)) {
            return false;
        }

        this.landingPages.push({ url, callback });
        return true;
    }

    /**
     * Adds a new contact to the stored organization.
     * 
     * @param groupName   The name of the group.
     * @param contact   A person's contact information.
     * @remarks In the future, this could probably merge duplicate contacts.
     */
    protected addContact(groupName: string, contact: IContact): void {
        this.getClub(groupName).contacts.push(contact);
    }

    /**
     * Retrieves a group, creating it if it doesn't yet exist.
     * 
     * @param groupName   The name of the group.
     * @returns A group under the name.
     */
    private getClub(groupName: string): IGroup {
        if (this.organization.groups[groupName]) {
            return this.organization.groups[groupName];
        }

        return this.organization.groups[groupName] = {
            name: groupName,
            contacts: []
        };
    }

    /**
     * Visits all landing pages as they're added.
     * 
     * @returns A Promise for visiting all landing pages.
     */
    private visitAllPages(): Promise<void> {
        const visitPage = (i: number): Promise<void> => {
            if (i >= this.landingPages.length) {
                return Promise.resolve();
            }

            const landingPage: ILandingPage<this> = this.landingPages[i];

            console.log(`\tOpening ${landingPage.url}...`);

            return rp(landingPage.url)
                .then((contents: string): CheerioStatic => {
                    console.log(`\tOpened ${landingPage.url}...`);
                    return cheerio.load(contents);
                })
                .then(($: CheerioStatic): Promise<void> => landingPage.callback.call(this, $, landingPage.url))
                .then((): Promise<void> => visitPage(i + 1));
        };

        return visitPage(0);
    }
}