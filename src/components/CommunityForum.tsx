"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRevival } from "@/hooks/useRevival";
import { format } from "date-fns";
import { Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface CommunityForumProps {
	messages: any[];
	eventId: string;
}

export function CommunityForum({
	messages: initialMessages,
	eventId,
}: CommunityForumProps) {
	const [newMessage, setNewMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	const {
		sendMessage,
		getEventMessages,
		messages: apiMessages,
		isLoading,
		user,
		isAuthenticated,
	} = useRevival();

	// Use API messages if available, otherwise use initialMessages
	const messages = apiMessages.length > 0 ? apiMessages : initialMessages;

	useEffect(() => {
		// Scroll to bottom when messages change
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	// Refresh messages periodically (every 30 seconds)
	useEffect(() => {
		if (!eventId) return;

		const interval = setInterval(() => {
			getEventMessages(eventId);
		}, 30000);

		return () => clearInterval(interval);
	}, [eventId]);

	const handleSend = async () => {
		if (!newMessage.trim()) {
			toast.error("Message cannot be empty", {
				description: "Please write a message before sending.",
			});
			return;
		}

		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to join the conversation",
				action: {
					label: "Login",
					onClick: () => (window.location.href = "/login"),
				},
			});
			return;
		}

		setIsSending(true);
		try {
			await sendMessage(eventId, newMessage.trim());
			setNewMessage("");
			toast.success("Message sent!", {
				description: "Your message has been posted to the community.",
			});
			// Refresh messages after sending
			await getEventMessages(eventId);
		} catch (error: any) {
			toast.error("Failed to send message", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsSending(false);
		}
	};

	const handleReply = async (parentId: string, message: string) => {
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to reply to messages",
			});
			return;
		}

		setIsSending(true);
		try {
			await sendMessage(eventId, message, parentId);
			toast.success("Reply sent!");
			await getEventMessages(eventId);
		} catch (error: any) {
			toast.error("Failed to send reply", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsSending(false);
		}
	};

	if (isLoading && messages.length === 0) {
		return (
			<Card className="h-[600px] flex flex-col border-primary/10 bg-card/50 backdrop-blur-sm shadow-xl">
				<CardHeader className="border-b border-primary/10">
					<CardTitle className="text-xl flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
						Loading Community Chat...
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-grow flex items-center justify-center">
					<div className="text-center space-y-4">
						<Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
						<p className="text-muted-foreground">Loading messages...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="h-[600px] flex flex-col border-primary/10 bg-card/50 backdrop-blur-sm shadow-xl">
			<CardHeader className="border-b border-primary/10">
				<CardTitle className="text-xl flex items-center gap-2">
					<div
						className={`w-2 h-2 rounded-full ${isAuthenticated ? "bg-green-500 animate-pulse" : "bg-gray-500"} `}
					/>
					Live Community Chat
					{isAuthenticated && user && (
						<span className="text-xs text-muted-foreground ml-2">
							(Logged in as {user.name})
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow overflow-hidden p-0 flex flex-col">
				<ScrollArea className="flex-grow p-4" ref={scrollRef}>
					<div className="space-y-4">
						{messages.length === 0 ? (
							<div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-2">
								<Send className="w-8 h-8 opacity-20" />
								<p>Start the conversation! Encourage others attending.</p>
								{!isAuthenticated && (
									<Button
										variant="outline"
										size="sm"
										className="mt-4"
										onClick={() => (window.location.href = "/login")}>
										Login to Join the Conversation
									</Button>
								)}
							</div>
						) : (
							<div className="space-y-4">
								{messages.map((msg) => {
									const isCurrentUser =
										user?._id ===
										(typeof msg.user === "object" ? msg.user._id : msg.user);
									const userName =
										typeof msg.user === "object" ? msg.user.name : "Anonymous";
									const userEmail =
										typeof msg.user === "object" ? msg.user.email : "";
									const isAdmin =
										typeof msg.user === "object"
											? msg.user.role === "admin"
											: false;

									return (
										<div
											key={msg._id}
											className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
											<div className="flex-shrink-0">
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
														isAdmin
															? "bg-purple-500/20 ring-2 ring-purple-500/50"
															: isCurrentUser
																? "bg-primary/20 ring-2 ring-primary/30"
																: "bg-primary/20"
													}`}>
													<User
														className={`w-4 h-4 ${
															isAdmin ? "text-purple-500" : "text-primary"
														}`}
													/>
												</div>
												{isAdmin && (
													<div className="text-[8px] font-bold text-purple-500 text-center mt-1">
														ADMIN
													</div>
												)}
											</div>
											<div
												className={`max-w-[80%] space-y-1 ${isCurrentUser ? "items-end" : ""}`}>
												<div className="flex items-center gap-2 px-1">
													<p className="text-xs font-bold">
														{userName}
														{isAdmin && (
															<span className="ml-1 text-purple-500">👑</span>
														)}
													</p>
													<p className="text-[10px] text-muted-foreground">
														{format(new Date(msg.createdAt), "p")}
													</p>
												</div>
												<div
													className={`p-3 rounded-2xl text-sm ${
														isCurrentUser
															? "bg-primary text-primary-foreground rounded-tr-none"
															: "bg-background border border-primary/10 rounded-tl-none"
													}`}>
													{msg.message}
												</div>
												{!isCurrentUser && isAuthenticated && (
													<button
														onClick={() => {
															const replyText = prompt(
																"Reply to this message:",
																"",
															);
															if (replyText) handleReply(msg._id, replyText);
														}}
														className="text-[10px] text-primary/60 hover:text-primary ml-2 mt-1">
														Reply
													</button>
												)}
												{msg.replies && msg.replies.length > 0 && (
													<div className="ml-6 mt-2 pl-3 border-l-2 border-primary/20 space-y-3">
														{msg.replies.map((reply: any) => (
															<div key={reply._id} className="text-sm">
																<div className="flex items-center gap-2">
																	<p className="text-xs font-bold">
																		{typeof reply.user === "object"
																			? reply.user.name
																			: "Anonymous"}
																	</p>
																	<p className="text-[10px] text-muted-foreground">
																		{format(new Date(reply.createdAt), "p")}
																	</p>
																</div>
																<p className="text-muted-foreground">
																	{reply.message}
																</p>
															</div>
														))}
													</div>
												)}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</ScrollArea>
				<div className="p-4 bg-background/50 border-t border-primary/10">
					{!isAuthenticated ? (
						<div className="text-center space-y-2">
							<p className="text-sm text-muted-foreground">
								Please login to join the conversation
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => (window.location.href = "/login")}
								className="w-full">
								Login to Chat
							</Button>
						</div>
					) : (
						<div className="flex gap-2">
							<Input
								placeholder="Say something inspiring..."
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && !isSending && handleSend()
								}
								className="rounded-xl border-primary/20 bg-background/80"
								disabled={isSending}
							/>
							<Button
								onClick={handleSend}
								size="icon"
								className="rounded-xl bg-primary"
								disabled={isSending || !newMessage.trim()}>
								{isSending ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Send className="w-4 h-4" />
								)}
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
