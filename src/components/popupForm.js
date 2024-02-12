import React, { useEffect, useState } from "react";
import {
  createComment,
  createPost,
  editPost,
  editComment,
} from "../utils/dataAccess";

export default function PopupForm({ options, toggleOpen, slideIn }) {
  //  options: type, post, comment
  //  type = reply, comment, post, edit
  //  for reply, commentRef is the comment replying to,
  //  for edit it's the comment being edited
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit() {
    let post = {
      content,
    };
    if (options.type === "post") {
      post.title = title;
    } else if (options.type === "reply") {
      post.replyTo = commentRef._id;
    }

    const submitPost = options.type === "post" ? createPost : createComment;
    const response = submitPost(post, options.postRef._id);
    if (response.err) slideIn("error", response.err);
    else {
      slideIn("success", `${options.type} submitted!`);
      toggleOpen();
    }
  }

  async function handleEdit() {
    let post = {
      content,
    };
    if (options.type === "edit" && !options.commentRef) {
      post.title = title;
      editID = postid;
    } else {
      //post.replyTo = replying
      editID = commentRef._id;
    }

    const submitEdit = type === "post" ? editPost : editComment;
    const response = submitEdit(post, editID, postRef._id);
    if (response.err) slideIn("error", response.err);
    else {
      slideIn("success", `${options.type} submitted!`);
    }
  }

  useEffect(() => {
    if (type === "edit") {
      setContent(commentRef.content);
      editing.title ? setTitle(editing.title) : null;
    }
    return () => {
      setContent("");
      setTitle("");
    };
  }, []);

  return (
    <div className="popup">
      <form id="popup Form">
        <input
          hidden={type === "post" ? false : true}
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={setTitle}
        />
        <textarea
          value={content}
          id="content"
          name="content"
          onChange={setContent}
        />
        <button type="button" className="Btn cancel" onClick={toggleOpen}>
          Cancel
        </button>
        <button
          hidden={editing ? true : false}
          type="button"
          className="Btn send"
          onClick={handleSubmit}
        >
          Send
        </button>
        <button
          hidden={editing ? false : true}
          type="button"
          className="Btn edit"
          onClick={handleEdit}
        >
          Edit
        </button>
      </form>
    </div>
  );
}
