import axios from "axios";

const instance = axios.create({
  baseURL: "https://asia-northeast1-chirper-aa4a4.cloudfunctions.net/api",
});

export default instance;
