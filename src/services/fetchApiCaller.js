export const getData = () => {
  const requestOptions = {
    method: "GET",
  };
  return fetch(
    "https://run.mocky.io/v3/09a1870d-294b-4d53-ac4f-87b676ddd000",
    requestOptions
  );
};
