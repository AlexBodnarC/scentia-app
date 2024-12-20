import { GET_PLAN_URL } from "./secureData/secureData";
import { BEARER_TOKEN } from "./secureData/secureData";

export const requestPlan = async (topic: string, duration: string) => {
  const body = JSON.stringify({
    topic,
    duration,
  });

  try {
    if (!GET_PLAN_URL || !BEARER_TOKEN) {
      throw new Error("Missing requestPlanUrl or token");
    }

    const response = await fetch(GET_PLAN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.text();

    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
