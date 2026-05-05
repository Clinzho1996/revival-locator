// app/events/page.tsx
import { Suspense } from "react";
import { EventsContent } from "./EventsContent";

export default function EventsPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center">
						<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-muted-foreground">Loading events...</p>
					</div>
				</div>
			}>
			<EventsContent />
		</Suspense>
	);
}
