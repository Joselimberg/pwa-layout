import { IUser } from "./";

export interface ISong {
    id      : string;
    name    : string;
    links   : Record<string, string>[];
    level   : string;
    id_user?: string;
    user?   : IUser;
}
