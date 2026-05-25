import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../App';
import { loginWithEmail } from '../services/authService';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingrese su correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithEmail(email.trim(), password);
      if (result.success && result.user) {
        login(result.user);
      } else {
        Alert.alert('Credenciales incorrectas', result.error ?? 'El correo o contraseña no son válidos.');
      }
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo conectar. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@recovery.com');
    setPassword('123456');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header / Logo Area */}
          <View style={styles.headerArea}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="medical" size={52} color="#FFFFFF" />
              </View>
              <View style={styles.logoAccent} />
            </View>
            <Text style={styles.appTitle}>Recovery App</Text>
            <Text style={styles.appSubtitle}>Gestión de Clínica de Rehabilitación</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>
            <Text style={styles.cardSubtitle}>Ingrese sus credenciales para continuar</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={emailFocused ? '#2196F3' : '#9E9E9E'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#BDBDBD"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={passwordFocused ? '#2196F3' : '#9E9E9E'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#BDBDBD"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9E9E9E"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#FFFFFF" style={styles.btnIcon} />
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Demo</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Demo Credentials */}
            <TouchableOpacity style={styles.demoBox} onPress={fillDemo} activeOpacity={0.7}>
              <Ionicons name="information-circle-outline" size={16} color="#2196F3" style={{ marginRight: 6 }} />
              <View>
                <Text style={styles.demoTitle}>Credenciales de demostración</Text>
                <Text style={styles.demoText}>admin@recovery.com / 123456</Text>
                <Text style={styles.demoHint}>Toca para autocompletar</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#9E9E9E" />
            <Text style={styles.footerText}>  Acceso seguro y encriptado</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2196F3' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  headerArea: { alignItems: 'center', paddingTop: 40, paddingBottom: 32 },
  logoContainer: { position: 'relative', marginBottom: 16 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  logoAccent: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  appTitle: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  appSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: 'center', maxWidth: 240, lineHeight: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#212121', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#757575', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#424242', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperFocused: { borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 15, color: '#212121' },
  eyeButton: { padding: 4 },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: { opacity: 0.7 },
  btnIcon: { marginRight: 8 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: '#9E9E9E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  demoTitle: { fontSize: 12, fontWeight: '700', color: '#1976D2', marginBottom: 2 },
  demoText: { fontSize: 13, color: '#1565C0', fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  demoHint: { fontSize: 11, color: '#64B5F6', marginTop: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
});
