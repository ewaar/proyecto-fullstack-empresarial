import { ImageBackground, SafeAreaView, ScrollView, ViewStyle } from 'react-native';
import { styles } from '../styles/appStyles';

type AppBackgroundProps = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
};

export default function AppBackground({
  children,
  scroll = true,
  contentStyle
}: AppBackgroundProps) {
  if (scroll) {
    return (
      <ImageBackground
        source={require('../../assets/fondo-app.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.appOverlay}>
          <ScrollView contentContainerStyle={[styles.dashboardContainer, contentStyle]}>
            {children}
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/fondo-app.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.appOverlay}>{children}</SafeAreaView>
    </ImageBackground>
  );
}