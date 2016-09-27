/// <reference path="../typings/phantom.d.ts" />

import { create as createPhantom, WebPage, PhantomJS } from "phantom";

import { IGroup } from "./models/IGroup";
import { IContact } from "./models/IContact";
import { IOrganization } from "./models/IOrganization";

/**
 * Abstracted contact info crawler for an organization's webpages.
 */
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
     * A organization being populated.
     */
    private organization: IOrganization;

    /**
     * Initializes a new instance of the Crawler class.
     * 
     * @param name   The name of the organization.
     * @param landingPages   Initial landing page(s) to visit.
     */
    protected constructor(name: string, landingPages: string[]) {
        this.organization = {
            name,
            groups: {}
        };
        this.landingPages.push(...landingPages);
    }

    /**
     * Crawls the organization for its information.
     * 
     * @returns A Promise for the crawled organization.
     */
    public crawl(): Promise<IOrganization> {
        this.visitedLandingPages.clear();
        console.log(`Started crawling ${this.organization.name}.`);

        return createPhantom()
            .then((phantom: PhantomJS): Promise<WebPage> => {
                console.log("\tCreated phantom...");
                return phantom.createPage();
            })
            .then((webPage: WebPage): Promise<void> => this.visitAllPages(webPage))
            .then((): IOrganization => {
                console.log("Completed.");
                return this.organization;
            });
    }

    /**
     * Adds a landing page if it didn't yet exist.
     * 
     * @param landingPage   A new landing page's URL.
     * @returns Whether the landing page was added (not yet added).
     */
    protected addLandingPage(landingPage: string): boolean {
        if (this.visitedLandingPages.has(landingPage)) {
            return false;
        }

        this.landingPages.push(landingPage);
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
     * Crawls a landing page for new contact info and/or landing pages.
     * 
     * @param webPage   The Phantom page for scripting.
     * @param landingPage   The URL of the page.
     * @returns A Promise for crawling the page.
     */
    protected abstract crawlLandingPage(webPage: WebPage, landingPage: string): Promise<void>;

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
     * @param webPage   The Phantom page visiting the landing pages.
     * @returns A Promise for visiting all landing pages.
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