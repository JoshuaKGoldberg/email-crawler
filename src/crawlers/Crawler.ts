/// <reference path="../../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../../node_modules/@types/request-promise/index.d.ts" />

import * as Promise from "bluebird";
import * as rp from "request-promise";

import { IContact } from "../models/IContact";
import { IGroup } from "../models/IGroup";
import { IOrganization } from "../models/IOrganization";

/**
 * Parses a resource.
 * 
 * @param resource   The resource being parsed.
 * @param url   The resource's url.
 * @returns A Promise for the parsed resource.
 * @type TResource   The resource's data type.
 */
export interface IResourceParser<TResource> {
    (resource: TResource, url: string): Promise<void>;
}

/**
 * A resource descriptor.
 * 
 * @type TResource   The resource's data type.
 */
export interface IResourceDescriptor<TResource> {
    /**
     * Parses the resource.
     */
    callback: IResourceParser<TResource>;

    /**
     * Any request options.
     */
    options?: rp.Options;

    /**
     * The resource's URL.
     */
    url: string;
}

/**
 * Abstracted contact info crawler for an organization's resources.
 * 
 * @type TResource   What form resource resources will be parsed as.
 */
export abstract class Crawler<TResource> {
    /**
     * Collected resources that can be consumed.
     */
    private resources: IResourceDescriptor<TResource>[] = [];

    /**
     * Resources that have already been consumed.
     */
    private consumedResources: Set<string> = new Set<string>();

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
        this.consumedResources.clear();
        console.log(`Started crawling ${this.organization.name}.`);

        return this.consumeAllResources()
            .then((): IOrganization => {
                return this.organization;
            });
    }

    /**
     * Loads a resource.
     * 
     * @param contents   The contents of the resource..
     * @returns A Promise for the parsed resource.
     */
    protected abstract loadResource(contents: string): Promise<TResource>;

    /**
     * Adds a resource if it didn't yet exist.
     * 
     * @param resource   Desiption of the resource.
     * @returns Whether the resource was added (is new).
     */
    protected addResource(resource: IResourceDescriptor<TResource>): boolean {
        if (this.consumedResources.has(resource.url)) {
            return false;
        }

        this.resources.push(resource);
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
     * Adds all groups from an organization.
     * 
     * @param organization   An existing organization.
     */
    protected addOrganization(organization: IOrganization): void {
        for (const groupName in organization.groups) {
            if (!(groupName in organization.groups)) {
                continue;
            }

            const group: IGroup = organization.groups[groupName];

            for (const contact of group.contacts) {
                this.addContact(groupName, contact);
            }
        }
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
     * Consumes all resources as they're added.
     * 
     * @returns A Promise for consuming all resources.
     */
    private consumeAllResources(): Promise<void> {
        const visitResource: Function = (i: number): Promise<void> => {
            if (i >= this.resources.length) {
                return Promise.resolve();
            }

            const resource: IResourceDescriptor<TResource> = this.resources[i];

            console.log(`\tOpening ${resource.url}...`);

            return rp(resource.url, resource.options)
                .then((contents: string): Promise<TResource> => {
                    console.log(`\tOpened ${resource.url}...`);
                    return this.loadResource(contents);
                })
                .then((parsed: TResource): Promise<void> => resource.callback.call(this, parsed, resource.url))
                .then((): Promise<void> => visitResource(i + 1));
        };

        return visitResource(0);
    }
}
