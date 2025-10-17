// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//  Ensure default icon set is MDI
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})
