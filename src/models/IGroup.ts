import { IContact } from "./IContact";

/**
 * A group within an organization.
 */
export interface IGroup {
    /**
     * The name of the group.
     */
    name: string;

    /**
     * Contact information on important group members.
     */
    contacts: IContact[];
}
