exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors(200, {});
  if (event.httpMethod !== 'POST') return cors(405, { ok:false, error:'method_not_allowed' });
  try {
    const APPS_EXEC = process.env.APPS_EXEC;
    if (!APPS_EXEC) return cors(500, { ok:false, error:'missing_APPS_EXEC' });

    const r = await fetch(APPS_EXEC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body || '{}'
    });
    const text = await r.text();
    return cors(r.ok ? 200 : 500, text, true);
  } catch (e) {
    return cors(500, { ok:false, error:String(e) });
  }
};

function cors(status, body, passthrough=false) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: passthrough ? body : JSON.stringify(body),
  };
}
