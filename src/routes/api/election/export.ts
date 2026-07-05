import { createFileRoute } from '@tanstack/react-router';
import { getClient } from '#/db';
import { getElectionExportResponse } from './export-helpers';

export const Route = createFileRoute('/api/election/export')({
	server: {
		handlers: {
			GET: async () => {
				const client = await getClient();
				if (!client) {
					return Response.json({ error: 'Database not available' }, { status: 500 });
				}

				try {
					return await getElectionExportResponse(client as any);
				} catch (error) {
					console.error('Failed to export results', error);
					return Response.json({ error: 'Failed to export results' }, { status: 500 });
				}
			},
		},
	},
});
