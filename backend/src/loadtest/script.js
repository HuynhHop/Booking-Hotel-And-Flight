import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 200 },
    { duration: "1m", target: 300 },
  ],
};

const BASE = "https://be-haf.onrender.com/v1/api";

export default function () {

  // get all hotels
  const hotels = http.get(`${BASE}/hotels`);
  check(hotels, {
    "GET /hotels status 200": (r) => r.status === 200,
  });

  // get all rooms
  const rooms = http.get(`${BASE}/rooms`);
  check(rooms, {
    "GET /rooms status 200": (r) => r.status === 200,
  });

  sleep(1);
}