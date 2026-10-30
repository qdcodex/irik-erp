import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "nnpd12vl",
  api_key: process.env.CLOUDINARY_API_KEY || "426115746794265",
  api_secret: process.env.CLOUDINARY_API_SECRET || "w0O9oOIpv7-RQhoWD4hcadW4poQ",
  secure: true,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  created_at: string;
}

export class CloudinaryService {
  /**
   * Upload a Buffer to Cloudinary
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string = "irik-erp/documents",
    resourceType: "image" | "raw" | "auto" = "auto"
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload stream error:", error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error("Cloudinary returned empty result"));
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
            created_at: result.created_at,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  /**
   * Upload a Base64 string or data URI
   */
  async uploadBase64(
    base64Data: string,
    folder: string = "irik-erp/avatars"
  ): Promise<CloudinaryUploadResult> {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: "auto",
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at,
    };
  }

  /**
   * Delete an asset by public ID
   */
  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === "ok";
    } catch (err) {
      console.error("Cloudinary delete error:", err);
      return false;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
