import { createClient } from "@supabase/supabase-js";
// Create a single supabase client for interacting with your database
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

const body = localStorage.getItem("data");
const file = new Blob([body], { type: "application/json" });
const filename = localStorage.getItem("sessionId") + ".json";

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
    // window.location.href = "/reset";
  }
})();
