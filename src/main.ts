import "./style.css";
import { setupCounter } from "./popup/counter";

let isAuthenticated = false;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="link_popup"  >
   <h4>Linedin Comments<h4/>
   <p>Sign in with linkedin</p>
   <button id="sign-in-btn" > Sign in </button>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#sign-in-btn")!);
