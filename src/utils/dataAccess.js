import auth from "../../../../blogAPI/client/src/utils/auth";
import { googleAuth } from "../../../controllers/userController";
import { replaceOne } from "../../../models/userModel";
import { authHeader, authJson } from "./authHeader";

const USERURL = "http://localhost:5000/api/auth/";
const POSTURL = "http://localhost:5000/api/posts/";
const INBOXURL = "http://localhost:5000/api/inbox/";
const GUESTURL = "http://localhost:5000/api/";
const COMURL = "http://localhost:5000/api/comments/";

/*     -----user functions-----     */
export async function getUserList() {
  try {
    const response = await fetch(`${USERURL}userlist`, {
      method: "GET",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    if (!response.ok) {
      return data.message;
    } else {
      return data;
    }
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function getUserDetail(id) {
  try {
    const response = await fetch(USERURL + id, {
      method: "GET",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function getUserHome() {
  try {
    const response = await fetch(`${USERURL}home`, {
      method: "GET",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    if (!response.ok) {
      return data.message;
    } else {
      return data;
    }
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function getAccount() {
  try {
    const response = await fetch(`${USERURL}account`, {
      method: "GET",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function editAccount(body) {
  try {
    const response = await fetch(`${USERURL}account`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(body),
      headers: authJson(),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

// need to add google auth
export async function googleAuth() {
  try {
    const response = await fetch(USERURL + 'google', {
      method: "GET",
      mode: 'cors',
      headers: authHeader(),
    })
    const data = response.json()
    if (!response.ok) return {message: data.message, err: data.err}
    else return data

  } catch(err) {
    console.error("Error", err);
    return { err: "Could not access database" }
  }
}

export async function uploadIcon(image) {
  //image has to be from input type=file, wrapped in new formdata (?)
  //or send as blob
  try {
    const response = await fetch(USERURL + "icon", {
      method: "PUT",
      mode: "cors",
      headers: authHeader(),
      body: image,
    });
    const data = response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

//friends
export async function getFriendsList() {
  try {
    const response = await fetch(`${USERURL}friends`, {
      method: "GET",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    if (!response.ok) {
      return data.message;
    } else {
      return data;
    }
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function addFriend(id) {
  try {
    const response = await fetch(`${USERURL}add/${id}`, {
      method: "PUT",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function delFriend(id) {
  try {
    const response = await fetch(`${USERURL}delete/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

/*     -----Post functions-----     */
export async function createPost(body) {
  try {
    const response = await fetch(POSTURL + "post", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      headers: authJson(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function editPost(body, id) {
  try {
    const response = await fetch(`${POSTURL}${id}/edit`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(body),
      headers: authJson(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function delPost(id) {
  try {
    const response = await fetch(`${POSTURL}${id}/del`, {
      method: "DELETE",
      mode: "cors",
      headers: authHeader(),
    });
    const data = response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function likePost(id, direction) {
  try {
    const response = await fetch(`${POSTURL}${id}/${direction}`, {
      method: "PUT",
      mode: "cors",
      headers: authHeader(),
    });
    const data = response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function postList(sorting) {
  //sorting === top || recent
  try {
    const response = await fetch(`${POSTURL}list/${sorting}`, {
      method: "GET",
      mode: "cors",
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function postDetail(id) {
  try {
    const response = await fetch(POSTURL + id, {
      method: "GET",
      mode: "cors",
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

/*     -----Comment functions-----     */

export async function createComment(body) {
  try {
    const response = await fetch(COMURL + "post", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      headers: authJson(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function editComment(body, id, postid) {
  const query = new URLSearchParams({ postid });
  try {
    const response = await fetch(`${COMURL}${id}/edit/${query}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(body),
      header: authJson(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function delComment(id) {
  const query = new URLSearchParams({ postid });
  try {
    const response = await fetch(`${COMURL}${id}/del/${query}`, {
      method: "DELETE",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function likeComment(id, direction) {
  //direction  = up || down
  try {
    const response = await fetch(COMURL + id + direction, {
      method: "PUT",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function commentList(postid) {
  const query = new URLSearchParams({ postid });
  try {
    const response = await fetch(COMURL + "/all/" + query, {
      method: "GET",
      mode: "cors",
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function commentDetail(id) {
  try {
    const response = await fetch(COMURL + id, {
      method: "GET",
      mode: "cors",
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

/*     -----Inbox functions-----     */

export async function sendInbox(body) {
  try {
    const response = await fetch(INBOXURL + "send", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      headers: authJson(),
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function deleteInbox(id) {
  try {
    const response = await fetch(INBOXURL + id + "/delete", {
      method: "DELETE",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function readInbox(id) {
  try {
    const response = await fetch(INBOXURL + id + "/seen", {
      method: "PUT",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    return data.message;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function getInboxList() {
  try {
    const response = await fetch(INBOXURL + "all", {
      method: "GET",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

export async function inboxDetail(id) {
  try {
    const response = await fetch(INBOXURL + id, {
      method: "GET",
      mode: "cors",
      headers: authHeader(),
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}

/*     -----Guest functions-----     */
export async function guestHome() {
  try {
    const response = await fetch(GUESTURL + "home", {
      method: "GET",
      mode: "cors",
    });
    const data = await response.json();
    if (!response.ok) return data.message;
    else return data;
  } catch (err) {
    console.error("Error", err);
    return { err: "Could not access database" };
  }
}
