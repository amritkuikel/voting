import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const candidates = pgTable("candidates", {
	id: serial().primaryKey(),
	name: text().notNull(),
	position: text().notNull(), // 'head_boy', 'head_girl', 'house_captain'
	house: text(), // 'blue', 'yellow', 'red', 'green' - only for house captains
	symbol: text().notNull(), // Symbol name (e.g., 'Book', 'Sunglass')
	symbolImage: text().notNull(), // Image filename
	photoImage: text().notNull(), // Candidate photo filename
	voteCount: integer().default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable("votes", {
	id: serial().primaryKey(),
	headBoyCandidateId: integer().notNull(), // Reference to candidates.id
	headGirlCandidateId: integer().notNull(), // Reference to candidates.id
	selectedHouse: text().notNull(), // 'blue', 'yellow', 'red', 'green'
	houseCaptainCandidateId: integer().notNull(), // Reference to candidates.id
	votedAt: timestamp("voted_at").defaultNow(),
});

export const electionState = pgTable("election_state", {
	id: serial().primaryKey(),
	isActive: boolean().default(false).notNull(),
	totalVotes: integer().default(0).notNull(),
	startedAt: timestamp("started_at"),
	stoppedAt: timestamp("stopped_at"),
	updatedAt: timestamp("updated_at").defaultNow(),
});
