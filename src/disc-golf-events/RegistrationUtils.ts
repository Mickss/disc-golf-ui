import { DiscGolfEvent } from "./DiscGolfEvent";

export enum RegistrationStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    PASSED = "PASSED",
    ARCHIVED = "ARCHIVED",
}

const endOfDay = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

export const getRegistrationStatus = (event: DiscGolfEvent): RegistrationStatus => {
    const now = new Date();
    const registrationStart = event.registrationStart ? new Date(event.registrationStart) : null;
    const registrationEnd = event.registrationEnd ? endOfDay(new Date(event.registrationEnd)) : null;
    const tournamentDate = event.tournamentDate ? endOfDay(new Date(event.tournamentDate)) : null;

    if (tournamentDate && now > tournamentDate) {
        const twoWeeksAfter = new Date(tournamentDate);
        twoWeeksAfter.setDate(twoWeeksAfter.getDate() + 14);

        if (now <= twoWeeksAfter) {
            return RegistrationStatus.PASSED;
        }
        return RegistrationStatus.ARCHIVED;
    }

    if (registrationEnd && now > registrationEnd) {
        return RegistrationStatus.CLOSED;
    }

    if (!registrationStart) {
        return RegistrationStatus.CLOSED;
    }

    if (now < registrationStart) {
        return RegistrationStatus.CLOSED;
    }

    return RegistrationStatus.OPEN;
}
