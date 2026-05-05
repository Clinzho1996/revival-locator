// hooks/useRevival.ts
import { useCallback } from "react";
import { useRevivalStore } from "../store/useRevivalStore";

export const useRevival = () => {
	const store = useRevivalStore();

	// Auth helpers
	const isAdmin = useCallback(() => {
		return store.user?.role === "admin";
	}, [store.user]);

	const isEventOrganizer = useCallback(
		(eventOrganizerId: string) => {
			return store.user?._id === eventOrganizerId;
		},
		[store.user],
	);

	const isBookmarked = useCallback(
		(eventId: string) => {
			return store.user?.bookmarks?.includes(eventId) || false;
		},
		[store.user],
	);

	return {
		...store,
		isAdmin,
		isEventOrganizer,
		isBookmarked,
	};
};
