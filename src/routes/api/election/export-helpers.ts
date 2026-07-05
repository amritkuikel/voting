type SqlClient = ((query: string) => Promise<any[]>) & {
	query?: (query: string) => Promise<any[]>;
};

type ColumnSet = {
	idColumn: string;
	headBoyColumn: string;
	headGirlColumn: string;
	selectedHouseColumn: string;
	houseCaptainColumn: string;
	votedAtColumn: string;
};

async function executeQuery(client: SqlClient, query: string) {
	if (typeof client.query === 'function') {
		return client.query(query);
	}

	if (typeof client === 'function') {
		return client(query);
	}

	throw new Error('Unsupported database client');
}

async function getVoteColumnSet(client: SqlClient): Promise<ColumnSet> {
	const columns = (await executeQuery(client, `
		SELECT column_name
		FROM information_schema.columns
		WHERE table_schema = current_schema()
			AND table_name = 'votes'
	`)) as Array<{ column_name?: string; COLUMN_NAME?: string; columnName?: string }>;

	const columnNames = columns
		.map((column) => column.column_name ?? column.COLUMN_NAME ?? column.columnName)
		.filter(Boolean) as string[];

	if (columnNames.includes('headBoyCandidateId')) {
		return {
			idColumn: 'id',
			headBoyColumn: '"headBoyCandidateId"',
			headGirlColumn: '"headGirlCandidateId"',
			selectedHouseColumn: '"selectedHouse"',
			houseCaptainColumn: '"houseCaptainCandidateId"',
			votedAtColumn: '"votedAt"',
		};
	}

	return {
		idColumn: 'id',
		headBoyColumn: 'head_boy_candidate_id',
		headGirlColumn: 'head_girl_candidate_id',
		selectedHouseColumn: 'selected_house',
		houseCaptainColumn: 'house_captain_candidate_id',
		votedAtColumn: 'voted_at',
	};
}

function escapeCsvValue(value: unknown) {
	if (value === null || value === undefined) {
		return '';
	}

	const stringValue = String(value);
	if (/[",\n]/.test(stringValue)) {
		return `"${stringValue.replace(/"/g, '""')}"`;
	}

	return stringValue;
}

function getRowValue(row: Record<string, unknown>, keys: string[]) {
	for (const key of keys) {
		if (row[key] !== undefined) {
			return row[key];
		}
	}

	return '';
}

export async function getElectionExportResponse(client: SqlClient) {
	const columns = await getVoteColumnSet(client);
	const votes = (await executeQuery(client, `
		SELECT
			v.id AS id,
			v.${columns.headBoyColumn} AS head_boy_candidate_id,
			hb.name AS head_boy_name,
			v.${columns.headGirlColumn} AS head_girl_candidate_id,
			hg.name AS head_girl_name,
			v.${columns.selectedHouseColumn} AS selected_house,
			v.${columns.houseCaptainColumn} AS house_captain_candidate_id,
			hc.name AS house_captain_name,
			v.${columns.votedAtColumn} AS voted_at
		FROM votes v
		JOIN candidates hb ON v.${columns.headBoyColumn} = hb.id
		JOIN candidates hg ON v.${columns.headGirlColumn} = hg.id
		JOIN candidates hc ON v.${columns.houseCaptainColumn} = hc.id
		ORDER BY v.${columns.votedAtColumn} DESC
	`)) as Array<Record<string, unknown>>;

	const headers = ['Vote ID', 'Head Boy', 'Head Girl', 'Selected House', 'House Captain', 'Voted At'];
	const csvRows = [
		headers.map(escapeCsvValue).join(','),
		...votes.map((vote) =>
			[
				getRowValue(vote, ['id']),
				getRowValue(vote, ['head_boy_name', 'headBoyName']),
				getRowValue(vote, ['head_girl_name', 'headGirlName']),
				getRowValue(vote, ['selected_house', 'selectedHouse']),
				getRowValue(vote, ['house_captain_name', 'houseCaptainName']),
				getRowValue(vote, ['voted_at', 'votedAt']),
			]
				.map(escapeCsvValue)
				.join(','),
		),
	];

	const csv = csvRows.join('\n');

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename=election_results.csv',
		},
	});
}
