import React, { useEffect, useState } from "react";
import { likeComment, getUserIcon } from "../utils/dataAccess";
import PopupReply from "./popupReply";
import { Link } from "react-router-dom";

export default function CommentCard({ comment, findReply, scroll, slideIn }) {
  const [hovering, setHovering] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  async function handleVote(direction) {
    const response = await likeComment(comment._id, direction);
    if (response.err) slideIn("error", response.err);
    else {
      const msg = direction === "up" ? "Nice!" : "Ick!";
      slideIn("success", msg);
    }
  }

  async function displayIcon(id) {
    const imgBlob = await displayIcon(id);
    if (imgBlob.err) return null; //error handling
    else return URL.createObjectURL(imgBlob);
  }

  useEffect(() => {
    if (comment.author._id) {
      setImgSrc(displayIcon(comment.author._id));
    }
  });

  const userIcon = imgSrc ? <img src={imgSrc} className="icon" /> : null;

  //  tiktok/4chan style replying to comments (no nesting)
  //  click to scroll to reply, hover to preview comment
  const replyLine = comment.replyTo ? (
    <div>
      <p
        onMouseOver={() => setHovering(true)}
        onMouseOut={() => setHovering(false)}
      >
        replying to{" "}
        <span onClick={() => scroll(comment.replyTo._id)}>
          {comment.replyTo.author.username}
        </span>
      </p>
      <PopupReply hovering={hovering} reply={findReply(comment.replyTo._id)} />
    </div>
  ) : (
    <p></p>
  );

  return (
    <div className="commentCard">
      {replyLine}
      {userIcon}
      <p>
        <Link to={`/users/${comment.author._id}`}>
          {comment.author.username}
        </Link>
      </p>
      <p>{comment.content}</p>
      <p>{comment.date}</p>
      <p>{comment.likes.length}</p>
      <div className="interactBtn">
        <button type="button" onClick={() => handleVote("up")}>
          Like
        </button>
        <button type="button" onClick={() => handleVote("down")}>
          Dislike
        </button>
      </div>
    </div>
  );
}
