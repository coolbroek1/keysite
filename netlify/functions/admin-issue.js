// Admin function: maakt key aan via Apps Script ZONDER het geheim in de browser te tonen
const APPS_SCRIPT_EXEC = "https://script.google.com/macros/s/AKfycby88BMm6jEbeEvEMV7Q4Pxv4k6riaizcYkuCPGIDLYJ45MF-zBS6UjOnkbwQB2YV2C9FQ/exec";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ ok:false, error:"method_not_allowed" }) };
  }

  try {
    const params = new URLSearchParams(event.body || "");
    const hwid = (params.get("hwid") || "").trim();
    const pin  = (params.get("pin")  || "").trim();

    // Deze 2 vars stel je in bij Netlify → Site settings → Environment variables
    const ADMIN_UI_PIN  = process.env.ADMIN_UI_PIN || "";
    const ADMIN_SECRET  = process.env.ADMIN_SECRET || "";

    if (!hwid) return { statusCode: 400, headers: cors(), body: JSON.stringify({ ok:false, error:"bad_hwid" }) };
    if (!pin || pin !== ADMIN_UI_PIN) {
      return { statusCode: 403, headers: cors(), body: JSON.stringify({ ok:false, error:"bad_pin" }) };
    }
    if (!ADMIN_SECRET) {
      return { statusCode: 500, headers: cors(), body: JSON.stringify({ ok:false, error:"server_no_admin_secret" }) };
    }

    // Call Apps Script admin endpoint
    const upstreamBody = new URLSearchParams({
      action: "admin_issue_key",
      secret: ADMIN_SECRET,
      hwid: hwid
    });

    const upstream = await fetch(APPS_SCRIPT_EXEC, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: upstreamBody.toString()
    });

    const text = await upstream.text();  // Apps Script geeft JSON
    return { statusCode: upstream.status, headers: corsJson(), body: text };

  } catch (e) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ ok:false, error:"admin_issue_fail" }) };
  }
};

function cors(){
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
  };
}
function corsJson(){
  return {
    ...cors(),
    "content-type": "application/json"
  };
}
