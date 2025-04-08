// global.d.ts

declare module "expo-camera" {
    import { Component } from "react";
    import { ViewProps } from "react-native";
  
    // Adjust these props as needed from expo-camera docs
    export interface CameraProps extends ViewProps {
      type?: "front" | "back";
      onCameraReady?: () => void;
      ref?: any;
      // Add any additional props you need from expo-camera
    }
  
    export class Camera extends Component<CameraProps> {
      static requestCameraPermissionsAsync: () => Promise<{ status: string }>;
      takePictureAsync(options?: any): Promise<{ uri: string }>;
      // Add more methods as needed, e.g.:
      // pausePreview(): Promise<void>;
      // resumePreview(): Promise<void>;
    }
  }
  