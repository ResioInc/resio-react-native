import Config from 'react-native-config';

export const verifyConfiguration = () => {
  console.log('🔍 Configuration Verification:');
  console.log('================================');
  
  // Check if Config is loaded
  console.log('Config object exists:', !!Config);
  
  // Check key environment variables
  const requiredVars = [
    'ENVIRONMENT',
    'API_BASE_URL',
    'API_TIMEOUT'
  ];
  
  requiredVars.forEach(varName => {
    const value = Config[varName];
    console.log(`${varName}:`, value ? `✅ ${value}` : '❌ Missing');
  });
  
  console.log('================================');
  
  // Return validation result
  return requiredVars.every(varName => !!Config[varName]);
}; 