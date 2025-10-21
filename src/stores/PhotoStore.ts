import { create } from "zustand"
import * as ImagePicker from 'expo-image-picker';

export interface PhotoUpload {
  uri: string;
  fileName: string;
  mimeType: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface PhotoState {
  selectedPhoto: ImagePicker.ImagePickerAsset | PhotoUpload | null;
  previewUri: string | null;
  uploadProgress: number;
  isUploading: boolean;
  uploadError: string | null;
  lastUploaded: PhotoUpload | null;
}

export interface PhotoStore extends PhotoState {
  // Actions
  setSelectedPhoto: (photo: ImagePicker.ImagePickerAsset | PhotoUpload | null) => void;
  setPreviewUri: (uri: string | null) => void;
  setUploadProgress: (progress: number) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadError: (error: string | null) => void;
  setLastUploaded: (photo: PhotoUpload | null) => void;
  
  // Computed
  hasPhoto: () => boolean;
  getPhotoSize: () => number | null;
  getPhotoDimensions: () => { width: number; height: number } | null;
  isValidPhoto: () => boolean;
  getPhotoType: () => string | null;
  
  // Actions
  clearPhoto: () => void;
  clearUploadState: () => void;
  reset: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const usePhotoStore = create<PhotoStore>((set, get) => ({
  // Initial state
  selectedPhoto: null,
  previewUri: null,
  uploadProgress: 0,
  isUploading: false,
  uploadError: null,
  lastUploaded: null,

  // Actions
  setSelectedPhoto: (photo) => {
    set({ 
      selectedPhoto: photo,
      previewUri: photo?.uri || null,
      uploadError: null
    });
  },

  setPreviewUri: (uri) => set({ previewUri: uri }),

  setUploadProgress: (progress) => set({ 
    uploadProgress: Math.max(0, Math.min(100, progress))
  }),

  setUploading: (isUploading) => set({ isUploading }),

  setUploadError: (error) => set({ uploadError: error }),

  setLastUploaded: (photo) => set({ lastUploaded: photo }),

  // Computed
  hasPhoto: () => {
    const { selectedPhoto } = get();
    return selectedPhoto !== null;
  },

  getPhotoSize: () => {
    const { selectedPhoto } = get();
    if (!selectedPhoto) return null;
    
    if ('size' in selectedPhoto) {
      return selectedPhoto.size || null;
    }
    
    return null;
  },

  getPhotoDimensions: () => {
    const { selectedPhoto } = get();
    if (!selectedPhoto) return null;
    
    if ('width' in selectedPhoto && 'height' in selectedPhoto) {
      return {
        width: selectedPhoto.width || 0,
        height: selectedPhoto.height || 0
      };
    }
    
    return null;
  },

  isValidPhoto: () => {
    const { selectedPhoto } = get();
    if (!selectedPhoto) return false;
    
    // Verificar tipo
    const mimeType = 'mimeType' in selectedPhoto ? selectedPhoto.mimeType : selectedPhoto.type;
    if (!mimeType || !ALLOWED_TYPES.includes(mimeType)) {
      return false;
    }
    
    // Verificar tamanho
    const size = get().getPhotoSize();
    if (size && size > MAX_FILE_SIZE) {
      return false;
    }
    
    return true;
  },

  getPhotoType: () => {
    const { selectedPhoto } = get();
    if (!selectedPhoto) return null;
    
    if ('mimeType' in selectedPhoto) {
      return selectedPhoto.mimeType;
    }
    
    if ('type' in selectedPhoto) {
      return selectedPhoto.type;
    }
    
    return null;
  },

  // Actions
  clearPhoto: () => set({
    selectedPhoto: null,
    previewUri: null,
    uploadError: null
  }),

  clearUploadState: () => set({
    uploadProgress: 0,
    isUploading: false,
    uploadError: null
  }),

  reset: () => set({
    selectedPhoto: null,
    previewUri: null,
    uploadProgress: 0,
    isUploading: false,
    uploadError: null,
    lastUploaded: null
  })
}));

// Hook de compatibilidade
export const usePhoto = () => {
  const { 
    selectedPhoto, 
    previewUri, 
    setSelectedPhoto, 
    setPreviewUri,
    clearPhoto 
  } = usePhotoStore();
  
  return {
    upPhoto: selectedPhoto,
    setUpPhoto: setSelectedPhoto,
    image: previewUri,
    setImage: setPreviewUri,
    clearPhoto
  };
};
