import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getRegistrationStatus } from './RegistrationUtils';
import {DiscGolfEvent} from "./DiscGolfEvent"; // Adjust path as needed

describe('getRegistrationStatus logic', () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // We define a helper to create a dummy event with just the dates we care about
    const createEvent = (
        tournamentDate: string,
        registrationStart: string | null,
        registrationEnd: string | null
    ): DiscGolfEvent => {
        return {
            id: 'test-id',
            pdga: '12345',
            tournamentTitle: 'Test Tournament',
            region: 'Test Region',
            externalLink: 'http://example.com',
            tournamentDate,
            // We cast to string because your type says string,
            // but your logic needs to handle missing dates (null/undefined)
            registrationStart: registrationStart as string,
            registrationEnd: registrationEnd as string,
        };
    };

    const testCases = [
        {
            id: 1,
            today: '2026-01-15',
            regStart: '2026-01-20',
            regEnd: '2026-01-25',
            tournDate: '2026-01-30',
            expected: 'CLOSED',
            reason: 'Registration not yet started'
        },
        {
            id: 2,
            today: '2026-01-15',
            regStart: '2026-01-20',
            regEnd: null,
            tournDate: '2026-01-30',
            expected: 'CLOSED',
            reason: 'Registration not yet started (no end date)'
        },
        {
            id: 3,
            today: '2026-01-15',
            regStart: '2026-01-10',
            regEnd: '2026-01-25',
            tournDate: '2026-01-30',
            expected: 'OPEN',
            reason: 'Registration in progress'
        },
        {
            id: 4,
            today: '2026-01-15',
            regStart: '2026-01-10',
            regEnd: null,
            tournDate: '2026-01-30',
            expected: 'OPEN',
            reason: 'Registration in progress (no end date)'
        },
        {
            id: 5,
            today: '2026-01-15',
            regStart: '2026-01-05',
            regEnd: '2026-01-10',
            tournDate: '2026-01-30',
            expected: 'CLOSED',
            reason: 'Registration closed before tournament started'
        },
        {
            id: 6,
            today: '2026-01-15',
            regStart: '2026-01-05',
            regEnd: '2026-01-10',
            tournDate: '2026-01-11',
            expected: 'PASSED',
            reason: 'Tournament just passed'
        },
        {
            id: 7,
            today: '2026-01-15',
            regStart: '2026-01-05',
            regEnd: null,
            tournDate: '2026-01-11',
            expected: 'PASSED',
            reason: 'Tournament just passed (no reg end date)'
        },
        {
            id: 8,
            today: '2026-03-15',
            regStart: '2026-01-05',
            regEnd: '2026-01-10',
            tournDate: '2026-01-30',
            expected: 'CLOSED',
            reason: 'Tournament passed > 3 weeks ago'
        },
        {
            id: 9,
            today: '2026-03-15',
            regStart: '2026-01-05',
            regEnd: null,
            tournDate: '2026-01-30',
            expected: 'CLOSED',
            reason: 'Tournament passed > 3 weeks ago (no reg end date)'
        },
        {
            id: 10,
            today: '2026-01-15',
            regStart: null,
            regEnd: null,
            tournDate: '2026-01-30',
            expected: 'CLOSED',
            reason: 'No registration dates provided'
        },
        {
            id: 11,
            today: '2026-03-15',
            regStart: null,
            regEnd: null,
            tournDate: '2026-01-30',
            expected: 'CLOSED',
            reason: 'Tournament passed > 3 weeks ago, no dates'
        },
        {
            id: 12,
            today: '2026-01-15',
            regStart: null,
            regEnd: '2026-01-25',
            tournDate: '2026-01-30',
            expected: 'CLOSED',
            reason: 'End date exists, but Start date missing'
        },
    ];

    testCases.forEach((tc) => {
        it(`Case ${tc.id}: Returns ${tc.expected} when ${tc.reason}`, () => {
            // 1. Set "Today"
            vi.setSystemTime(new Date(tc.today));

            // 2. Mock the Event object
            const mockEvent = createEvent(tc.tournDate, tc.regStart, tc.regEnd);

            // 3. call logic
            const status = getRegistrationStatus(mockEvent);

            // 4. Assert
            expect(status).toBe(tc.expected);
        });
    });
});