// app/testimonies/page.tsx
"use client";

import { useRevival } from "@/hooks/useRevival";
import { formatDistanceToNow } from "date-fns";
import { Heart, Loader2, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TestimoniesPage() {
	const {
		testimonies,
		getTestimonies,
		likeTestimony,
		isLoading,
		isAuthenticated,
	} = useRevival();
	const [likingId, setLikingId] = useState<string | null>(null);

	useEffect(() => {
		getTestimonies();
	}, []);

	const handleLike = async (id: string) => {
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to like testimonies",
				action: {
					label: "Login",
					onClick: () => (window.location.href = "/login"),
				},
			});
			return;
		}

		setLikingId(id);
		try {
			await likeTestimony(id);
		} catch (error) {
			toast.error("Failed to like testimony");
		} finally {
			setLikingId(null);
		}
	};

	if (isLoading && testimonies.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-12 h-12 text-primary animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="container mx-auto px-4 py-20">
				<div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
					<div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-primary">
						<Quote className="w-8 h-8 fill-current" />
					</div>
					<h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
						Stories of{" "}
						<span className="text-primary italic">Transformation</span>.
					</h1>
					<p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto italic">
						"But they overcame him by the blood of the Lamb and by the word of
						their testimony..." — Revelation 12:11
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{testimonies.map((testimony) => (
						<div
							key={testimony._id}
							className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative group">
							<div className="flex items-center gap-4 mb-8">
								<div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/5 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
									{testimony.avatar ? (
										<img
											src={testimony.avatar}
											alt={testimony.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-2xl font-bold text-primary">
											{testimony.name.charAt(0)}
										</span>
									)}
								</div>
								<div>
									<h3 className="font-bold text-slate-900">{testimony.name}</h3>
									<p className="text-xs text-primary font-bold uppercase tracking-widest">
										{testimony.event}
									</p>
								</div>
							</div>

							<div className="flex mb-6 gap-1 text-amber-500">
								{[...Array(testimony.rating)].map((_, i) => (
									<Star key={i} className="w-4 h-4 fill-current" />
								))}
							</div>

							<p className="text-lg text-slate-600 font-medium leading-relaxed italic mb-8">
								"{testimony.content}"
							</p>

							<div className="flex items-center justify-between pt-6 border-t border-slate-50">
								<div className="flex items-center gap-4 text-slate-400">
									<button
										onClick={() => handleLike(testimony._id)}
										disabled={likingId === testimony._id}
										className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors group">
										<Heart className="w-4 h-4 group-hover:fill-red-500 group-hover:text-red-500 transition" />
										<span className="text-xs font-bold">
											{testimony.likes || 0}
										</span>
									</button>
								</div>
								<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
									{formatDistanceToNow(new Date(testimony.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>
						</div>
					))}
				</div>

				{testimonies.length === 0 && (
					<div className="text-center py-20">
						<p className="text-muted-foreground">
							No testimonies yet. Be the first to share!
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
