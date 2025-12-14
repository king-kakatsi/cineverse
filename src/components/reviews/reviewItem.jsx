import { ModifyButton } from "../ui/button/modifyButton";
import { Trash } from "../ui/button/trashButton";
import { RatingEmoji } from "../../components/ui/button/ratingEmoji";
import { getFullDate } from "@/helpers/dateHelper";
import { CommentReply } from '../reviews/commentReply';
import { RATING_EMOJIS } from "@/helpers/constants";

export const ReviewItem = ({ 
    review, 
    user, 
    handleDeleteClick, 
    handleOpenUpdateModal,
    getFilmById
}) => {
    
    const canManageReview = user?.email === review.user_email || user?.role === "admin";
    // const film = getFilmById(review?.film_id);
    
    return (
        <div key={review.id} className="bg-gray-900/50 border-gray-800 p-6 rounded-lg">
            <div className="pt-0">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {/* Reviewer Info */}
                        <div>
                            <p className="font-semibold text-white">
                                {review.user_name}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <RatingEmoji rating={review.rating} size="sm" />
                                    <span className="text-sm font-medium text-white">
                                        {RATING_EMOJIS[review.rating].label}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {getFullDate(new Date(review.created_date))}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Review Buttons */}
                    <div className="flex flex-row gap-1">
                        {/* Reply button*/}
                        <span
                            onClick={() =>
                                handleOpenUpdateModal(
                                    review, 
                                    "reply",
                                    "Write your comment..."
                                )
                            }
                        >
                            <button className="justify-self-start mt-0 px-2 cursor-pointer hover:underline hover:text-red-500 text-white">
                                reply
                            </button>
                        </span>
                        
                        {/* Review Trash button */}
                        {canManageReview && (
                            <span onClick={() => handleDeleteClick(review.id, "your review")}>
                                <Trash className="text-gray-400 hover:text-red-500 w-4 h-4 border cursor-pointer" />
                            </span>
                        )}
                        
                        {/* Review Update button */}
                        {user?.email === review.user_email && (
                            <div>
                                <span
                                    onClick={() =>
                                        handleOpenUpdateModal(
                                            review,
                                            "update",
                                            "Update your review..."
                                        )
                                    }
                                >
                                    <ModifyButton className="text-gray-400 hover:text-red-500 w-4 h-4 border  cursor-pointer" />
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Review Comment */}
                {review.comment && (
                    <p className="text-gray-300">{review.comment}</p>
                )}
                
                {/* DISPLAY COMMENT REPLIES */}
                {review.replies && review.replies.length > 0 && (
                    <div className="mt-4">
                        {review.replies.map((reply) => (
                            <CommentReply 
                                key={reply.id} 
                                reply={reply} 
                                user={user} 
                                onModifyReply={handleOpenUpdateModal} 
                                onDeleteReply={handleDeleteClick} 
                                handleOpenUpdateModal={handleOpenUpdateModal}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};