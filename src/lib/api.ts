import nProgress from "nprogress";

export async function fetchApiWithProgress(url: string, options?: RequestInit) {
  nProgress.start();
  try {
    const response = await fetch(url, options);
    return response;
  } finally {
    nProgress.done();
  }
}
