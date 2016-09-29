/// <reference path="../../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { IContact } from "../models/IContact";
import { IGroup } from "../models/IGroup";
import { IOrganization } from "../models/IOrganization";
import { IFormatter } from "./IFormatter";

import * as Promise from "bluebird";
import * as fs from "fs";

/**
 * Saves an organization as tab-separated values.
 */
export class TsvOrganizationFormatter implements IFormatter {
    /**
     * Saves a crawler's organization output.
     * 
     * @param string   The output file name.
     * @param organization   A crawler's organization output.
     * @returns A Promise for saving the output.
     */
    public saveOrganization(fileName: string, organization: IOrganization): Promise<void> {
        const header: string = ["Group Name", "Contact Name", "Email"].join("\t");
        const body: string[] = [];

        for (const groupName in organization.groups) {
            if (!(groupName in organization.groups)) {
                continue;
            }

            const group: IGroup = organization.groups[groupName];
            if (!group) {
                continue;
            }

            // We only really want the first contact
            const contact: IContact = group.contacts[0];
            if (!contact) {
                continue;
            }

            for (const field in contact) {
                if (!(field in contact) || !contact[field]) {
                    continue;
                }
            }

            body.push(
                [group.name, contact.name, contact.email]
                    .map((name: string): string => name.replace(/\s+/g, " "))
                    .join("\t"));
        }

        fs.writeFile(fileName, [header, body.join("\n")].join("\n"));

        return Promise.resolve();
    }
}