import 'react-native-paper';
import { ComponentProps } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { MD3Theme } from 'react-native-paper';

declare module 'react-native-paper' {
  export interface PaperProps {
    theme?: MD3Theme;
    style?: ViewStyle;
  }

  export interface TextProps extends ComponentProps<typeof Text> {
    variant?: VariantProp;
    theme?: MD3Theme;
    style?: TextStyle;
  }

  export interface SurfaceProps extends PaperProps {
    elevation?: number;
  }

  export interface IconButtonProps extends PaperProps {
    icon: string;
    size?: number;
    color?: string;
    disabled?: boolean;
    onPress?: () => void;
    mode?: 'contained' | 'outlined' | 'contained-tonal';
    selected?: boolean;
  }
} 