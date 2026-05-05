export type EventStatus = "upcoming" | "ongoing" | "past";

export interface Review {
	id: string;
	userId: string;
	userName: string;
	rating: number;
	comment: string;
	createdAt: string;
}

export interface ForumMessage {
	id: string;
	userId: string;
	userName: string;
	content: string;
	createdAt: string;
}

export interface ChristianEvent {
	id: string;
	title: string;
	description: string;
	longDescription?: string;
	date: string;
	startTime: string;
	endTime?: string;
	location: string;
	address: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	imageUrl: string;
	category:
		| "Worship"
		| "Conference"
		| "Youth"
		| "Prayer"
		| "Revival"
		| "Community";
	organizer: string;
	interestCount: number;
	status: EventStatus;
	reviews: Review[];
	forumMessages: ForumMessage[];
}

export interface DashboardStats {
	totalEvents: number;
	totalInterest: number;
	activeUsers: number;
	totalReviews: number;
}
