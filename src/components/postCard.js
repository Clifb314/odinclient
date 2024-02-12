import React, { useEffect, useRef, useState } from "react";
import { likePost, delPost, getUserIcon } from "../utils/dataAccess";
import CommentCard from "./commentCard";
import { Link } from "react-router-dom";

export default function PostCard({ post, populateReply, user, slideIn }) {
  const [displayCom, setDisplayCom] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  async function displayIcon(id) {
    const imgBlob = await getUserIcon(id);
    //error handling?
    if (imgBlob.err) return null;
    else return URL.createObjectURL(imgBlob);
  }

  useEffect(() => {
    if (post.author._id) {
      setImgSrc(displayIcon(post.author._id));
    }
  });

  //ref to the list of comment nodes
  const replyRef = useRef(null);

  function toggleComments() {
    displayCom ? setDisplayCom(false) : setDisplayCom(true);
  }

  async function handleVote(direction) {
    const response = await likePost(direction);
    if (response.err) {
      slideIn("error", response.err);
    } else {
      const msg = direction === up ? "Nice!" : "Ick!";
      slideIn("success", msg);
    }
  }

  async function handleDelete(id) {
    const response = await delPost(id);
    if (response.err) slideIn("error", response.err);
    else slideIn("success", "Post deleted");
  }

  function getReplyToComment(id) {
    //to preview the comment on mouseover
    const target = post.comments.filter((comment) => comment._id === id);
    const output = target.shift();
    return output ? output : null;
  }

  function handleScroll(id) {
    //scroll to comment on click
    const listNode = replyRef.current;
    const replyArr = listNode
      .querySelectorAll("li")
      .filter((node) => node.key === id);
    const replyNode = replyArr.shift();
    replyNode.scrollIntoView({
      behavior: "smooth",
    });
  }

  function openComment(type, comment) {
    //  options: type, post, comment
    populateReply(type, post, comment);
  }

  function openEdit() {
    //options: type, post, comment
    populateReply("post", post, null);
  }

  const checkLen =
    post.comments.length > 0 ? (
      <p onClick={toggleComments}>Show {post.comments.length} comments...</p>
    ) : (
      <p>Be the first to comment!</p>
    );

  const display =
    post.comments.length > 0 ? (
      <ul ref={replyRef}>
        {post.comments.map((comment) => {
          const checkUser = user._id === comment.author._id ? true : false;
          return (
            <li key={comment._id}>
              <div>
                <CommentCard
                  comment={comment}
                  findReply={getReplyToComment}
                  scroll={handleScroll}
                  slideIn={slideIn}
                />
                <p
                  hidden={checkUser ? true : false}
                  onClick={() => openComment("reply", comment)}
                >
                  Reply
                </p>
                <button
                  hidden={checkUser ? false : true}
                  type="button"
                  onClick={() => openComment("edit", comment)}
                >
                  Edit
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    ) : null;

  const userIcon = imgSrc ? <img src={imgSrc} className="icon" /> : null;

  const buttons =
    user._id === post.author._id ? (
      <div className="interactBtn">
        <button type="button" onClick={openEdit}>
          Edit
        </button>
        <button type="button" onClick={() => handleDelete(post._id)}>
          Delete
        </button>
      </div>
    ) : (
      <div className="interactBtn">
        <button type="button" onClick={() => handleVote("up")}>
          Like
        </button>
        <button type="button" onClick={() => handleVote("down")}>
          Dislike
        </button>
        <button
          type="button"
          onClick={() => openComment("comment", post, null)}
        >
          Comment
        </button>
      </div>
    );

  return (
    <div className="postCard">
      {userIcon}
      <p>
        <Link to={`/users/${post.author._id}`}>{post.author.username}</Link>
      </p>
      <p>{post.title}</p>
      <p>{post.content}</p>
      <p>{post.date}</p>
      <p>{post.likes.length}</p>
      {buttons}
      {displayCom ? (
        <div className="commentsSection">
          {display}
          <p onClick={toggleComments}>collapse</p>
        </div>
      ) : (
        { checkLen }
      )}
    </div>
  );
}
