import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReferencePhotoUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ReferencePhotoUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ReferencePhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store file paths for signed URL generation
  const [imagePaths, setImagePaths] = useState<Map<string, string>>(new Map());

  const uploadFile = async (file: File): Promise<string | null> => {
    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return null;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    
    // Validate file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      setError("Only JPG, PNG, GIF, and WebP images are allowed");
      return null;
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("reference-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    // Generate a signed URL for secure access (1 hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("reference-images")
      .createSignedUrl(filePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Signed URL error:", signedUrlError);
      return null;
    }

    // Store the file path for later deletion
    setImagePaths(prev => new Map(prev).set(signedUrlData.signedUrl, filePath));

    return signedUrlData.signedUrl;
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);
      
      // Check remaining slots
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      // Filter valid image files
      const validFiles = fileArray
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, remainingSlots);

      if (validFiles.length === 0) {
        setError("Please upload valid image files");
        return;
      }

      setIsUploading(true);

      try {
        const uploadPromises = validFiles.map(uploadFile);
        const uploadedUrls = await Promise.all(uploadPromises);
        const successfulUploads = uploadedUrls.filter((url): url is string => url !== null);

        if (successfulUploads.length > 0) {
          onImagesChange([...images, ...successfulUploads]);
        }

        if (successfulUploads.length < validFiles.length) {
          setError("Some images failed to upload");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError("Failed to upload images");
      } finally {
        setIsUploading(false);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    async (index: number) => {
      const imageUrl = images[index];
      
      // Get file path from our stored map, or try to extract from URL
      let filePath = imagePaths.get(imageUrl);
      
      if (!filePath) {
        // Fallback: try to extract from signed URL path
        const urlParts = imageUrl.split("/reference-images/");
        if (urlParts.length > 1) {
          // Remove query parameters from signed URL
          filePath = urlParts[1].split("?")[0];
        }
      }
      
      if (filePath) {
        await supabase.storage.from("reference-images").remove([filePath]);
        // Remove from our path map
        setImagePaths(prev => {
          const newMap = new Map(prev);
          newMap.delete(imageUrl);
          return newMap;
        });
      }
      
      onImagesChange(images.filter((_, i) => i !== index));
    },
    [images, onImagesChange, imagePaths]
  );

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {canAddMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-all duration-300
            ${isDragging 
              ? "border-secondary bg-secondary/10" 
              : "border-border hover:border-secondary/50 hover:bg-muted/30"
            }
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("photo-upload")?.click()}
        >
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-secondary animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop your inspiration photos here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse • {images.length}/{maxImages} photos
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Grid */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-3"
        >
          <AnimatePresence>
            {images.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden group border border-border"
              >
                <img
                  src={url}
                  alt={`Reference ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with number */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {images.length === 0 && !canAddMore && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No reference photos uploaded</p>
        </div>
      )}
    </div>
  );
}
