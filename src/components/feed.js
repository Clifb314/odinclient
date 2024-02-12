import React, { useEffect, useState } from "react";
import { postList, getUserIcon } from "../utils/dataAccess";
import PostCard from "./postCard";
import MsgBox from "./slideInMsg";
import { checkUser } from "../utils/auth";
import { useParams } from "react-router-dom";

export default function feed() {
  const replyTemplate = {
    type: "", //post, reply, comment, edit
    postRef: null, //replying to a post (or comment), or editing a post
    commentRef: null, //if replying to a comment or editing
  };
  const [PopUpOpts, setPopupOpts] = useState(replyTemplate);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [slideIn, setSlideIn] = useState(null);
  const sorting = useParams().sorting;

  function closeSlideIn() {
    setSlideIn(null);
  }

  function displaySlideIn(type, message) {
    setSlideIn({ type, message });
    setTimeout(closeSlideIn, 5 * 1000);
  }

  const slideInComponent = slideIn ? (
    <MsgBox
      type={slideIn.type}
      message={slideIn.message}
      close={closeSlideIn}
    />
  ) : null;

  //popup reply functions
  function togglePopUp(keepOpen = false) {
    if (openPopUp && !keepOpen) {
      setOpenPopUp(false);
      setPopupOpts(replyTemplate);
    } else {
      setOpenPopUp(true);
    }
  }

  function populatePopUp(type, postRef, commentRef) {
    setPopupOpts({ type, postRef, commentRef });
    togglePopUp(true);
  }

  const floatBtn = openPopUp ? (
    <div className="popup open">
      <button type="button" onClick={toggleForm}>
        X
      </button>
      <PopupForm
        options={PopUpOpts}
        toggleOpen={openPopUp}
        slideIn={displaySlideIn}
      />
    </div>
  ) : (
    <div className="popup closed" onClick={toggleForm}>
      !
    </div>
  );

  //  server requests
  async function getPosts() {
    return await postList(sorting);
  }

  async function getUser() {
    const check = await checkUser();
    setUser(check);
  }

  useEffect(() => {
    const list = getPosts();
    setPosts(list);
    getUser();

    return () => setPosts([]);
  }, []);

  //  render posts
  const display =
    posts.length > 0 ? (
      <ul className="feedList">
        {posts.map((post) => {
          return (
            <li key={post._id}>
              <PostCard
                post={post}
                populateReply={populatePopUp}
                user={user}
                slideIn={displaySlideIn}
              />
            </li>
          );
        })}
      </ul>
    ) : (
      <p>Feed is empty..</p>
    );

  return (
    <div className="feed">
      {display}
      {slideInComponent}
      {floatBtn}
    </div>
  );
}
