import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import AppBackground from '../components/AppBackground';

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
    <AppBackground scroll={false}>
      <KeyboardAvoidingView
        style={localStyles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={localStyles.card}>
          <View style={localStyles.iconCircle}>
            <Text style={localStyles.iconText}>🔐</Text>
          </View>

          <Text style={localStyles.title}>Soluciones Tecnológicas</Text>

          <Text style={localStyles.subtitle}>
            Acceso móvil empresarial
          </Text>

          <View style={localStyles.formGroup}>
            <Text style={localStyles.label}>Correo electrónico</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={localStyles.input}
            />
          </View>

          <View style={localStyles.formGroup}>
            <Text style={localStyles.label}>Contraseña</Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={localStyles.input}
            />
          </View>

          <Pressable
            style={[
              localStyles.button,
              loading && localStyles.buttonDisabled
            ]}
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={localStyles.buttonText}>Ingresar</Text>
            )}
          </Pressable>

          <Text style={localStyles.footerText}>
            Acceso autorizado por administración
          </Text>
        </View>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const localStyles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 32,
    padding: 26,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8
  },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 18
  },
  iconText: {
    fontSize: 34
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6
  },
  subtitle: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700'
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  footerText: {
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '800',
    marginTop: 18,
    fontSize: 13
  }
});