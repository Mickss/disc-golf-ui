export type DiscGolfEvent = {
    id: string;
    tournamentDateStart: string;
    tournamentDateEnd: string;
    registrationStart: string;
    registrationEnd: string;
    pdga: string;
    tournamentTitle: string;
    region: string;
    externalLink: string;
    tournamentDirector?: string;
    capacity?: number;
}