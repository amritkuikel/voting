import { describe, expect, it, vi } from 'vitest';
import { getElectionExportResponse } from './export-helpers';

describe('getElectionExportResponse', () => {
	it('returns a CSV response for votes using the current camelCase schema', async () => {
		const mockClient = {
			query: vi.fn(async (query: string) => {
				if (query.includes('information_schema.columns')) {
					return [{ column_name: 'headBoyCandidateId' }];
				}

				if (query.includes('FROM votes v')) {
					return [
						{
							id: 1,
							headBoyCandidateId: 2,
							headBoyName: 'Alice',
							headGirlCandidateId: 3,
							headGirlName: 'Bob',
							selectedHouse: 'blue',
							houseCaptainCandidateId: 4,
							houseCaptainName: 'Carol',
							votedAt: '2025-01-01T00:00:00.000Z',
						},
					];
				}

				return [];
			}),
		};

		const response = await getElectionExportResponse(mockClient as any);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('text/csv');
		const body = await response.text();
		expect(body).toContain('Vote ID');
		expect(body).toContain('Alice');
		expect(body).toContain('Carol');
	});
});
