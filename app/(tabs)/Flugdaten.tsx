import { Platform } from 'react-native'

const Flugdaten = Platform.OS === 'web'
    ? require('./Flugdaten.web').default
    : require('./Flugdaten.native').default

export default Flugdaten
