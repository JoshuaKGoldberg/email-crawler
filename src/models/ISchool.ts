import { IClub } from "./IClub";

export interface ISchool {
    name: string;
    clubs: {
        [i: string]: IClub
    }
}
