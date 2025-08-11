// Proxy naar je Google Apps Script /exec (voor Roblox executors)
const APPS_SCRIPT_EXEC = "https://script.google.com/macros/s/AKfycby88BMm6jEbeEvEMV7Q4Pxv4k6riaizcYkuCPGIDLYJ45MF-zBS6UjOnkbwQB2YV2C9FQ/exec";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      body: JSON.stringify({ ok: false, error: "method_not_allowed" })
    };
  }

  try {
    const upstream = await fetch(APPS_SCRIPT_EXEC, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": "NetlifyKeyProxy/1.0"
      },
      body: event.body || ""
    });

    const text = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      body: text
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      body: JSON.stringify({ ok: false, error: "upstream_error" })
    };
  }
};
