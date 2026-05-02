import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View
} from 'react-native';
import { styles } from '../styles/appStyles';

type LoginScreenProps = {
  email: string;
  password: string;
  loading: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  onLogin: () => void;
};

export default function LoginScreen({
  email,
  password,
  loading,
  setEmail,
  setPassword,
  onLogin
}: LoginScreenProps) {
  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🔐</Text>
          </View>

          <Text style={styles.title}>Soluciones Tecnológicas SA</Text>
          <Text style={styles.subtitle}>Sistema Empresarial</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Ingrese su correo"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Ingrese su contraseña"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          <Pressable
            onPress={onLogin}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </Pressable>

          <Text style={styles.footer}>
            Acceso autorizado por administración
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}