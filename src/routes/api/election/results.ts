import { createFileRoute } from '@tanstack/react-router';
import { getClient } from '#/db';

export const Route = createFileRoute('/api/election/results')({
	server: {
		handlers: {
			GET: async () => {
				const client = await getClient();
				if (!client) {
					return Response.json({ error: 'Database not available' }, { status: 500 });
				}

				try {
					const candidates = (await client`
						SELECT * FROM candidates
						ORDER BY position, house, id
					`) as any[];

					const electionState = (await client`
						SELECT * FROM election_state
						ORDER BY id DESC
						LIMIT 1
					`) as any[];

					return Response.json({
						candidates,
						electionState: electionState[0],
					});
				} catch (error) {
					return Response.json({ error: 'Failed to fetch results' }, { status: 500 });
				}
			},
		},
	},
});
