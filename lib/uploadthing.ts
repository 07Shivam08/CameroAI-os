import {
  generateUploadButton,
  generateUploadDropzone,
  generateComponents,
} from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { Uploader } = generateComponents<OurFileRouter>();