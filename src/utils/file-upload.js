import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./constants";
// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const body = localStorage.getItem("data");
const file = new Blob([body], { type: "application/json" });
const filename = localStorage.getItem("sessionId") + ".json";

// download the file from the browser
const a = document.createElement("a");
document.body.appendChild(a);
a.style = "display: none";
const url = URL.createObjectURL(file);
a.href = url;
a.download = filename;
a.click();
window.URL.revokeObjectURL(url);

(async () => {
  const { data, error } = await supabase.storage
    .from("results")
    .upload(filename, file);

  if (error) {
    console.error(error);
    const datav = document.getElementById("data");
    const errorv = document.getElementById("error");
    errorv.innerText = "Error: " + error.statusCode + " " + error.message;
    datav.innerText = body;
    return;
  } else if (data) {
    console.log(data);
    window.location.href = "/reset";
  }
})();
