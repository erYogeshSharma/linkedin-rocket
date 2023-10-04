import MessageType from "../shared/constants/message-types";
import STORAGE_KEYS from "../shared/constants/storage-keys";
import extensionStorage from "../shared/storage/storage";
import Auth, { API } from "./modules/auth";

const auth = new Auth();
chrome.runtime.onMessage.addListener(async (request) => {
  switch (request.type) {
    // listen to the event
    case MessageType.GET_COMMENT:
      await processGenerateCommentRequest(request);
      break;
    case MessageType.START_AUTH:
      await auth.start_auth();
      await auth.check_for_auth_code();
      break;
    default:
      console.log("unknown request type", request.type);
  }
});

async function processGenerateCommentRequest(request: any) {
  console.log({ request });
  let response: {
    type: string;
    error?: any;
    parentForm?: Element;
    comment?: string;
  } = {
    type: "generate-comment-response",
    error: "something went wrong",
  };

  try {
    const token = await extensionStorage.get(STORAGE_KEYS.TOKEN);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const res = await fetch(`${API}/comment/generate-comment`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        commentType: request.buttonType,
        description: request.description,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const json = await res.json();
    const comment = json.comment;

    response = {
      type: "generate-comment-response",
      parentForm: request.parentForm,
      comment: comment,
    };
  } catch (error) {
    response = {
      type: "generate-comment-response",
      error: error,
    };
  }

  // send the event with response
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, response, function (response) {
        console.log("send response", response);
      });
    }
  );
}
