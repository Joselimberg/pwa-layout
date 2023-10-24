import { IUser, IArtist } from "./";

export interface ISong {
    id        : string;
    name      : string;
    links     : Record<string, string>[];
    level     : string;
    id_user?  : string;
    user?     : IUser;
    id_artist?: string;
    artist    : IArtist;

}
