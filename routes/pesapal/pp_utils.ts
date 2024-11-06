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
