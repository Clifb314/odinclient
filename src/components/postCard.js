import React, { useEffect, useRef, useState } from "react";
import {
  likePost,
  delPost,
  getUserIcon,
  commentList,
  likeComment,
} from "../utils/dataAccess";
import CommentCard from "./commentCard";
import { Link } from "react-router-dom";
import { useAuthContext } from "../utils/useAuth";
import Icons from "../utils/svgHelper";

export default function PostCard({ post, populateReply, slideIn }) {
  const [displayCom, setDisplayCom] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [commentDetails, setCommentDetails] = useState([]);
  const [clickedLike, setClickedLike] = useState(null)
  const [likedComments, setLikedComments] = useState([])
  const { user } = useAuthContext();
  async function displayIcon(id) {
    const imgBlob = await getUserIcon(id);
    //error handling?
    if (imgBlob.err || imgBlob.message) return null;
    else return setImgSrc(URL.createObjectURL(imgBlob));
  }

  async function getCommentsDetails(postid) {
    const response = await commentList(postid);
    if (response.err) slideIn("error", response.err);
    else setCommentDetails(response);
  }

  useEffect(() => {
    if (post.author.icon) {
      console.log(post);
      displayIcon(post.author._id);
    }

    if (post.comments?.length > 0) {
      getCommentsDetails(post._id);
    }
  }, []);

  //ref to the list of comment nodes
  const replyRef = useRef(null);

  function toggleComments() {
    displayCom ? setDisplayCom(false) : setDisplayCom(true);
  }

  async function handleVote(direction) {
    const response = await likePost(post._id, direction);
    if (response.err) {
      slideIn("error", response.err);
    } else {
      const msg = direction === "up" ? "Nice!" : "Ick!";
      const setFill = direction === "up" ? true : false
      setClickedLike(setFill)
      slideIn("success", msg);
    }
  }

  async function handleCommentVote(id, direction) {
    const response = await likeComment(id, direction);
    if (response.err) slideIn("error", response.err);
    else {
      const msg = direction === "up" ? "Nice!" : "Ick!";
      if (direction === 'up') {
        //update comments from state
        console.log(commentDetails)
        setCommentDetails(
          commentDetails.map(comment => {

            if (comment._id === id) {
              const output = {
                ...comment,
                likes: [...comment.likes, user._id]
              }
              return output
            } else {
              return comment
            }
          }) 
        )
        console.log(commentDetails)
      } else {
        console.log(commentDetails)
        setCommentDetails(
          commentDetails.map(comment => {
            if (comment._id === id) {
              const output = {
                ...comment,
                likes: comment.likes.filter(liker => liker !== user._id)
              }
              return output
            } else return comment
          })
        )
        console.log(commentDetails)
      }
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
    let output = target.shift();
    output.replyTo = null
    return output ? output : null;
  }

  function handleScroll(id) {
    //scroll to comment on click
    const listNode = replyRef.current;
    console.log(listNode)
    const replyArr = [...listNode
      .querySelectorAll("li")]
      .filter((node) => node.id === id);
    const replyNode = replyArr.shift();
    console.log(replyNode)
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
    populateReply("edit", post, null);
  }

  const checkLen =
    post.comments && post.comments.length > 0 ? (
      <span onClick={toggleComments} className="showComments">
        <Icons iconName={'expand'} />
        {post.comments.length}
      </span>
    ) : (
      <p className="showComments">Be the first to comment!</p>
    );

  const display =
    commentDetails.length > 0 ? (
      <ul ref={replyRef}>
        {commentDetails.map((comment) => {
          const checkUser = user._id === comment.author?._id ? true : false;
          const buttons =
            <div className="interactBtn">
            <span
              hidden={checkUser ? true : false}
              onClick={() => openComment("reply", comment)}
            >
              <Icons iconName={"comment"} />
            </span>
            <span
              hidden={checkUser ? false : true}
              onClick={() => openComment("edit", comment)}
            >
              <Icons iconName={"edit"} />
            </span>
            <span
              hidden={(comment.likes.includes(user._id) && !likedComments.includes(comment._id)) || likedComments.includes(comment._id)}
              className="like-icon"
              onClick={() => handleCommentVote(comment._id, "up")}
            >
              <Icons iconName={"heart"} />
            </span>
            <span
              hidden={!comment.likes.includes(user._id) && !likedComments.includes(comment._id)}
              className="dislike-icon"
              onClick={() => handleCommentVote(comment._id, "down")}
            >
              <Icons iconName={"heart-filled"} />
            </span>
          </div>


          return (
            <li key={comment._id} id={comment._id}>
              <div>
                <CommentCard
                  comment={comment}
                  findReply={getReplyToComment}
                  scroll={handleScroll}
                  slideIn={slideIn}
                />
                {user._id === null ? <p>Log in to interact!</p>
                 : buttons}
              </div>
            </li>
          );
        })}
      </ul>
    ) : null;

  const userIcon = imgSrc ? <div className="post-icon"><img alt={post.author.username + "'s icon"} src={imgSrc} className="icon" /></div> : null;

  const buttons =
    user._id === post.author?._id ? (
      <div className="interactBtn">
        <span onClick={openEdit}>
          <Icons iconName={"edit"} />
        </span>
        <span onClick={() => handleDelete(post._id)}>
          <Icons iconName={"delete"} />
        </span>
      </div>
    ) : (
      <div className="interactBtn">
        <span
          hidden={(post.likes.includes(user._id) && clickedLike === null) || clickedLike === true}
          className="like-icon"
          onClick={() => handleVote("up")}
        >
          <Icons iconName={"heart"} />
        </span>
        <span
          hidden={(!post.likes.includes(user._id) && clickedLike === null) || clickedLike === false}
          className="dislike-icon"
          onClick={() => handleVote("down")}
        >
          <Icons iconName={"heart-filled"} />
        </span>
        <span onClick={() => openComment("comment", post, null)}>
          <Icons iconName={"comment"} />
        </span>
      </div>
    );

  return (
    <div className="postCard">
      {userIcon}
      <p>
        <Link className="user-link" to={`/users/${post.author?._id}`}>
          {post.author?.username}
        </Link>
      </p>
      <p className="postTitle">{post.title}</p>
      <p>{post.content}</p>
      <p className="likes">Score: {post.likes?.length}</p>
      <p className="timestamp">{new Date(post.date).toLocaleString()}</p>

      {user._id === null ? <p>Log in to interact!</p> : buttons}
      {displayCom ? (
        <div className="commentsSection">
          {display}
          <span onClick={toggleComments} className="showComments">
            <Icons iconName={'unexpand'} />
          </span>
        </div>
      ) : (
        <div>{checkLen}</div>
      )}
    </div>
  );
}
