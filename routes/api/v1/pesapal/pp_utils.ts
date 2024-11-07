type paramsType = {
  url: string;
  consumer_key: string;
  consumer_secret: string;
};
/**
 * @description Get access token
 * @param params - url, consumer_key, consumer_secret
 * @returns - access token
 */
export const getAccessToken = async (params: paramsType) => {
  const { url, consumer_key, consumer_secret } = params;
  // headers
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // payload
  const body = {
    consumer_key,
    consumer_secret,
  };
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.status !== "200") {
          reject(data);
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * @description Get IPN URL
 * @param path - the to the callback route e.g `/pesapal/callback`
 * - Must start with `/`
 * @returns
 */
export const getIPNUrl = (path: string) => {
  const IPN_BASE_URL: string | undefined = process.env.IPN_BASE_URL;
  const API_VERSION: string | undefined = process.env.API_VERSION;

  // the envs must be defined!!!
  if (!IPN_BASE_URL) {
    throw new Error("IPN_BASE_URL is not defined");
  } else if (!API_VERSION) {
    throw new Error("API_VERSION is not defined");
  }

  return `${IPN_BASE_URL}/api/${API_VERSION}${path}`;
};
