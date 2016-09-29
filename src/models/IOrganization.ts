import { IGroup } from "./IGroup";

/**
 * An organization that has groups.
 */
export interface IOrganization {
    /**
     * The name of the organization.
     */
    name: string;

    /**
     * The organization's groups, keyed by name.
     */
    groups: {
        [i: string]: IGroup
    };
}
