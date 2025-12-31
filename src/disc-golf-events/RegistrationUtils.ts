import { DiscGolfEvent } from "./DiscGolfEvent";

export enum RegistrationStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    PASSED = "PASSED",
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
        const threeWeeksAfter = new Date(tournamentDate);
        threeWeeksAfter.setDate(threeWeeksAfter.getDate() + 21);

        if (now <= threeWeeksAfter) {
            return RegistrationStatus.PASSED;
        }
        return RegistrationStatus.CLOSED;
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
