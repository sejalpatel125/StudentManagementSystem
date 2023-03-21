import axios from "axios";
import http from "../http-common";

const upload = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  const img = axios.post("https://api.upload.io/v2/accounts/kW15b9R/uploads/form_data", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": "Bearer public_kW15b9R4HvUmETFkxGmwp4LrPDhv"
    },
    onUploadProgress,
  });
  return img;
};

const getFiles = (url) => {
  return http.get(url);
};

const FileUploadService = {
  upload,
  getFiles,
};

export default FileUploadService;
