import Logger from "../shared/utils/logger";

const logger = new Logger();
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.type) {
    // listen to the event
    case "generate-comment":
      await processGenerateCommentRequest(request);
      break;
    case "start-auth":
      await startAuth();
      break;

    default:
      console.log("unknown request type", request.type);
  }
});

const API = "https://fa99-2401-4900-1cc4-b34f-3a3c-1357-bb55-da33.ngrok-free.app";

let starting = false;
async function startAuth() {
  starting = true;
  try {
    const response = await fetch(`${API}/auth/auth-url`, { method: "post" });
    const data = await response.json();

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },

      function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id as number,
          { type: "redirect", redirect_url: data.url },
          function (response) {
            console.log("send redirect url", data.url);
          }
        );
      }
    );
    starting = false;
  } catch (error) {
    console.log(error);
  }
}

chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },

  function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id as number, { type: "alert" }, function (response) {
      console.log("send redirect url");
    });
  }
);

async function authenticate(access_code: string) {
  starting = true;
  try {
    const response = await fetch(`${API}/auth/auth-code/${access_code}`, { method: "post" });
    const data = await response.json();
    if (data) {
      console.log(data);
      chrome.storage.local.set(data, function () {
        console.log("saved");
        //  Data's been saved boys and girls, go on home
      });
    }
    starting = false;
  } catch (error) {
    console.log({ error });
    starting = false;
  }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url?.includes("linkedin")) {
    const url = new URL(changeInfo.url);
    let search = url.search;
    if (search.includes("?code=")) {
      search = search.replace("?code=", "");
      if (!starting) {
        authenticate(search);
      }
    }
    // do something here
  }
});

async function processGenerateCommentRequest(request: any) {
  // const config = {
  //   text: request.text,
  //   commentType: request.buttonType,
  // };

  let response: {
    type: string;
    error?: any;
    parentForm?: any;
    comment?: string;
  } = {
    type: "generate-comment-response",
    error: "something went wrong",
  };

  try {
    const res = await fetch("https://dummyjson.com/products/1");

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const json = await res.json();
    const comment = json.description;

    response = {
      type: "generate-comment-response",
      parentForm: request.parentForm,
      comment:
        "Absolutely thrilled to hear about your recent promotion, [Name]! 🎉🚀 Your dedication and hard work have truly paid off, and it's well-deserved. Your leadership and expertise continue to inspire those around you, and I have no doubt you'll excel in this new role. Looking forward to witnessing your continued success and growth. Congratulations once again! 🥳👏 #CareerMilestone #Leadership #SuccessStory",
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

logger.error("An error occurred!", { errorCode: 500 });
logger.info("Information message", { key: "value" });
logger.warning("This is a warning.");
logger.success("Task completed successfully.");
